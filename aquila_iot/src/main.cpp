#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// --- HW pins from diagram.json ---
#define DHT_PIN 15
#define DHT_TYPE DHT22
#define PIR_PIN 13
#define LDR_PIN 34
#define POT_PIN 35

// Configure these for your environment
const char* WIFI_SSID = "Wokwi-GUEST"; // Wokwi default guest network
const char* WIFI_PASS = "";

// Most reliable local backend address for this setup.
// Set this to the IP address of the Windows host running the backend.
const char* DEFAULT_SERVER_URL = "http://192.168.42.204:3000";

// Possible URLs to reach a local backend from Wokwi / VS Code simulation.
// Try the Windows host LAN IP first, then local container/host aliases.
const char* SERVER_CANDIDATES[] = {
  DEFAULT_SERVER_URL,
  "http://192.168.42.204:3000",
  "http://localhost:3000",
  "http://host.docker.internal:3000",
  "http://10.0.2.2:3000",
  "http://10.13.37.1:3000"
};
const int SERVER_CANDIDATES_COUNT = sizeof(SERVER_CANDIDATES) / sizeof(SERVER_CANDIDATES[0]);
String SERVER_URL = "";
int nextSnapshotImageId = 0;

const unsigned long TELEMETRY_INTERVAL_MS = 15000; // 15s

DHT dht(DHT_PIN, DHT_TYPE);

String macAddressString() {
  // Для симуляції можна задати фіксовану MAC через build flag: -D FIXED_MAC=\"AA:BB:CC:DD:EE:01\"
#ifdef FIXED_MAC
  return String(FIXED_MAC);
#else
  uint8_t mac[6];
  esp_read_mac(mac, ESP_MAC_WIFI_STA);
  char buf[18];
  sprintf(buf, "%02X:%02X:%02X:%02X:%02X:%02X", mac[0],mac[1],mac[2],mac[3],mac[4],mac[5]);
  return String(buf);
#endif
}

void wifiConnect() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print('.');
    if (millis() - start > 20000) break;
  }
  Serial.println();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("WiFi connected, IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("WiFi not connected (continuing offline)");
  }
}

bool httpPostJson(const String &url, const String &json, int &outCode, String &outBody) {
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  outCode = http.POST(json);
  if (outCode > 0) {
    outBody = http.getString();
  } else {
    outBody = "";
    Serial.printf("HTTP POST error for %s: %d\n", url.c_str(), outCode);
  }
  http.end();
  return outCode > 0;
}

bool httpGet(const String &url, int &outCode, String &outBody) {
  HTTPClient http;
  http.begin(url);
  outCode = http.GET();
  if (outCode > 0) {
    outBody = http.getString();
  } else {
    outBody = "";
    Serial.printf("HTTP GET error for %s: %d\n", url.c_str(), outCode);
  }
  http.end();
  return outCode > 0;
}

bool testServerUrl(const String &baseUrl) {
  String url = baseUrl + "/api/devices";
  int code; String body;
  if (httpGet(url, code, body) && code == 200) {
    return true;
  }
  return false;
}

bool resolveServerUrl() {
  for (int i = 0; i < SERVER_CANDIDATES_COUNT; i++) {
    String candidate = String(SERVER_CANDIDATES[i]);
    Serial.printf("Trying backend: %s\n", candidate.c_str());
    if (testServerUrl(candidate)) {
      SERVER_URL = candidate;
      Serial.printf("Using backend: %s\n", SERVER_URL.c_str());
      return true;
    }
  }

  // Fallback to the known default backend URL if candidate probing fails.
  SERVER_URL = String(DEFAULT_SERVER_URL);
  Serial.printf("Falling back to default backend: %s\n", SERVER_URL.c_str());
  if (testServerUrl(SERVER_URL)) {
    Serial.println("Default backend is reachable.");
    return true;
  }

  return false;
}

