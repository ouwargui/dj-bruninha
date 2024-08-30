import {
  type ChatInputCommandInteraction,
  type InteractionResponse,
  SlashCommandBuilder,
} from 'discord.js';
import type {ISearchResult, Player, TLoadResultType} from 'moonlink.js';
import type {CommandData} from '.';
import type {Client} from '../client/discord';

const searchMapper: {
  [key in TLoadResultType]?: (
    interaction: ChatInputCommandInteraction<'cached'>,
    player: Player,
    res: ISearchResult,
  ) => Promise<InteractionResponse>;
} = {
  error: (interaction) => interaction.reply('An error occurred'),
  empty: (interaction) => interaction.reply('No results found'),
  playlist: (interaction, player, res) => {
    for (const track of res.tracks) {
      player.queue.add(track);
    }

    return interaction.reply(
      `${res.playlistInfo.name} has been added to the queue`,
    );
  },
};

type PlayerCreationOptions = {
  guildId: string;
  textChannelId: string;
  voiceChannelId: string;
};

function getPlayer(
  client: Client,
  {guildId, textChannelId, voiceChannelId}: PlayerCreationOptions,
) {
  const playerAlreadyExists = client.moonlink.getPlayer(guildId);
  if (playerAlreadyExists) {
    return playerAlreadyExists;
  }

  return client.moonlink.createPlayer({
    guildId,
    textChannelId,
    voiceChannelId,
    autoPlay: false,
  });
}

export const play: CommandData = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song')
    .addStringOption((option) =>
      option
        .setName('song')
        .setDescription('The song to play')
        .setRequired(true),
    ),
  execute: async (client, interaction) => {
    if (!interaction.inCachedGuild()) {
      return interaction.reply('This command can only be used in a server');
    }

    if (!interaction.member.voice.channel || !interaction.channel?.id) {
      return interaction.reply('You must be in a voice channel');
    }

    const query = interaction.options.getString('song');

    if (!query) {
      return interaction.reply('You must provide a song name bruh');
    }

    const player = getPlayer(client, {
      guildId: interaction.guild.id,
      textChannelId: interaction.channel.id,
      voiceChannelId: interaction.member.voice.channel.id,
    });

    if (!player.connected) player.connect({setDeaf: true, setMute: false});

    const res = await client.moonlink.search({
      query,
      source: 'youtube',
      requester: interaction.user.id,
    });

    const handler = searchMapper[res.loadType];
    if (handler) {
      await handler(interaction, player, res);

      if (!player.playing) player.play();
    }

    const track = res.tracks[0];

    player.queue.add(track);

    if (!player.playing) player.play();
    return interaction.reply(`${track.title} added to queue`);
  },
};
