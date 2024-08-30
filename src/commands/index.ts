import type {
  ChatInputCommandInteraction,
  InteractionResponse,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';
import type {Client} from '../client/discord';
import {autoplay} from './autoplay';
import {pause} from './pause';
import {ping} from './ping';
import {play} from './play';
import {queue} from './queue';
import {shuffle} from './shuffle';
import {skip} from './skip';
import {stop} from './stop';

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
  data: [
    ping.data,
    play.data,
    pause.data,
    queue.data,
    skip.data,
    stop.data,
    autoplay.data,
    shuffle.data,
  ],
  map: {
    ping,
    play,
    autoplay,
    pause,
    queue,
    skip,
    stop,
    shuffle,
  },
};
