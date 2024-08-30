import {SlashCommandBuilder} from 'discord.js';
import type {CommandData} from '.';

export const pause: CommandData = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Toggle pause on the current song'),
  execute: async (client, interaction) => {
    if (!interaction.inCachedGuild()) {
      return interaction.reply('This command can only be used in a server');
    }

    if (!interaction.member.voice.channel || !interaction.channel?.id) {
      return interaction.reply('You must be in a voice channel');
    }

    const player = client.moonlink.getPlayer(interaction.guild.id);

    if (!player) {
      return interaction.reply('Player not found, did you played a song?');
    }

    if (!player.connected) return interaction.reply('Bot is not connected');

    player.paused ? player.resume() : player.pause();

    return interaction.reply('Paused');
  },
};
