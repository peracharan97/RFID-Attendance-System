#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <hd44780.h>
#include <hd44780ioClass/hd44780_I2Cexp.h>

// ===== PIN CONFIG =====
#define SS_PIN D4
#define RST_PIN D3
#define BUZZER_PIN D8
#define TOGGLE_PIN D0

// ===== OBJECTS =====
hd44780_I2Cexp lcd(0x27); // Confirmed I2C address
MFRC522 rfid(SS_PIN, RST_PIN);
WiFiClient client;
HTTPClient http;

// ===== WIFI =====
const char* ssid = "Lakshmi";
const char* password = "9492940596";

// ===== RFID CONFIG =====
#define BLOCK_NUMBER 4 // Use block 4 (sector 1) for roll number
MFRC522::MIFARE_Key keyA = { {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF} }; // Default key A

// ===== FUNCTION DECLARATIONS =====
bool writeRFIDTag(String rollNo);
String fetchRollNoFromAPI();
void resetRFID();
void beep(int times = 1, int duration = 200);

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  pinMode(TOGGLE_PIN, INPUT_PULLUP); // Assuming toggle if needed, but not used yet

  // Init LCD
  lcd.begin(16, 2);
  lcd.print("Initializing...");
  Serial.println("Initializing...");

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  lcd.clear();
  lcd.print("WiFi Connected");

  // Init RFID
  SPI.begin();
  rfid.PCD_Init();
  lcd.clear();
  lcd.print("Ready to Scan");
  Serial.println("RFID Initialized. Ready to scan.");
}

void loop() {
  // Display ready on LCD
  lcd.setCursor(0, 0);
  lcd.print("Ready to Scan   "); // Padded to clear leftovers

  // Check for RFID card
  resetRFID();
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    delay(100);
    return;
  }

  beep(1); // Beep on card detect
  lcd.clear();
  lcd.print("Card Detected");
  Serial.println("Card detected. Fetching roll no...");

  // Fetch from API
  String rollNo = fetchRollNoFromAPI();
  if (rollNo.length() == 0) {
    lcd.setCursor(0, 1);
    lcd.print("API Failed");
    Serial.println("API fetch failed!");
    beep(3, 100); // Error beeps
    rfid.PICC_HaltA();
    delay(2000);
    return;
  }

  // Trim to exactly 10 chars if needed (API returns 10 like "22501A1292")
  if (rollNo.length() > 10) {
    rollNo = rollNo.substring(0, 10);
  } else if (rollNo.length() < 10) {
    // Pad if shorter, but assuming API gives exactly 10
    while (rollNo.length() < 10) rollNo += ' ';
  }

  Serial.println("Writing roll number: " + rollNo);
  lcd.setCursor(0, 1);
  lcd.print("Writing...");

  if (writeRFIDTag(rollNo)) {
    Serial.println("Write successful!");
    lcd.clear();
    lcd.print("Write Success");
    beep(2); // Success beeps
  } else {
    Serial.println("Write failed!");
    lcd.clear();
    lcd.print("Write Failed");
    beep(3, 100);
  }

  rfid.PICC_HaltA(); // Stop communication with card
  delay(3000); // Wait before next scan
}

// ===== FUNCTIONS =====
String fetchRollNoFromAPI() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected");
    return "";
  }

  http.begin(client, "http://localhost:8080/dummy");
  int httpCode = http.GET();
  if (httpCode == HTTP_CODE_OK) {
    String payload = http.getString();
    payload.trim(); // Remove any whitespace
    Serial.println("API response: " + payload);
    http.end();
    return payload;
  } else {
    Serial.println("HTTP GET failed, code: " + String(httpCode));
    http.end();
    return "";
  }
}

bool writeRFIDTag(String rollNo) {
  // Authenticate sector (using trailer block for sector 1: block 7, but for data block 4 auth is fine via any block in sector)
  // Better to auth with trailer if changing keys, but here using block 4
  MFRC522::StatusCode status = rfid.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, BLOCK_NUMBER, &keyA, &(rfid.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.println("Authentication failed: " + String(rfid.GetStatusCodeName(status)));
    return false;
  }

  // Prepare exactly 16-byte block: 10 chars rollNo + 6 spaces pad
  byte buffer[16];
  for (int i = 0; i < 16; i++) {
    buffer[i] = (i < rollNo.length()) ? rollNo[i] : ' '; 
  }

  // Write to block
  status = rfid.MIFARE_Write(BLOCK_NUMBER, buffer, 16);
  if (status != MFRC522::STATUS_OK) {
    Serial.println("Write failed: " + String(rfid.GetStatusCodeName(status)));
    return false;
  }

  return true;
}

void resetRFID() {
  digitalWrite(RST_PIN, LOW);
  delay(50);
  digitalWrite(RST_PIN, HIGH);
  rfid.PCD_Init();
  // Serial.println("RFID Reset"); // Optional, comment if noisy
}

void beep(int times, int duration) {
  for (int i = 0; i < times; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(duration);
    digitalWrite(BUZZER_PIN, LOW);
    delay(duration);
  }
}