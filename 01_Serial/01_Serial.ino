#include <ArduinoJson.h>

int potPin = A0; // Potentiometer connected to A0

void setup() {
  Serial.begin(9600); // Start serial communication
}

void loop() {
  int potValue = analogRead(potPin); // Read potentiometer value (0–4095 for ESP32, 0–1023 for Arduino Uno)

  // Create a JSON object
  StaticJsonDocument<200> doc;
  doc["data"]["A0"]["value"] = potValue;

  // Serialize JSON to string
  String output;
  serializeJson(doc, output);

  // Send JSON over Serial
  Serial.println(output);

  delay(100); // Short delay
}
