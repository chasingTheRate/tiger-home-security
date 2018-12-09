var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
const { SecuritySystemController } = require('../controller/securitySystemController');

const ENTRY_DOOR_GPIO =4;
const MASTER_BEDROOM_GPIO = 6;
const LIVING_ROOM_GPIO = 7;
const DINING_STUDY_GPIO = 8;
const OTHER_BEDROOMS_GPIO = 15;

const port = process.env.PORT || 4045;

var SECURITY_SYSTEM = new SecuritySystemController();
SECURITY_SYSTEM.addContactSensor('Entry Door', ENTRY_DOOR_GPIO);
SECURITY_SYSTEM.addContactSensor('Master Bedroom', MASTER_BEDROOM_GPIO);
SECURITY_SYSTEM.addContactSensor('Living Room', LIVING_ROOM_GPIO);
SECURITY_SYSTEM.addContactSensor('Dining/Study', DINING_STUDY_GPIO);
SECURITY_SYSTEM.addContactSensor('Other Bedrooms', OTHER_BEDROOMS_GPIO);

SECURITY_SYSTEM
  .on('didSetState', (err, state) => {
    securitySystem
    .getService(Service.SecuritySystem)
    .setCharacteristic(Characteristic.SecuritySystemCurrentState, state);
  })
  .on('contactSensorDidChangeState', (err, contactSensor) => {
    securitySystem.getService(contactSensor.name)
    .getCharacteristic(Characteristic.ContactSensorState)
    .setValue(contactSensor.state);
  })

var securitySystemUUID = uuid.generate('hap-nodejs:accessories:security-system');
var securitySystem = exports.accessory = new Accessory('EatonLink', securitySystemUUID);

// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
securitySystem.username = "C1:5D:3F:EE:5E:FB"; //edit this if you use Core.js
securitySystem.pincode = "031-45-154";

securitySystem
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "Eaton Corp")
  .setCharacteristic(Characteristic.Model, "Rev-A")
  .setCharacteristic(Characteristic.SerialNumber, "1");

securitySystem.on('identify', function(paired, callback) {
  SECURITY_SYSTEM.identify();
  callback();
});

securitySystem
  .addService(Service.SecuritySystem, "EatonLink")
  .setCharacteristic(Characteristic.SecuritySystemTargetState, SECURITY_SYSTEM.state)
  .getCharacteristic(Characteristic.SecuritySystemTargetState)
  .on('set', (value, callback) => {
    SECURITY_SYSTEM.setState(value);
    callback();
    securitySystem
      .getService(Service.SecuritySystem)
      .setCharacteristic(Characteristic.SecuritySystemCurrentState, value);
});

securitySystem
  .getService(Service.SecuritySystem)
  .getCharacteristic(Characteristic.SecuritySystemCurrentState)
  .on('get', (callback) => {
    var err = null;
    SECURITY_SYSTEM.status();
    callback(err, SECURITY_SYSTEM.state);
  });

  securitySystem
  .getService(Service.SecuritySystem)
  .setCharacteristic(Characteristic.StatusFault, false)
  .getCharacteristic(Characteristic.StatusFault);

  SECURITY_SYSTEM.contactSensors.forEach((cs, index) => {
    securitySystem
      .addService(Service.ContactSensor, cs.name, index)
      .setCharacteristic(Characteristic.ContactSensorState, cs.state) // force initial state to CLOSED
      .getCharacteristic(Characteristic.ContactSensorState)
      .on('get', (callback) => {
        var err = null;
        callback(err, cs.status());
      });
  })
  