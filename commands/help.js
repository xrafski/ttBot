// help.js
// ================================

const { getCommand, messageRemoverWithReact, botReply } = require('../ttBot');
const config = require("../bot-settings.json");

module.exports.help = {
    name: "help",
    description: "List all of commands.",
    type: "public",
    usage: `**${config.botPrefix}help**\n${config.botPrefix}help commandName`
};

module.exports.run = async (bot, message, args) => {
    if (args[0]) {
        if (getCommand(args[0])) return botReply(`Help for the **${config.botPrefix}${args[0]}** command:\nAccess Level: __${getCommand(args[0]).help.type}__\nDescription: ${getCommand(args[0]).help.description}\n\nUsage: ${getCommand(args[0]).help.usage}`, message)
            .then(helpMessage => messageRemoverWithReact(helpMessage, message.author));
    } else {
        const dataArray = {
            'owner': getCommand().filter(command => command.help.type.includes('owner')).map(command => `**${command.help.name}** • ${command.help.description}`).join('\n'),
            'kick': getCommand().filter(command => command.help.type.includes('KICK_MEMBERS')).map(command => `**${command.help.name}** • ${command.help.description}`).join('\n'),
            'public': getCommand().filter(command => command.help.type.includes('public')).map(command => `**${command.help.name}** • ${command.help.description}`).join('\n'),
            'disabled': getCommand().filter(command => command.help.type.includes('disabled')).map(command => `**${command.help.name}** • ${command.help.description}`).join('\n')
        }

        if (!dataArray.disabled) {
            return botReply(`List of all commands! (prefix: **${config.botPrefix}**)\nType **${config.botPrefix}help commandName** for more details.\n
⭐ Owner Commands:\n${dataArray.owner = dataArray.owner || 'There are no owner commands.'}\n
👮‍♂️ KICK_MEMBERS Commands:\n${dataArray.kick = dataArray.kick || 'There are no KICK_MEMBERS commands.'}\n
📢 Public Commands:\n${dataArray.public = dataArray.public || 'There are no public commands.'}`, message)
                .then(helpMessage => messageRemoverWithReact(helpMessage, message.author));
        } else return botReply(`List of all commands! (prefix: **${config.botPrefix}**)\nType **${config.botPrefix}help commandName** for more details.\n
⭐ Owner Commands:\n${dataArray.owner = dataArray.owner || 'There are no owner commands.'}\n
👮‍♂️ KICK_MEMBERS Commands:\n${dataArray.kick = dataArray.kick || 'There are no KICK_MEMBERS commands.'}\n
📢 Public Commands:\n${dataArray.public = dataArray.public || 'There are no public commands.'}\n
❌ Disabled Commands:\n${dataArray.disabled = dataArray.disabled || 'There are no disabled commands.'}`, message)
            .then(helpMessage => messageRemoverWithReact(helpMessage, message.author));
    }
}