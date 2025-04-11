/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

import { tunnelmole } from 'tunnelmole';

const command = process.argv[2];
const paramsArg = process.argv[3];

let server: any = null;

// Function to start the server
const startServer = async (params?: any) => {
  const port = params?.port || process.env.PORT || 5000;

  const url = await tunnelmole({
    port,
  });
  
  if (server) {
    console.log(JSON.stringify({ status: 'already_running', url }));
    return;
  }
  
  server = app.listen(port, () => {
    console.log(JSON.stringify({ status: 'started', url, params }));
  });
};

// Function to stop the server
const stopServer = (params?: any) => {
  if (!server) {
    console.log(JSON.stringify({ status: 'not_running' }));
    return;
  }
  
  server.close(() => {
    server = null;
    console.log(JSON.stringify({ status: 'stopped', params }));
  });
};

// Parse the params if provided
let params = {};
if (paramsArg) {
  try {
    params = JSON.parse(paramsArg);
  } catch (e) {
    console.error(JSON.stringify({ status: 'error', message: 'Invalid params JSON' }));
    process.exit(1);
  }
}

// Handle commands
switch (command) {
  case 'start':
    startServer(params);
    break;
  case 'stop':
    stopServer();
    break;
  case 'status':
    console.log(JSON.stringify({ status: server ? 'running' : 'stopped' }));
    break;
  case undefined:
    // If no command provided, just start the server (backward compatibility)
    startServer(params);
    break;
  default:
    console.error(JSON.stringify({ status: 'error', message: `Unknown command: ${command}` }));
    process.exit(1);
}

// If no command provided, just start the server (backward compatibility)
// if (command === undefined) {
//   startServer();
// }