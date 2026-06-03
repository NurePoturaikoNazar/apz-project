#pragma once
#include "Arduino.h"

class IPAddress {
public:
  String toString() const { return String("0.0.0.0"); }
};

class WiFiClass {
public:
  void begin(const char* ssid, const char* pass) {}
  int status() { return 3; }
  IPAddress localIP() { return IPAddress(); }
};

extern WiFiClass WiFi;
#define WL_CONNECTED 3
