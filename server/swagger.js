const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json'; 
const endpointsFiles = ['./app.js']; 

const doc = {
  info: {
    title: 'Connect Verse',
    description: 'All APIS of The BackEnd', 
  },
  host: 'localhost:8001', 
  schemes: ['http'], 
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./app'); 
});
