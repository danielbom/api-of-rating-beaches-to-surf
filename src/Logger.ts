import pino from 'pino';
import config from 'config';

const loggerEnabled: boolean | string = config.get('App.logger.enabled');
const Logger = pino({
  enabled: loggerEnabled === true || loggerEnabled === 'true',
  level: config.get('App.logger.level'),
});

export default Logger;
