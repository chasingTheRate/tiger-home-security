var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
const TigerBlindsController = require('../controller/tigerBlindsController');

const tigerBlindsController = new TigerBlindsController();
const BLIND_ID = 'e36b905b-50d7-473c-abe6-451506c90cd4'

var tigerBlindsOfficeUUID = uuid.generate('hap-nodejs:accessories:window-covering');
var tigerBlindsOffice = exports.accessory = new Accessory('Tiger Three', tigerBlindsOfficeUUID);

// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
tigerBlindsOffice.username = "C1:5D:3F:EE:5E:FD"; //edit this if you use Core.js
tigerBlindsOffice.pincode = "031-45-155";

tigerBlindsOffice
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "Tiger Blinds")
  .setCharacteristic(Characteristic.Model, "A")
  .setCharacteristic(Characteristic.SerialNumber, "1");

tigerBlindsOffice.on('identify', function(paired, callback) {
  console.log("Tiger Blinds Office Identified...");
  callback();
});

tigerBlindsOffice
  .addService(Service.WindowCovering, "Tiger Three")
  .setCharacteristic(Characteristic.PositionState, Characteristic.PositionState.CLOSED)
  .getCharacteristic(Characteristic.TargetPosition)
  .on('set', (value, callback) => {
    console.log(`Setting Blind Position: ${ value }`);
    switch (value) {
      case 0:
        tigerBlindsController.closeBlindById(BLIND_ID)
        .then( (response) => {
          callback();
          tigerBlindsOffice
          .getService(Service.WindowCovering)
          .setCharacteristic(Characteristic.CurrentPosition, value);
        })
        .catch( (err) => {
          console.log(err);
          callback(err);
        });
        break;
      case 100:
        tigerBlindsController.openBlindById(BLIND_ID)
        .then( (response) => {
          callback();
          tigerBlindsOffice
          .getService(Service.WindowCovering)
          .setCharacteristic(Characteristic.CurrentPosition, value);
        })
        .catch( (err) => {
          console.log(err);
          callback(err);
        });
        break;
      default:
        break;
    }
});

tigerBlindsOffice
  .getService(Service.WindowCovering)
  .getCharacteristic(Characteristic.CurrentPosition)
  .on('get', (callback) => {
    var err = null;
    callback(err, Characteristic.PositionState.CLOSED);
  });