import pino from 'pino';
import config from 'config';
import pinoPretty from 'pino-pretty';

const isTrue = (value: any) => typeof value === 'string' ? value === 'true' : !!value;

const loggerConfig: pino.LoggerOptions = {
  enabled: isTrue(config.get('App.logger.enabled')),
  level: config.get('App.logger.level'),
}

const Logger = isTrue(config.get('App.logger.prettyPrint'))
  ? pino(loggerConfig, pinoPretty({ colorize: true, ignore: 'hostname' }) as any)
  : pino(loggerConfig);

export default Logger;
