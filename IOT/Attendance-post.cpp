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

// ===== API BASE =====
const String baseURL = "http://192.168.0.107:8080/attendance-post/";

// ===== RFID CONFIG =====
#define BLOCK_NUMBER 4 // Same block used for writing roll number or role
MFRC522::MIFARE_Key keyA = { {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF} }; // Default key A

// ===== FACULTY CONTROL =====
bool attendanceActive = false; // Default: FALSE (students cannot post)

// ===== FUNCTION DECLARATIONS =====
void connectToWiFi();
String readRFIDBlock(); // Reads the 10-char string from block
bool isFacultyCard();
String sendRequest(String rollNo, String section, int sem);
void buzz(int type);
void resetRFID();
void toggleAttendanceMode();
void updateDisplay();

void setup() {
  Serial.begin(115200);
  Serial.println("Reset cause: " + ESP.getResetReason());

  SPI.begin();
  rfid.PCD_Init();
  Serial.println("RFID Initialized");

  Wire.begin(D2, D1); // SDA = D2, SCL = D1
  if (lcd.begin(16, 2) == 0) {
    Serial.println("LCD Initialized Successfully");
    lcd.backlight();
    lcd.setCursor(0, 0);
    lcd.print("Starting...");
  } else {
    Serial.println("LCD Initialization Failed");
    lcd.clear();
    lcd.print("LCD Failed!");
    while (1) yield(); // Halt if LCD fails
  }

  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(TOGGLE_PIN, INPUT_PULLUP); // Active-high toggle

  lcd.setCursor(0, 0);
  lcd.print("Connecting WiFi ");
  connectToWiFi();

  // Initial state: Attendance OFF
  updateDisplay();
}

void loop() {
  // Check WiFi status
  if (WiFi.status() != WL_CONNECTED) {
    lcd.clear();
    lcd.print("WiFi Disconnected");
    Serial.println("WiFi disconnected, reconnecting...");
    connectToWiFi();
    updateDisplay();
  }

  // Check free heap (optional debug)
  Serial.println("Free heap: " + String(ESP.getFreeHeap()));

  // Check for RFID card with timeout
  resetRFID(); // Reset RFID to prevent hangs
  unsigned long startTime = millis();
  bool cardPresent = false;
  while (millis() - startTime < 1000) { // 1-second timeout
    if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
      cardPresent = true;
      break;
    }
    yield();
  }
  if (!cardPresent) {
    delay(100); // Prevent tight loop
    return;
  }

  // Read the data from the card block
  String cardData = readRFIDBlock();
  Serial.println("Card Data: " + cardData);
  rfid.PICC_HaltA(); // Halt early for faculty check

  // Check if faculty card based on data containing "faculty"
  if (isFacultyCard(cardData)) {
    toggleAttendanceMode();
    buzz(2); // Long beep for faculty action
    delay(1000);
    updateDisplay();
    return;
  }

  // Student card - only process if attendance active
  if (!attendanceActive) {
    lcd.clear();
    lcd.print("Attendance OFF");
    lcd.setCursor(0, 1);
    lcd.print("Faculty First!");
    buzz(3); // Error beep (triple short)
    Serial.println("Attendance not active - ignoring student card");
    delay(2000);
    updateDisplay();
    return;
  }

  // Use cardData as rollNo for student
  String rollNo = cardData;
  Serial.println("Student Roll No: " + rollNo);

  int sem = digitalRead(TOGGLE_PIN) == HIGH ? 6 : 5;
  String section = "IT-2";

  Serial.println("DEBUG: Semester=" + String(sem));

  lcd.clear();
  lcd.print("Marking...");
  lcd.setCursor(0, 1);
  lcd.print("Sem:" + String(sem));

  String response = sendRequest(rollNo, section, sem);
  Serial.println("Response: " + response);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(response.substring(0, 16));
  if (response.length() > 16) {
    lcd.setCursor(0, 1);
    lcd.print(response.substring(16, 32));
  }
  
  bool success = (response.indexOf("recorded") != -1);
  buzz(success ? 1 : 2); // Short for success, long for error

  delay(2000);
  updateDisplay();
}

