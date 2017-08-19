(function() {
  'use strict';

  class RelayClick {

    /**
     * customize your project here to reflect the uuid of your service and characteristics.
     */
    constructor() {
        this.deviceName = 'relays';
        this.serviceUUID = '917649a0-d98e-11e5-9eec-0002a5d5c51b';
        this.characteristic1UUID = '917649a1-d98e-11e5-9eec-0002a5d5c51b';
        this.device = null;
        this.server = null;
        // The cache allows us to hold on to characeristics for access in response to user commands 
        this._characteristics = new Map();
    }

    // connect(){
    //     return navigator.bluetooth.requestDevice({
    //      filters: [{
    //       services:[this.serviceUUID]
    //      }]
    //     })
    //     .then(device => {
    //         this.device = device;
    //         return device.gatt.connect();
    //     })
    //     .then(server => {
    //         this.server = server;
    //         return Promise.all([
    //           server.getPrimaryService(this.serviceUUID)
    //           .then(service=>{
    //             return Promise.all([
    //               this._cacheCharacteristic(service, this.characteristic1UUID),
    //               // this._cacheCharacteristic(service, 'uuidCharacteristic2Here'),
    //             ])
    //           })
    //         ]);
    //     })
    // }
    connect(){
        return navigator.bluetooth.requestDevice({
          filters: [{
           services:[this.serviceUUID]
          }]
         })
        .then(device => {
            this.device = device;
            return device.gatt.connect();
        })
        .then(server => {
            this.server = server;
            return Promise.all([
              server.getPrimaryService(this.serviceUUID)
              .then(service=>{
                return Promise.all([
                  this._cacheCharacteristic(service, this.characteristic1UUID),
                  // this._cacheCharacteristic(service, 'uuidCharacteristic2Here'),
                ])
              })
            ]);
        })
    }

    getBodySensorLocation() {
      return this._readCharacteristic(this.characteristic1UUID)
      .then(data => {
        let sensorLocation = data.getUint8(0);
        switch (sensorLocation) {
          case 0: return 'Other';
          case 1: return 'Chest';
          case 2: return 'Wrist';
          case 3: return 'Finger';
          case 4: return 'Hand';
          case 5: return 'Ear Lobe';
          case 6: return 'Foot';
          default: return 'Unknown';
        }
     });
    }
    startNotificationsHeartRateMeasurement() {
      return this._startNotifications(this.characteristic1UUID);
    }
    stopNotificationsHeartRateMeasurement() {
      return this._stopNotifications(this.characteristic1UUID);
    }

  _cacheCharacteristic(service, characteristicUuid){
    return service.getCharacteristic(characteristicUuid)
    .then(characteristic => {
      this._characteristics.set(characteristicUuid, characteristic);
    });
  }

 _readCharacteristic(characteristicUuid) {
   let characteristic = this._characteristics.get(characteristicUuid);
   return characteristic.readValue()
   .then(value => {
     value = value.buffer ? value : new DataView(value);
     return value;
   });

 }
 _writeCharacteristic(characteristicUuid, value){
   let characteristic = this._characteristics.get(characteristicUuid);
   return characteristic.writeValue(value);
 }
 _startNotifications(characteristicUuid) {
  let characteristic = this._characteristics.get(characteristicUuid);
  // Returns characteristic to set up characteristicvaluechanged event
  // handlers in the resolved promise.
  return characteristic.startNotifications()
  .then(() => characteristic);
}
_stopNotifications(characteristicUuid) {
  let characteristic = this._characteristics.get(characteristicUuid);
  // Returns characteristic to remove characteristicvaluechanged event
  // handlers in the resolved promise.
  return characteristic.stopNotifications()
  .then(() => characteristic);
}
}

window.relayClick = new RelayClick();

})();