bool ensureDeviceRegistered(const String &mac) {
  String url = SERVER_URL + "/api/devices/by-mac/" + mac;
  int code; String body;
  if (httpGet(url, code, body)) {
    if (code == 200) {
      Serial.println("Device exists on server");
      return true;
    }
  }

  // Try to create device
  String createUrl = SERVER_URL + "/api/devices";
  String payload = "{";
  payload += "\"roomId\":null,";
  payload += "\"name\":\"ESP32 Wokwi\",";
  payload += "\"macAddress\":\"" + mac + "\",";
  payload += "\"type\":\"multi_sensor\"";
  payload += "}";

  if (httpPostJson(createUrl, payload, code, body)) {
    Serial.printf("Register device response %d\n", code);
    if (code == 201 || code == 200) return true;
  }
  return false;
}

void sendSnapshot(const String &mac, const char* reason) {
  String url = SERVER_URL + "/api/snapshots";
  unsigned long timestamp = millis();
  String seed = String(timestamp) + "-" + String(nextSnapshotImageId++);
  String imageUrl = "https://picsum.photos/seed/" + seed + "/640/480";

  String payload = "{";
  payload += "\"macAddress\":\"" + mac + "\",";
  payload += "\"imageUrl\":\"" + imageUrl + "\",";
  payload += "\"reason\":\"" + String(reason) + "\"";
  payload += "}";

  Serial.printf("Sending snapshot URL: %s\n", imageUrl.c_str());
  int code; String body;
  if (httpPostJson(url, payload, code, body)) {
    Serial.printf("Snapshot POST %d -> %s\n", code, body.c_str());
  } else {
    Serial.printf("Snapshot POST failed to connect to %s\n", url.c_str());
  }
}

void sendTelemetry(const String &mac, float temperature, float humidity, int lightLevel, int soundLevel) {
  String url = SERVER_URL + "/api/telemetry";
  char buf[256];
  snprintf(buf, sizeof(buf),
    "{\"macAddress\":\"%s\",\"temperature\":%.2f,\"humidity\":%.2f,\"lightLevel\":%d,\"soundLevel\":%d}",
    mac.c_str(), temperature, humidity, lightLevel, soundLevel
  );
  String payload = String(buf);
  int code; String body;
  if (httpPostJson(url, payload, code, body)) {
    Serial.printf("Telemetry POST %d -> %s\n", code, body.c_str());
  } else {
    Serial.println("Telemetry POST failed to connect");
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  randomSeed(micros());
  dht.begin();
  pinMode(PIR_PIN, INPUT);
  Serial.println("Aquila ESP32 starting...");
  wifiConnect();

  String mac = macAddressString();
  Serial.print("MAC: "); Serial.println(mac);
  if (WiFi.status() == WL_CONNECTED) {
    if (!resolveServerUrl()) {
      Serial.println("No reachable backend server found. Check the host IP or use ngrok.");
    } else {
      if (!ensureDeviceRegistered(mac)) {
        Serial.println("Warning: device not registered on server");
      }
    }
  }
}

void loop() {
  static unsigned long lastTelemetry = 0;
  static int lastPirState = LOW;
  unsigned long now = millis();

  // PIR check (motion -> send snapshot)
  int pir = digitalRead(PIR_PIN);
  if (pir == HIGH && lastPirState == LOW) {
    Serial.println("Motion detected! Sending snapshot...");
    sendSnapshot(macAddressString(), "motion_detected");
  }
  lastPirState = pir;

  if (now - lastTelemetry >= TELEMETRY_INTERVAL_MS) {
    lastTelemetry = now;

    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("Failed to read DHT sensor");
      temperature = 0; humidity = 0;
    }

    int rawLdr = analogRead(LDR_PIN);
    int lightLevel = map(rawLdr, 0, 4095, 0, 10000);

    int rawPot = analogRead(POT_PIN);
    int soundLevel = map(rawPot, 0, 4095, 0, 150);

    Serial.printf("T=%.2f H=%.2f L=%d S=%d\n", temperature, humidity, lightLevel, soundLevel);
    sendTelemetry(macAddressString(), temperature, humidity, lightLevel, soundLevel);
  }

  delay(100);
}