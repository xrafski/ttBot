// command-listener.js
// ================================

const { bot, removeUserLastMessage, errorLog, botReply } = require('../ttBot');
const config = require("../bot-settings.json");

bot.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.botPrefix)) return;

    const args = message.content.slice(config.botPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let cmdFile = bot.commands.get(command);
    if (cmdFile) {
        removeUserLastMessage(message);
        console.info(`command-listener.js (ℹ) '${message.author.tag}' used '${(message.content.length > 40 ? `${message.content.slice(0, 40)}...` : `${message.content}`)}' on the ${(message.channel?.name ? `#${message.channel.name} channel` : 'direct message')}.`);

        switch (cmdFile.help.type) {
            case "KICK_MEMBERS": {
                if (message.channel.type != "dm") {
                    if (message.guild.id === config.TTserverID && message.member.hasPermission("KICK_MEMBERS")) return cmdFile.run(bot, message, args);
                    else return message.reply(`You don't have access to run **${config.botPrefix}${cmdFile.help.name}**!`)
                        .then(message => { message.delete({ timeout: 10000 }).catch(() => { }) });
                } else return botReply(`**${config.botPrefix}${cmdFile.help.name}** is not available on DM!`, message);
            }

            case "owner": if (message.channel.type != "dm") {
                if (message.author == message.guild.owner.user || message.author.id === config.botOwnerID) return cmdFile.run(bot, message, args);
                else return botReply(`**${config.botPrefix}${cmdFile.help.name}** is only available for server owner!`, message, 5000);
            } else return botReply(`**${config.botPrefix}${cmdFile.help.name}** is not available on DM!`, message);

            case "dm": if (message.channel.type === "dm") return cmdFile.run(bot, message, args);
            else return botReply(`**${config.botPrefix}${cmdFile.help.name}** is only available via direct message.`, message, 5000)

            case "public": if (message.channel.type != "dm") return cmdFile.run(bot, message, args)
            else return botReply(`**${config.botPrefix}${cmdFile.help.name}** is not available on DM!`, message);

            case "disabled": if (message.channel.type != "dm") return botReply(`**${config.botPrefix}${cmdFile.help.name}** is currently **disabled**!`, message, 5000);
            else return botReply(`**${config.botPrefix}${cmdFile.help.name}** is not available on DM!`, message);

            default: return errorLog(`command-listener.js:1 command switch() default - no type was found for the ${cmdFile.help.name} command.`);
        }
    }
});