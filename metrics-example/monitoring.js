'use strict';

const { MeterProvider } = require('@opentelemetry/metrics');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');

const prometheusPort = PrometheusExporter.DEFAULT_OPTIONS.port
const prometheusEndpoint = PrometheusExporter.DEFAULT_OPTIONS.endpoint
const exporter = new PrometheusExporter(
  {
    startServer: true,
  },
  () => {
    console.log(
      `prometheus scrape endpoint: http://localhost:${prometheusPort}${prometheusEndpoint}`,
    );
  },
);

const meter = new MeterProvider({
  exporter,
  interval: 1000,
}).getMeter('color-meter');

const colorCount = meter.createCounter('colors', {
  description: 'Count each color'
});

// 色ごとにCounterを生成する
const redCounter = colorCount.bind({ color: 'red'});
const blueCounter = colorCount.bind({ color: 'blue'});
const yellowCounter = colorCount.bind({ color: 'yellow'});

module.exports.countColorRequests = () => {
  return (req, res, next) => {
    switch (res.locals.color) {
      case 'red':
        redCounter.add(1);
        break;
      case 'blue':
        blueCounter.add(1);
        break;
      case 'yellow':
        yellowCounter.add(1);
        break;
    }
    next();
  };
};