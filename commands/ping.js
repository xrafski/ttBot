module.exports.help = {
    name: "ping",
    description: "Pong!",
    type: "public",
    usage: "Type the command without any arguments."
};

module.exports.run = async (bot, message) => {

    //////////////////////////////////////////////////////////////////////////////////////////////
    //                                           ping                                           //
    //////////////////////////////////////////////////////////////////////////////////////////////

    const ping = await message.channel.send('🏓 Pinging...')
    ping.edit(`🏓 Pong! \nLatency is **${Math.floor(ping.createdAt - message.createdAt)}** ms\nAPI Latency is **${Math.round(bot.ws.ping)}** ms.`)
        .then(message => message.delete({ timeout: 30000 })).catch(() => { return });
}