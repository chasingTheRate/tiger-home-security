const EventEmitter = require("events");
const { ContactSensorController } = require('./contactSensorController');
const config = require('../config');
const { HueLightController, lights, onState } = require('./hueLightController');

const SecuritySystemState = {
  stayArm: 0,
  awayArm: 1,
  nightArm: 2,
  disArm: 3,
  triggered: 4
}

class SecuritySystemController extends EventEmitter {
  constructor(){
    super();
    this.state = SecuritySystemState.disArm; // Force initial state to disarm
    this.contactSensors = [];
    this.light = new HueLightController(config.hue.hostname, config.hue.username);
  }

  identify() {
    console.log("Identify the Security System");
  }

  setState(state) {
    this.state = state;
    this.emit('didSetState', null, state);
  }

  status() {

  }

  addContactSensor(name, gpio) {
    const contactSensor = new ContactSensorController(name, gpio);
    contactSensor.on('didChangeState', (err, contactSensor) => {
      this.contactSensorDidChangeState(contactSensor);
    })
    this.contactSensors.push(contactSensor);
  }

  contactSensorDidChangeState(contactSensor) {
    console.log(`current state: ${contactSensor.state}`);
    if (contactSensor.state) {
      // this.light.alert(lights.mantle, onState);
      if (this.state !== SecuritySystemState.disArm) {
        console.log("Triggered!");
        this.setState(SecuritySystemState.triggered);
      }
    } else {
      // this.light.setPreviousState(lights.mantle);
    }
    const data = { name: contactSensor.name, state: contactSensor.state };
    this.emit('contactSensorDidChangeState', null, data);
  }
}

exports.SecuritySystemController = SecuritySystemController;