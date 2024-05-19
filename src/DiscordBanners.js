
const fetch = require("node-fetch");
const { Client, GatewayIntentBits } = require("discord.js");

const allowedFormats = ["webp", "png", "jpg", "jpeg", "gif"];
const allowedSizes = Array.from({ length: 9 }, (e, i) => 2 ** (i + 4));

class DiscordBanners {
    constructor(client) {
        if (!client) throw new SyntaxError("Lütfen bir Discord İstemcisi belirtin.");
        this.client = client;
    };

    async createBannerURL(userId, banner, format = "webp", size = "1024", dynamic) {
        if (dynamic) format = banner.startsWith("a_") ? "gif" : format;
        return `https://cdn.discordapp.com/banners/${userId}/${banner}.${format}${parseInt(size) ? `?size=${parseInt(size)}` : ''}`
    }

    async getBanner(userId, { format, size, dynamic } = {}) {
        if (format && !allowedFormats.includes(format)) throw new SyntaxError("Lütfen kullanılabilir bir format belirtin.");
        if (size && (!allowedSizes.includes(parseInt(size)) || isNaN(parseInt(size)))) throw new SyntaxError("Lütfen uygun bir boyut belirtin.");
        if (dynamic && typeof dynamic !== "boolean") throw new SyntaxError("Dinamik seçeneği Boolean olmalıdır.")
        let Data = ""
        try {
            await fetch(`https://discord.com/api/v10/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bot ${this.client.token}`
                    }
                }).then(res => res.json())
                .then(user => {
                    if (user.code == 50035) throw new SyntaxError("Kullanıcı bulunamadı.")
                    if (user.banner !== null) Data = this.createBannerURL(user.id, user.banner, format, size, dynamic)
                    if (user.banner_color !== null) Data = user.banner_color
                })
        } catch (err) {
            throw new Error("Beklenmeyen bir hata oluştu.");
        }
        return Data
    }
}

module.exports = DiscordBanners;
