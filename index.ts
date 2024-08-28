import {Client} from './src/client/discord';
import {commands} from './src/commands';
import {DiscordRestClient} from './src/server/discord';

try {
  const restClient = new DiscordRestClient();
  const client = new Client(commands, restClient);

  await client.init();

  console.log('successfully refreshed bot commands');
} catch (e) {
  console.error(e);
}
