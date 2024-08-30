import {SlashCommandBuilder} from 'discord.js';
import type {CommandData} from '.';

export const queue: CommandData = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows the current queue'),
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

    const queue = player.queue;

    const tracks = queue.tracks.map((track, index) => {
      return `**${index + 1}.** ${track.title}`;
    });

    if (tracks.length === 0) return interaction.reply('Queue is empty');

    return interaction.reply(`**Queue:**\n${tracks.join('\n')}`);
  },
};
