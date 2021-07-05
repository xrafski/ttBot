// edit.js
// ================================

const { Discord, sendEmbedLog, embedColors, botReply } = require('../twistedBot');
const config = require("../bot-settings.json");

module.exports.help = {
    name: "edit",
    description: "Modifies the bot messages.",
    type: "KICK_MEMBERS",
    usage: `ℹ️ Format: **${config.botPrefix}edit messageID contentToReplace**\n\nℹ️ Example: ${config.botPrefix}edit 134206921337076969 I like trains`
};

module.exports.run = async (bot, message, args) => {
    if (args[1]) return EditTheMessage(args[0], message.content.split(' ').splice(2).join(' '));
    else return botReply(`Wrong command format, type **${config.botPrefix}help ${module.exports.help.name}** to see usage and examples!`, message, 5000);

    async function EditTheMessage(A1, A2) {

        const messageEdited = await message.channel.messages.fetch(A1)
            .then(message2edit => message2edit.edit(A2))
            .catch(() => { // error when bot trying to edit wrong or message on the different channel
                return botReply(`Unfortunately, but I can't find the message you tried to edit.\nMake sure to type that command on the same channel as the target message!`, message, 10000);
            });

        if (messageEdited) {
            if (messageEdited.content === A2) {
                // define the embed: edit success
                let embed_edit_success = new Discord.MessageEmbed()
                    .setColor(embedColors.logMessage)
                    .setAuthor(`Message modified!`)
                    .setTitle(`${config.botPrefix}edit`)
                    .setDescription(`New message content:\n` + '```' + `${A2}` + '```')
                    .addFields(
                        { name: 'Used by', value: `${message.author}`, inline: true },
                        { name: 'Channel', value: `${message.channel}`, inline: true },
                        { name: 'MessageID', value: `${message.channel.id}\n\n[Jump to modified message](${messageEdited.url}, 'discord.gg')`, inline: false })
                    .setFooter(`LOG:ID EditJS_1`)
                    .setTimestamp()

                return botReply(`✅ Done!\nMessage modified!`, message, 5000)
                    .then(() => sendEmbedLog(embed_edit_success, config.other.logChannelID, 'Twisted Tranquility - Logs'));
            }
        }
    }
}