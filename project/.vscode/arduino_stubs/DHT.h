#pragma once
#include "Arduino.h"

#ifndef DHT22
#define DHT22 22
#endif

class DHT {
public:
  DHT(int pin, int type) {}
  void begin() {}
  float readTemperature() { return 0.0f; }
  float readHumidity() { return 0.0f; }
};
