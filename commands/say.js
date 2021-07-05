// say.js
// ================================

const { Discord, embedColors, botReply } = require('../twistedBot');
const config = require("../bot-settings.json");

module.exports.help = {
    name: "say",
    description: "Sends a message as the bot.",
    type: "KICK_MEMBERS",
    usage: `ℹ️ Format: **${config.botPrefix}say #channel(optional) embed(optional) messageToSend**\n\nℹ️ Examples:\n${config.botPrefix}say Hello 👋\n${config.botPrefix}say embed Hello 👋\n${config.botPrefix}say <#${config.WelcomeChannelID}> Hello 👋\n${config.botPrefix}say <#${config.WelcomeChannelID}> embed Hello 👋`
};

module.exports.run = async (bot, message, args) => {
    if (args[0]) return BotSayTheMessage(args[0], args[1], args[2]); // Run function to send the message as a bot user
    else return botReply(`Wrong command format, type **${config.botPrefix}help ${module.exports.help.name}** to see usage and examples!`, message, 5000);

    function BotSayTheMessage(A1, A2, A3) {
        // const replaceMentionToID = A1.toString().replace(/[\\<>@#&!]/g, ""); // replace mention to an ID
        const mentionedChannel = bot.channels.cache.get(A1.toString().replace(/[\\<>@#&!]/g, ""));

        if (mentionedChannel) {
            if (!A2) return botReply(`You forgot to type the text to send!`, message, 5000);

            if (A2.toLowerCase() === "embed") {
                if (!A3) return botReply(`You forgot to type the text to send!`, message, 5000);
                const embed_say = new Discord.MessageEmbed()
                    .setColor(embedColors.sayMessage)
                    .setAuthor('Twisted Tranquility')
                    .setDescription(args.slice(2).join(" "))
                    .setTimestamp()
                    .setFooter(`Sent by ${message.author.tag}`)

                mentionedChannel.send(embed_say)
                    .then(() => botReply(`Message sent to the ${mentionedChannel}!`, message, 3000))
                    .catch(error => console.error(`say.js:1 BotSayTheMessage() ${error}`));
            } else return mentionedChannel.send(args.slice(1).join(" "))
                .then(() => botReply(`Message sent to the ${mentionedChannel}!`, message, 3000))
                .catch(error => console.error(`say.js:2 BotSayTheMessage() ${error}`));

        } else {
            if (A1.toLowerCase() === "embed") {
                if (!A2) return botReply(`You forgot to type the text to send!`, message, 5000);
                const embed_say = new Discord.MessageEmbed()
                    .setColor(embedColors.sayMessage)
                    .setAuthor('Twisted Tranquility')
                    .setDescription(args.slice(1).join(" "))
                    .setTimestamp()
                    .setFooter(`Sent by ${message.author.tag}`)
                botReply(embed_say, message);
            } else return botReply(args.join(" "), message);
        }
    }
}