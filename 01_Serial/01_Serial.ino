void setup() {
  Serial.begin(9600);
}

void loop() {
  int a0Val = analogRead(A0);
  Serial.println(a0Val);
  delay(2);
}
