const config = require("../bot-settings.json");

module.exports.help = {
    name: "setavatar",
    description: "Changes bot's avatar",
    type: "owner",
    usage: `**${config.BotPrefix}setavatar <https://link.to.image.pls/>**`
};

module.exports.run = async (bot, message, args) => {
    //////////////////////////////////////////////////////////////////////////////////////////////
    //                                          uptime                                          //
    //////////////////////////////////////////////////////////////////////////////////////////////

    if (args[0]) {
        try {
            new URL(args[0]);
        } catch (error) {
            return message.reply(`You must provide valid link to a new avatar!`)
                .then(message => message.delete({ timeout: 10000 })).catch(() => { });
        }

        // Set avatar
        bot.user.setAvatar(args[0])
            .then(changed => {
                if (changed) {
                    return message.reply(`✅ Avatar has been changed!`)
                        .then(message => message.delete({ timeout: 10000 })).catch(() => { });
                } else return message.reply(`❌ Error to change avatar`)
                    .then(message => message.delete({ timeout: 10000 })).catch(() => { });
            })
            .catch(error => message.reply(`❌ Error to change avatar\n${error}`)
                .then(message => message.delete({ timeout: 10000 })).catch(() => { }));

    } else return message.channel.send(`Wrong command format, type **${config.BotPrefix}help ${module.exports.help.name}** to see usage and examples!`)
        .then(message => message.delete({ timeout: 10000 })).catch(() => { });

    /////////////////////////////////////////////////////////////////////////////////////////
}