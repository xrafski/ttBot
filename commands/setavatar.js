// setavatar.js
// ================================

const config = require("../bot-settings.json");
const { botReply } = require("../ttBot");

module.exports.help = {
    name: "setavatar",
    description: "Changes bot's avatar",
    type: "owner",
    usage: `**${config.botPrefix}setavatar <https://link.to.image.pls/>**`
};

module.exports.run = async (bot, message, args) => {
    if (args[0]) {
        try {
            new URL(args[0]);
        } catch (error) {
            return botReply(`You must provide a valid link to avatar!`, message, 5000);
        }

        bot.user.setAvatar(args[0])
            .then(changed => {
                if (changed) return botReply(`✅ Avatar has been changed!`, message, 5000);
            })
            .catch(error => botReply(`❌ Error to change avatar\n\`\`\`${error}\`\`\``, message, 10000));

    } else return botReply(`Wrong command format, type **${config.botPrefix}help ${module.exports.help.name}** to see usage and examples!`, message, 5000);
}