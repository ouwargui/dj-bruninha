import {SlashCommandBuilder} from 'discord.js';
import type {CommandData} from '.';

export const skip: CommandData = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the song')
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('The amount of songs to skip')
        .setRequired(false)
        .setMinValue(1),
    ),
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

    const amount = interaction.options.getInteger('amount');

    if (amount == null) {
      player.skip();
      return interaction.reply('Skipped the current song');
    }

    if (amount > player.queue.size) {
      player.queue.clear();
      player.skip();

      return interaction.reply('Queue cleared');
    }

    player.skip(amount - 1);
    return interaction.reply(`Skipped ${amount} songs`);
  },
};
