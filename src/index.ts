import config from 'config';
import SetupServer from './SetupServer';

async function bootstrap() {
  const setupSever = new SetupServer(config.get('App.port'));
  await setupSever.init();
  await setupSever.start();
}

bootstrap();
