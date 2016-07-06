import winston from 'winston';

var testing = process.env.NODE_ENV == 'test';
var logger = new (winston.Logger)(testing ? {
  transports: [
    new (winston.transports.File)({ filename: 'server.log' })
  ]
} : {
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'server.log' })
    ]
  });

  export {logger};