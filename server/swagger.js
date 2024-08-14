const swaggerAutogen = require('swagger-autogen')();
const outputFile = './swagger_output.json';
const endpointsFiles = ['./app.js']; // Update this with the path to your main file

const doc = {
  info: {
    title: 'Connect Verse',
    description: 'All APIS of The BackEnd',
  },
  host: `${process.env.theHost}`, // Update with your server's host
  schemes: ['https'],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./app'); // Your project's root file
});