// ===== FACULTY FUNCTIONS =====
bool isFacultyCard(String data) {
  // Check if the read data contains "faculty" (case-insensitive for flexibility)
  String lowerData = data;
  lowerData.toLowerCase();
  return (lowerData.indexOf("faculty") != -1);
}

void toggleAttendanceMode() {
  attendanceActive = !attendanceActive;
  
  if (attendanceActive) {
    Serial.println("Attendance SESSION STARTED by faculty");
  } else {
    Serial.println("Attendance SESSION ENDED by faculty");
  }
}

void updateDisplay() {
  lcd.clear();
  if (attendanceActive) {
    lcd.print("Attendance ON ");
    lcd.setCursor(0, 1);
    lcd.print("Scan Student ID");
  } else {
    lcd.print("Attendance OFF");
    lcd.setCursor(0, 1);
    lcd.print("Faculty Tap First");
  }
}

// ===== RFID READ FUNCTION =====
String readRFIDBlock() {
  // Authenticate the sector for the block
  MFRC522::StatusCode status = rfid.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, BLOCK_NUMBER, &keyA, &(rfid.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.println("Authentication failed: " + String(rfid.GetStatusCodeName(status)));
    return "AUTH_FAILED";
  }

  // Read the block
  byte buffer[18]; // 16 bytes data + 2 bytes CRC
  byte size = 18;
  status = rfid.MIFARE_Read(BLOCK_NUMBER, buffer, &size);
  if (status != MFRC522::STATUS_OK) {
    Serial.println("Read failed: " + String(rfid.GetStatusCodeName(status)));
    return "READ_FAILED";
  }

  // Convert first 10 bytes to string (trim spaces)
  String data = "";
  for (int i = 0; i < 10; i++) {
    if (buffer[i] != ' ') { // Optional: trim trailing spaces
      data += (char)buffer[i];
    } else if (data.length() > 0) {
      // Stop at first space if needed, but keep as is for "contains" check
    }
  }
  data.trim(); // Remove leading/trailing spaces
  return data;
}

// ===== EXISTING FUNCTIONS =====
void connectToWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting");
  lcd.setCursor(0, 1);
  lcd.print("                "); // Clear second line
  lcd.setCursor(0, 1);
  lcd.print("IP:Connecting...");
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    lcd.setCursor(attempts % 16, 1);
    lcd.print(".");
    yield();
    attempts++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected! IP:");
    Serial.println(WiFi.localIP());
    lcd.setCursor(0, 1);
    lcd.print("IP:");
    lcd.print(WiFi.localIP());
    delay(2000); // Show IP briefly
  } else {
    Serial.println("\nWiFi connection failed");
    lcd.setCursor(0, 1);
    lcd.print("WiFi Failed!");
    delay(2000);
  }
}

String sendRequest(String rollNo, String section, int sem) {
  String url = baseURL + rollNo + "/" + section + "/" + String(sem);
  Serial.println("Requesting: " + url);
  if (http.begin(client, url)) {
    int httpCode = http.GET();
    String response = "";
    if (httpCode > 0) {
      response = http.getString();
    } else {
      response = "HTTP Error: " + String(httpCode);
    }
    http.end();
    return response;
  } else {
    Serial.println("HTTP begin failed");
    return "HTTP Begin Failed";
  }
}

void buzz(int type) {
  if (type == 1) { // Success: short beep
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
  } else if (type == 2) { // Error/Faculty: long beep
    digitalWrite(BUZZER_PIN, HIGH);
    delay(500);
    digitalWrite(BUZZER_PIN, LOW);
  } else if (type == 3) { // Triple error beep
    for (int i = 0; i < 3; i++) {
      digitalWrite(BUZZER_PIN, HIGH);
      delay(100);
      digitalWrite(BUZZER_PIN, LOW);
      delay(100);
    }
  }
}

void resetRFID() {
  digitalWrite(RST_PIN, LOW);
  delay(50);
  digitalWrite(RST_PIN, HIGH);
  rfid.PCD_Init();
  // Serial.println("RFID Reset"); // Reduced noise
}