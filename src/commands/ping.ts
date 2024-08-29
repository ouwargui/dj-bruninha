import {SlashCommandBuilder} from 'discord.js';
import type {CommandData} from '.';

export const ping: CommandData = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription("Replies with pong if you're lucky :)"),
  execute: async (_client, interaction) => {
    return interaction.reply(
      Math.random() < 0.5 ? 'Pong!' : 'vai te fude seu viado',
    );
  },
};
