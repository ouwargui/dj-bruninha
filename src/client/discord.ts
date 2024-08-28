import {
  Client as DiscordClient,
  GatewayIntentBits,
  type Interaction,
} from 'discord.js';
import type {AllCommandsWithData} from '../commands';
import type {DiscordRestClient} from '../server/discord';
import {Manager} from './moonlink';

export class Client {
  private readonly moonlink: Manager;
  private readonly discord: DiscordClient;
  private readonly commands: AllCommandsWithData;
  private readonly rest: DiscordRestClient;

  constructor(commands: AllCommandsWithData, rest: DiscordRestClient) {
    this.rest = rest;
    this.commands = commands;
    this.discord = new DiscordClient({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });
    this.moonlink = new Manager((guildId, payload) => {
      this.discord.guilds.cache.get(guildId)?.shard?.send(JSON.parse(payload));
    });
  }

  public async init() {
    await this.rest.updateCommands(this.commands.commandDataList);
    this.setupListeners();
    await this.discord.login(process.env.DISCORD_TOKEN);
  }

  private setupListeners() {
    this.discord.on('ready', () => this.onReady());
    this.discord.on('raw', (data) => this.onRaw(data));
    this.discord.on('interactionCreate', (interaction) =>
      this.onInteractionCreate(interaction),
    );
  }

  private onReady() {
    if (!this.discord.user) {
      console.error('User not found');
      return;
    }

    this.moonlink.init(this.discord.user.id);
  }

  private onRaw(data: unknown) {
    this.moonlink.packetUpdate(data);
  }

  private async onInteractionCreate(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const commandName = interaction.commandName;
    const handler = this.commands.map[commandName].handler;
    return handler(interaction);
  }
}
