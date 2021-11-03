import config from 'config';
import Logger from './Logger';
import SetupServer from './SetupServer';

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

process.on('unhandledRejection', (reason, promise) => {
  Logger.error(`App exiting due to an unhandled promise: ${promise} and reason: ${reason}`);
  throw (reason as Error);
});

process.on('uncaughtException', (error) => {
  Logger.error(`App exiting due to an uncaught exception: ${error}`, error);
  process.exit(ExitStatus.Failure);
});

async function bootstrap() {
  const server = new SetupServer(config.get('App.port'));
  await server.init();
  server.start();

  const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
  exitSignals.forEach((signal) => {
    process.on(signal, async () => {
      try {
        await server.close();
        Logger.info('App exited with success');
        process.exit(ExitStatus.Success);
      } catch (err) {
        Logger.error(`App exited with error: ${err}`);
        process.exit(ExitStatus.Failure);
      }
    });
  });
}

bootstrap().catch((err) => {
  Logger.error(`App exited with error: ${err}`);
  process.exit(ExitStatus.Failure);
});
