// ping.js
// ================================

const { botReply } = require("../twistedBot");

module.exports.help = {
    name: "ping",
    description: "Pong!",
    type: "public",
    usage: "Type the command without any arguments."
};

module.exports.run = async (bot, message) => {
    const ping = await botReply('🏓 Pinging...', message)
    ping.edit(`🏓 Pong! \nLatency is **${Math.floor(ping.createdAt - message.createdAt)}** ms\nAPI Latency is **${Math.round(bot.ws.ping)}** ms.`)
        .then(message => {
            if (message?.deletable) message.delete({ timeout: 10000 }).catch(error => console.error(`ping.js:1 ${error}`));
        })
        .catch(error => console.error(`ping.js:2 () ${error}`));
}