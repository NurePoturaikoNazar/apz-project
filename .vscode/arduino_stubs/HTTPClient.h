#pragma once
#include "Arduino.h"

class HTTPClient {
public:
  bool begin(const String& url) { return true; }
  void addHeader(const char* name, const char* value) {}
  int POST(const String& payload) { return 200; }
  String getString() { return String(""); }
  void end() {}
};
