'use strict';

const express = require('express');
const app = express();
const PORT = process.env.PORT || '8080';

const { countColorRequests } = require("./monitoring");

app.use(function(req, res, next) {
  // ランダムで色を選ぶ
  const color = ['red', 'blue', 'blue', 'yellow', 'yellow', 'yellow'];
  res.locals.color = color[Math.floor(Math.random() * color.length)];
  next();
});

app.use(countColorRequests());

app.get('/', (req, res, next) => {
  res.send(res.locals.color);
  next();
});

app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});