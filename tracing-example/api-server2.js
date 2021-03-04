'use strict';

const tracer = require('./tracer')('api-server2');
const api = require('@opentelemetry/api');
const express = require('express');
const app = express();
const PORT = 8280;

const data = { name: "melon", price: 600};

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
    }, 1000);
  });
}

setupRoutes().then(() => {
  app.listen(PORT);
  console.log(`Listening on http://localhost:${PORT}`);
});