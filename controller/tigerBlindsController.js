const config = require('../config');
const axios = require('axios');

const baseUrl = `${ config.tigerHomeServer.ipAddress }:${ config.tigerHomeServer.port }/blinds`;

class TigerBlindsController {
  constructor(){
   
  }

  status(id) {
    const data = { data: {
      blindid: id
    }}
    return axios.post(`${ baseUrl }/status`, data);
  }

  openBlindById(id) {
    const data = { data: {
      blindid: id
    }}
    return axios.post(`${ baseUrl }/openBlind`, data);
  }

  closeBlindById(id) {
    const data = { data: {
      blindid: id
    }}
    return axios.post(`${ baseUrl }/closeBlind`, data);
  }
}

module.exports = TigerBlindsController;