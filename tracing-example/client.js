'use strict';

const tracer = require('./tracer')('client');
const api = require('@opentelemetry/api');
const axios = require('axios').default;

function makeRequest() {
  const span = tracer.startSpan('client.makeRequest()', {
    kind: api.SpanKind.CLIENT,
  });

  api.context.with(api.setSpan(api.ROOT_CONTEXT, span), async () => {

    // 1つ目のAPIを呼び出す
    await axios.get('http://localhost:8180/api/price')
    .then(res => span.setStatus({ code: api.SpanStatusCode.OK }))
    .catch(err => span.setStatus({ code: api.SpanStatusCode.ERROR, message: err.message }));

    // 2つ目のAPIを呼び出す
    await axios.get('http://localhost:8280/api/price')
    .then(res => span.setStatus({ code: api.SpanStatusCode.OK }))
    .catch(err => span.setStatus({ code: api.SpanStatusCode.ERROR, message: err.message }));
  });

  // 5秒後に終了する
  setTimeout(() => { 
    span.end();
    console.log('Completed.');
  }, 5000);
}

makeRequest();