const opentelemetry = require('@opentelemetry/api');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/tracing');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');

module.exports = (serviceName) => {
  const provider = new NodeTracerProvider();

  registerInstrumentations({
    tracerProvider: provider,
  });

  const exporter = new ZipkinExporter({ serviceName });
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  provider.register();

  return opentelemetry.trace.getTracer('api-call-app');
};