
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const { DiscordBanners } = require('discord-banners');
const discordBanners = new DiscordBanners(client);

// Simple usage example to message event!
client.on('messageCreate', async (message) => {
    if (message.content === "Benim afişim ne") {
        const banner = await discordBanners.getBanner(message.author.id, { size: 2048, format: "png", dynamic: true })
        if (banner) return message.channel.send(banner)
        else return message.channel.send("Kullanıcı banner'ı bulunamadı!")
    }
});

client.login('YOUR_DISCORD_BOT_TOKEN');
