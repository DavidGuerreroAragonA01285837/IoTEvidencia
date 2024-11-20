#include "DHT.h"
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Pines
int ledPin = D0;        // LED 
int buzzerPin = D3;     // Buzzer

#define WIFI_SSID "Tec-IoT"
#define WIFI_PASSWORD "spotless.magnetic.bridge"

// Definición de URLs para GET y POST
String IP = "http://10.22.133.37:3000";
String getRefillDist = IP + "/iot/api/getRefDist";
String getRefillPres = IP + "/iot/api/getRefPres";

HTTPClient httpClient;
WiFiClient wClient;

void setup() {
  // Configuración de pines
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  
  // Iniciar comunicación serial
  Serial.begin(9600);  

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
  
  String distancestring = logIntentoGETselect(getRefillDist);
  double distance = distancestring.toDouble();
  String presence = logIntentoGETselect(getRefillPres);

  if (presence == "F"){

    if (distance < 30){

      refillFood();

    }

  }

  Serial.print(distance);

}

void refillFood(){

  digitalWrite(ledPin,HIGH);
  digitalWrite(buzzerPin,HIGH);
  delay(4000);
  digitalWrite(ledPin,LOW);
  digitalWrite(buzzerPin,LOW);

}
// Metodo GET para consultar la base de datos
String logIntentoGETselect(String url) {
  String data = url;
  Serial.println(data);

  if (WiFi.status() == WL_CONNECTED) {
    httpClient.begin(wClient, data.c_str());
    int httpResponseCode = httpClient.GET();
    Serial.println(httpResponseCode);

    if (httpResponseCode > 0) {
      String response = httpClient.getString();  // Get the full response body as a string
      return response;
    }
    httpClient.end();  // Close the connection
  } else {
    Serial.println("Error in WiFi connection");
  }
  return "-1";  // Return a default value in case of failure
}
