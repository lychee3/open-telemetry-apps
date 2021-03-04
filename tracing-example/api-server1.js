'use strict';

const tracer = require('./tracer')('api-server1');
const api = require('@opentelemetry/api');
const express = require('express');
const app = express();
const PORT = 8180;

const data = { name: "orange", price: 200};

async function setupRoutes() {
  app.use(express.json());

  app.get('/api/price', async (req, res) => {
//    const currentSpan = api.getSpan(api.context.active());
    const span = tracer.startSpan('processing', {
      kind: api.SpanKind.SERVER
    });

    setTimeout(() => {
      span.end();
      res.json(data);
    }, 2000);
  });
}

setupRoutes().then(() => {
  app.listen(PORT);
  console.log(`Listening on http://localhost:${PORT}`);
});