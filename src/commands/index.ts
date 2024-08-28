import type {ChatInputCommandInteraction} from 'discord.js';

export type CommandData = {
  name: string;
  description: string;
  handler<T>(params: T extends ChatInputCommandInteraction ? T : never): void;
};

export type Command = {
  [key: string]: CommandData;
};

const ping: CommandData = {
  name: 'ping',
  description: "Replies with pong if you're lucky :)",
  handler: (interaction: ChatInputCommandInteraction) => {
    return interaction.reply(
      Math.random() < 0.5 ? 'Pong!' : 'vai te fude seu viado',
    );
  },
};

export type AllCommandsWithData = {
  commandDataList: CommandData[];
  map: Command;
};

export const commands: AllCommandsWithData = {
  commandDataList: [ping],
  map: {
    ping,
  },
};
