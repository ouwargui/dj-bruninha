import {REST, Routes} from 'discord.js';
import type {Command} from '../commands';

export class DiscordRestClient {
  private readonly rest: REST;
  private readonly token: string;
  private readonly clientId: string;

  constructor() {
    if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CLIENT_ID) {
      throw new Error('discord envs not set');
    }
    this.token = process.env.DISCORD_TOKEN;
    this.clientId = process.env.DISCORD_CLIENT_ID;
    this.rest = new REST({version: '10'}).setToken(this.token);
  }

  public async updateCommands(commands: Command[]) {
    console.log('refreshing bot commands');
    return this.rest.put(Routes.applicationCommands(this.clientId), {
      body: commands,
    });
  }
}
