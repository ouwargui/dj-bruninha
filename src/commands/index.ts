import type {
  ChatInputCommandInteraction,
  InteractionResponse,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';
import type {Client} from '../client/discord';
import {ping} from './ping';
import {play} from './play';

export type CommandData = {
  data: Command;
  execute<T>(
    client: Client,
    params: T extends ChatInputCommandInteraction ? T : never,
  ): Promise<InteractionResponse<boolean>>;
};

export type Command = SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;

export type AllCommandsWithData = {
  data: Command[];
  map: Record<string, CommandData>;
};

export const commands: AllCommandsWithData = {
  data: [ping.data, play.data],
  map: {
    ping,
    play,
  },
};
