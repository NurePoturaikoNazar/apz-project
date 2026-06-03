#pragma once
#include <string>
#include <stdint.h>

class String {
  std::string s_;
public:
  String() {}
  String(const char* c) : s_(c ? c : "") {}
  String(const std::string &s) : s_(s) {}
  const char* c_str() const { return s_.c_str(); }
  std::string str() const { return s_; }
  String operator+(const String &o) const { return String(s_ + o.s_); }
  String operator+(const char* o) const { return String(s_ + (o?o:"")); }
  const char* c_str() { return s_.c_str(); }
};

void pinMode(int, int);
int digitalRead(int);
int analogRead(int);
int map(int, int, int, int, int);
void delay(unsigned long);
unsigned long millis();

class SerialClass {
public:
  void begin(int) {}
  void println(const char*) {}
  void println(const String&) {}
  void print(const char*) {}
  void print(const String&) {}
  void printf(const char*, ...) {}
};
extern SerialClass Serial;

#define LOW 0
#define HIGH 1

extern "C" int esp_read_mac(uint8_t* mac, int type);
#define ESP_MAC_WIFI_STA 0
