import type {Client} from 'discord.js';
import {
  type INode,
  Manager as MoonlinkManager,
  type Player,
  type Track,
} from 'moonlink.js';

export class Manager extends MoonlinkManager {
  constructor(sendPayload: (guildId: string, payload: string) => void) {
    super({
      nodes: [
        {
          identifier: 'node_1',
          host: 'NodeLink',
          port: 2333,
          password: '123456',
          secure: false,
        },
      ],
      options: {
        clientName: 'dj-bruninha/1.0.0',
      },
      sendPayload,
    });
  }

  public start(client: Client) {
    if (!client.user) {
      console.error('User not found');
      return;
    }

    this.setupListeners(client);
    super.init(client.user.id);
  }

  private setupListeners(client: Client) {
    this.on('debug', (...args) => console.log(...args));
    this.on('nodeCreate', (node) => this.onNodeCreate(node));
    this.on('trackStart', async (player, track) =>
      this.onTrackStart(client, player, track),
    );
    this.on('trackEnd', async (player, track) =>
      this.onTrackEnd(client, player, track),
    );
  }

  private onNodeCreate(node: INode) {
    console.log(`${node.host} is connected`);
  }

  private async onTrackStart(client: Client, player: Player, track: Track) {
    const channel = client.channels.cache.get(player.textChannelId);
    console.log(channel);
    if (channel?.isTextBased() || channel?.isVoiceBased()) {
      return await channel.send(`Now playing: ${track.title}`);
    }

    console.error('Channel not found');
    return;
  }

  private async onTrackEnd(client: Client, player: Player, _track: Track) {
    const channel = client.channels.cache.get(player.textChannelId);
    if (channel?.isTextBased() || channel?.isVoiceBased()) {
      return await channel.send('Track ended');
    }
  }
}
