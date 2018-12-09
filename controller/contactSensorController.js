const EventEmitter = require("events");
const Gpio = require('onoff').Gpio;

const ContactSensorState = {
  on: 1,
  off: 0
}


class ContactSensorController extends EventEmitter {
  constructor(name, gpio){
    super();
    this.name = name;
    this.gpio = gpio;
    this.state = ContactSensorState.off; // Force initial state to disarm
    //  this.test();
    this.registerGpio();
  }

  status() {
    return this.state;
  }

  registerGpio() {
    const gpio = new Gpio(this.gpio, 'in', 'both');
    gpio.watch((err, value) => {
      if (err) {
        console.log(err);
      }
      console.log(`value: ${value}`);
      this.didChangeState(value);
    })
  }

  test() {
    setInterval(()=>{
      console.log('Change CS State...');
      this.didChangeState(!this.state);
    }, 10000)
  }

  didChangeState(state) {
    console.log(`Contact Sensor ${ this.name } did change state.`);
    this.state = state;
    const data = { name: this.name, state: this.state };
    this.emit('didChangeState', null, data);
  }
  
}

exports.ContactSensorController = ContactSensorController;