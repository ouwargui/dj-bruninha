import {SlashCommandBuilder} from 'discord.js';
import type {CommandData} from '.';

export const autoplay: CommandData = {
  data: new SlashCommandBuilder()
    .setName('autoplay')
    .setDescription('Toggles autoplay on the current song')
    .addBooleanOption((option) =>
      option
        .setDescription('Enable autoplay')
        .setName('enable')
        .setRequired(true),
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

    const enabled = interaction.options.getBoolean('enable') ?? false;

    player.setAutoPlay(enabled);

    return interaction.reply(
      `Autoplay is now ${enabled ? 'enabled' : 'disabled'}`,
    );
  },
};
