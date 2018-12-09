const HueApi = require("node-hue-api").HueApi;

const lights = {
  mantle: 4
}

const onState = {
  on: true,
  bri: 254,
  hue: 34515,
  sat: 236
}

class HueLightController {
  constructor(hostname, username){
    this.api = new HueApi(hostname, username);
    this.currentState = {};
  }

  setCurrentStatus(light){
    this.api.lightStatus(light)
      .then((status) => {
        this.currentState = status.state;
      })
  }

  alert(light, state){
    this.setCurrentStatus(light);
    this.api.setLightState(light, state) // provide a value of false to turn off 
    .then((results) => {
      console.log(results);
    })
    .fail(((error) => {
      console.log(error);
    }))
    .done();
  }

  setPreviousState(light){
    this.api.setLightState(light, this.currentState) // provide a value of false to turn off 
    .then((results) => {
      console.log(results);
    })
    .fail(((error) => {
      console.log(error);
    }))
    .done();
  }
}

exports.lights = lights;
exports.onState = onState;
exports.HueLightController = HueLightController;
