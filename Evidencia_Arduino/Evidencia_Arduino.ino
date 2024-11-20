#include "DHT.h"
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Pines
int potPin = A0;        // Potenciómetro
int ledPin = D0;        // LED
int trigPin = D6;       // Trig del sensor ultrasónico
int echoPin = D5;       // Echo del sensor ultrasónico
int pirPin = D7;        // Sensor PIR
int buzzerPin = D3;     // Buzzer
int DHTPin = D4;        // Sensor de temperatura
int FAN = D8;
int lectura;

// Parámetros del DHT
#define DHTTYPE DHT11  // O DHT22 dependiendo de tu sensor
DHT dht(DHTPin, DHTTYPE);

// Inicializa el LCD en la dirección 0x27 (cambia si es necesario)
LiquidCrystal_I2C lcd(0x27, 16, 2);

#define WIFI_SSID "Tec-IoT"
#define WIFI_PASSWORD "spotless.magnetic.bridge"

// Definición de URLs para GET y POST
String IP = "http://10.22.133.37:3000";
String loadTemps = IP + "/iot/api/insertTemperature/";
String loadHumid = IP + "/iot/api/insertHumedad/";
String loadDist = IP + "/iot/api/insertDistance/";
String loadPres = IP + "/iot/api/insertPresence/";
String loadLight = IP + "/iot/api/insertPorcentaje/";
String loadST = IP + "/iot/api/insertST";
String getTermSens = IP + "/iot/api/getST";
String reset = IP + "/iot/api/resetRegisters";

HTTPClient httpClient;
WiFiClient wClient;

