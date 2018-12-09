var Gpio = require('onoff').Gpio,
led = new Gpio(17, 'out'),
button = new Gpio(4, 'in', 'both');

button.watch(function(err, value) {
  console.log(`test: ${value}`);
  led.writeSync(value);
});