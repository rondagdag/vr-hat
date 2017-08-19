
/*
  IMU orentation detection
  for the Intel Arduino 101
  Ron Dagdag
  
  http://dagdag.net
  http://electronhacks.com
  https://www.hackster.io/33351/let-it-snow-iot-snow-globe-with-virtual-reality-web-5123a6

  
*/

#include "CurieIMU.h"
#include <CurieBLE.h>


BLEPeripheral blePeripheral;
BLEService hatService("917649A0-D98E-11E5-9EEC-0002A5D5C51B");
//BLECharacteristic hatCharacteristic("917649A1-D98E-11E5-9EEC-0002A5D5C51B", BLEWrite, 5);
BLEUnsignedCharCharacteristic hatCharacteristic("917649A1-D98E-11E5-9EEC-0002A5D5C51B", BLERead | BLENotify);
BLEDescriptor hatDescriptor("2902","hat");

//BLEService batteryService("180F"); // BLE Battery Service
//BLEUnsignedCharCharacteristic batteryLevelChar("2A19",  // standard 16-bit characteristic UUID
//    BLERead | BLENotify);     // remote clients will be able to

int lastOrientation = - 1; // previous orientation (for comparison)

void setup() 
{

  // Begin BLE
  BLE.begin();

  //BLE.setLocalName("BatteryMonitor");
  //BLE.setAdvertisedService(batteryService);  // add the service UUID
  //batteryService.addCharacteristic(batteryLevelChar); // add the battery level characteristic
  //BLE.addService(batteryService);   // Add the BLE Battery service
  //batteryLevelChar.setValue(lastOrientation);   // initial value for this characteristic

  blePeripheral.setLocalName("hat");
  blePeripheral.setAdvertisedServiceUuid(hatService.uuid());
  blePeripheral.addAttribute(hatService);
  blePeripheral.addAttribute(hatCharacteristic);
  blePeripheral.addAttribute(hatDescriptor);

  // Start advertising
  BLE.advertise();
  
  pinMode(13, OUTPUT);
  Serial.begin(9600);
  Serial.println("Initializing IMU device...");
  
  CurieIMU.begin();
  CurieIMU.setAccelerometerRange(2);
}


long previousMillis = 0;  // last time the battery level was checked, in ms

void loop() 
{

  BLEDevice central = BLE.central();
  if (central) {
     Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());
   // turn on the LED to indicate the connection:
    digitalWrite(13, HIGH);

    // check the battery level every 200ms
    // as long as the central is still connected:
    while (central.connected()) {
      long currentMillis = millis();
       if (currentMillis - previousMillis >= 200) {
            previousMillis = currentMillis;
            updateBatteryLevel();
       }
    }
  }
}

void updateBatteryLevel() {
  int orientation = -1;   // the board's orientation
  String orientationString; // string for printing description of orientation
  // read accelerometer:
  int x = CurieIMU.readAccelerometer(X_AXIS);
  int y = CurieIMU.readAccelerometer(Y_AXIS);
  int z = CurieIMU.readAccelerometer(Z_AXIS);

  // calculate the absolute values, to determine the largest
  int absX = abs(x);
  int absY = abs(y);
  int absZ = abs(z);

  if ( (absZ > absX) && (absZ > absY)) {
    // base orientation on Z
    if (z > 0) {
      orientationString = "up";
      orientation = 0;
      //digitalWrite(13, HIGH);  
    } else {
      orientationString = "down";
      orientation = 1;
      //digitalWrite(13, LOW);
    }
  }

  // if the orientation has changed, print out a description:
  if (orientation != lastOrientation) {
    Serial.println(orientationString);
    //batteryLevelChar.setValue(orientation);  // and update the battery level characteristic
    hatCharacteristic.setValue(orientation);
    lastOrientation = orientation;
  }
}