void setup() {
  // Configuración de pines
  pinMode(ledPin, OUTPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(pirPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  pinMode(FAN, OUTPUT);
  
  // Iniciar comunicación serial
  Serial.begin(9600);
  Serial.println("LABEL,hora,lectura");
  
  // Iniciar el sensor DHT
  dht.begin();
  
  // Iniciar el LCD
  lcd.init();
  lcd.backlight(); // Encender la luz de fondo

  // Conectar a la red WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando a red WiFi \"");
  Serial.print(WIFI_SSID);
  Serial.print("\"");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConexión WiFi establecida.");

}

void loop() {
  // Leer valor del potenciómetro y ajustar el LED
  int potValue = analogRead(potPin);
  int ledValue = map(potValue, 0, 1023, 255, 0); // Convertir valor para el LED (PWM)
  int light = potValue/1024;
  analogWrite(ledPin, ledValue);
  
  // Leer y mostrar datos del sensor de temperatura (DHT11)
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(t) || isnan(h)) {
    Serial.println("Error al leer el sensor DHT");
  } else {
    Serial.print("Temperatura: ");
    Serial.print(t);
    Serial.print(" *C, Humedad: ");
    Serial.print(h);
    Serial.println(" %");
  }

  double STavg = logIntentoGETselect();

  Serial.print(STavg);

  // Control del ventilador según la temperatura
  if (STavg >= 28) {
    digitalWrite(FAN, HIGH);
  } else {
    digitalWrite(FAN, LOW);
  }
  
  // Mostrar temperatura y humedad en el LCD
  lcd.setCursor(0, 0); // Fila 0
  lcd.print("Temp: ");
  lcd.print(t);
  lcd.print("C");

  lcd.setCursor(0, 1); // Fila 1
  lcd.print("Humi: ");
  lcd.print(h);
  lcd.print("%");

  double ST = -42.379 + 2.04901523 * (t * 9.0 / 5.0 + 32.0) + 10.14333127 * h - 0.22475541 * (t * 9.0 / 5.0 + 32.0) * h - 0.00683783 * (t * 9.0 / 5.0 + 32.0) * (t * 9.0 / 5.0 + 32.0) - 0.05481717 * h * h + 0.00122874 * (t * 9.0 / 5.0 + 32.0) * (t * 9.0 / 5.0 + 32.0) * h + 0.00085282 * (t * 9.0 / 5.0 + 32.0) * h * h - 0.00000199 * (t * 9.0 / 5.0 + 32.0) * (t * 9.0 / 5.0 + 32.0) * h * h;

  ST =  (ST - 32.0) / 1.8;

  // Leer y mostrar datos del sensor ultrasónico
  long duration, distance;
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = (duration * 0.034 / 2);  // Calcular distancia en cm
  
  int presence;
  String detection;
  // Leer el estado del sensor PIR y activar el buzzer si detecta movimiento
  int pirState = digitalRead(pirPin);
  if (pirState == HIGH) {
    Serial.println("Movimiento detectado");
    presence = 1;
    detection = "V";
  } else {
    presence = 0;
    detection = "F";
  }


  // Serializar y mostrar los datos en el monitor
  Serial.print("DATA,TIME,");
  Serial.print(distance);
  Serial.print(",");
  Serial.print(h);
  Serial.print(",");
  Serial.print(t);
  Serial.print(",");
  Serial.print(presence);
  Serial.print(",");
  Serial.println(potValue);

  delay(1000);

  logIntentoPOSinsert(t,h,distance,detection,light,ST);

}

// Método POST para insertar en la base de datos
// Método POST para insertar en la base de datos
void logIntentoPOSinsert(float tmp, float hum, float dst, String prs, float lht, double ST) {
  // Create the JSON payload with only the temperature
  String jsonPayloadtemp = "{\"valor\":" + String(tmp) + "}";
  String jsonPayloadhumid = "{\"valor\":" + String(hum) + "}";
  String jsonPayloaddist = "{\"valor\":" + String(dst) + "}";
  String jsonPayloadpres = "{\"valor\":\"" + prs + "\"}";
  String jsonPayloadSensTerm = "{\"valor\":" + String(ST) + "}";

  Serial.print(jsonPayloadpres);
  String jsonPayloadlight = "{\"valor\":" + String(lht) + "}";

  if (WiFi.status() == WL_CONNECTED) {
    httpClient.begin(wClient, loadTemps); // Use base URL for the request
    httpClient.addHeader("Content-Type", "application/json"); // Set content type to JSON
    
    // Send the POST request with the JSON payload
    int httpResponseCode = httpClient.POST(jsonPayloadtemp); 

    Serial.println("HTTP Response Code: " + String(httpResponseCode));
    if (httpResponseCode > 0) {
      Serial.println(httpClient.getString()); // Print the server response
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode); // Print error code if request fails
    }

    httpClient.end(); // Close connection

    httpClient.begin(wClient, loadHumid); // Use base URL for the request
    httpClient.addHeader("Content-Type", "application/json"); // Set content type to JSON
    
    // Send the POST request with the JSON payload
    httpResponseCode = httpClient.POST(jsonPayloadhumid); 

    Serial.println("HTTP Response Code: " + String(httpResponseCode));
    if (httpResponseCode > 0) {
      Serial.println(httpClient.getString()); // Print the server response
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode); // Print error code if request fails
    }

    httpClient.end(); // Close connection
    
    httpClient.begin(wClient, loadDist); // Use base URL for the request
    httpClient.addHeader("Content-Type", "application/json"); // Set content type to JSON
    
    // Send the POST request with the JSON payload
    httpResponseCode = httpClient.POST(jsonPayloaddist); 

    Serial.println("HTTP Response Code: " + String(httpResponseCode));
    if (httpResponseCode > 0) {
      Serial.println(httpClient.getString()); // Print the server response
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode); // Print error code if request fails
    }

    httpClient.end(); // Close connection

    httpClient.begin(wClient, loadPres); // Use base URL for the request
    httpClient.addHeader("Content-Type", "application/json"); // Set content type to JSON
    
    // Send the POST request with the JSON payload
    httpResponseCode = httpClient.POST(jsonPayloadpres); 

    Serial.println("HTTP Response Code: " + String(httpResponseCode));
    if (httpResponseCode > 0) {
      Serial.println(httpClient.getString()); // Print the server response
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode); // Print error code if request fails
    }

    httpClient.end(); // Close connection

    httpClient.begin(wClient, loadLight); // Use base URL for the request
    httpClient.addHeader("Content-Type", "application/json"); // Set content type to JSON
    
    // Send the POST request with the JSON payload
    httpResponseCode = httpClient.POST(jsonPayloadlight); 

    Serial.println("HTTP Response Code: " + String(httpResponseCode));
    if (httpResponseCode > 0) {
      Serial.println(httpClient.getString()); // Print the server response
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode); // Print error code if request fails
    }

    httpClient.end(); // Close connection
    
    } else {
    Serial.println("Error in WiFi connection");
    }

    httpClient.begin(wClient, loadST); // Use base URL for the request
    httpClient.addHeader("Content-Type", "application/json"); // Set content type to JSON
    
    // Send the POST request with the JSON payload
    int httpResponseCode = httpClient.POST(jsonPayloadSensTerm); 

    Serial.println("HTTP Response Code: " + String(httpResponseCode));
    if (httpResponseCode > 0) {
      Serial.println(httpClient.getString()); // Print the server response
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode); // Print error code if request fails
    }

    httpClient.end(); // Close connection

}

// Metodo GET para consultar la base de datos
double logIntentoGETselect() {
  String data = getTermSens;
  Serial.println(data);

  if (WiFi.status() == WL_CONNECTED) {
    httpClient.begin(wClient, data.c_str());
    int httpResponseCode = httpClient.GET();
    Serial.println(httpResponseCode);

    if (httpResponseCode > 0) {
      String response = httpClient.getString();  // Get the full response body as a string
      Serial.println(response);  // Print the response

      String extractedNumber = "";
      bool isNumber = false;

      // Iterate through the string to find the number
      for (int i = 30; i < response.length(); i++) {
        char c = response[i];

        // Check if the character is part of a number (digits or decimal point)
        if ((c >= '0' && c <= '9') || c == '.') {
          isNumber = true;              // Start recording when a number begins
          extractedNumber += c;         // Append the digit or decimal point
        } else if (isNumber) {
          break;                        // Stop recording when the number ends
        }
      }

      // If a number was extracted, convert it to an integer and return
      if (extractedNumber.length() > 0) {
        float extractedValue = extractedNumber.toFloat();
        Serial.println("Extracted Number: " + String(extractedValue));
        return extractedValue;  // Return the extracted number as a float or convert it to int
      }
    } else {
      Serial.println("Error in GET request");
    }
    httpClient.end();  // Close the connection
  } else {
    Serial.println("Error in WiFi connection");
  }
  return -1;  // Return a default value in case of failure
}
