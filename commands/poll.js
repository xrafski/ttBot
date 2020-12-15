const config = require("../bot-settings.json");
const { Discord, embedColors, emojiCharacters } = require("../ttBot");

module.exports.help = {
    name: "poll",
    description: "Quick and easy poll with multiple options, supports up to 10 choices.",
    type: "KICK_MEMBERS",
    usage: `ℹ️ Format: **${config.BotPrefix}poll Description | Option#1 | Option#2 | Option#3**\n\nℹ️ Examples:\n${config.BotPrefix}poll What is your favorite pet? | Dog | Cat | Komodo dragon`
};

module.exports.run = async (bot, message) => {
    //////////////////////////////////////////////////////////////////////////////////////////////
    //                                           poll                                           //
    //////////////////////////////////////////////////////////////////////////////////////////////
    const pollMessage = message.content.slice(Math.round(config.BotPrefix.length + module.exports.help.name.length) + 1);
    const pollMessageArray = pollMessage.split(" | ");

    if (pollMessage) {
        if (pollMessageArray.length < 3) return message.channel.send(`Wrong command format, type **${config.BotPrefix}help ${module.exports.help.name}** to see usage and examples!`)
            .then(message => message.delete({ timeout: 10000 })).catch(() => { return });

        if (pollMessageArray.length > 11) return message.channel.send(`Command **${config.BotPrefix}${module.exports.help.name}** support only up to 10 options!`)
            .then(message => message.delete({ timeout: 10000 })).catch(() => { return });

        switch (pollMessageArray.length) {
            case 3: return sendPollEmbedMessage(`${emojiCharacters[1]} ${pollMessageArray[1]}\n${emojiCharacters[2]} ${pollMessageArray[2]}`, message);
            case 4: return sendPollEmbedMessage(`${emojiCharacters[1]} ${pollMessageArray[1]}\n${emojiCharacters[2]} ${pollMessageArray[2]}\n${emojiCharacters[3]} ${pollMessageArray[3]}`, message);
            case 5: return sendPollEmbedMessage(`${emojiCharacters[1]} ${pollMessageArray[1]}\n${emojiCharacters[2]} ${pollMessageArray[2]}\n${emojiCharacters[3]} ${pollMessageArray[3]}\n${emojiCharacters[4]} ${pollMessageArray[4]}`, message);
            case 6: return sendPollEmbedMessage(`${emojiCharacters[1]} ${pollMessageArray[1]}\n${emojiCharacters[2]} ${pollMessageArray[2]}\n${emojiCharacters[3]} ${pollMessageArray[3]}\n${emojiCharacters[4]} ${pollMessageArray[4]}\n${emojiCharacters[5]} ${pollMessageArray[5]}`, message);
            case 7: return sendPollEmbedMessage(`${emojiCharacters[1]} ${pollMessageArray[1]}\n${emojiCharacters[2]} ${pollMessageArray[2]}\n${emojiCharacters[3]} ${pollMessageArray[3]}\n${emojiCharacters[4]} ${pollMessageArray[4]}\n${emojiCharacters[5]} ${pollMessageArray[5]}\n${emojiCharacters[6]} ${pollMessageArray[6]}`, message);
            case 8: return sendPollEmbedMessage(`${emojiCharacters[1]} ${pollMessageArray[1]}\n${emojiCharacters[2]} ${pollMessageArray[2]}\n${emojiCharacters[3]} ${pollMessageArray[3]}\n${emojiCharacters[4]} ${pollMessageArray[4]}\n${emojiCharacters[5]} ${pollMessageArray[5]}\n${emojiCharacters[6]} ${pollMessageArray[6]}\n${emojiCharacters[7]} ${pollMessageArray[7]}`, message);
            case 9: return sendPollEmbedMessage(`${emojiCharacters[1]} ${pollMessageArray[1]}\n${emojiCharacters[2]} ${pollMessageArray[2]}\n${emojiCharacters[3]} ${pollMessageArray[3]}\n${emojiCharacters[4]} ${pollMessageArray[4]}\n${emojiCharacters[5]} ${pollMessageArray[5]}\n${emojiCharacters[6]} ${pollMessageArray[6]}\n${emojiCharacters[7]} ${pollMessageArray[7]}\n${emojiCharacters[8]} ${pollMessageArray[8]}`, message);
            case 10: return sendPollEmbedMessage(`${emojiCharacters[1]} ${pollMessageArray[1]}\n${emojiCharacters[2]} ${pollMessageArray[2]}\n${emojiCharacters[3]} ${pollMessageArray[3]}\n${emojiCharacters[4]} ${pollMessageArray[4]}\n${emojiCharacters[5]} ${pollMessageArray[5]}\n${emojiCharacters[6]} ${pollMessageArray[6]}\n${emojiCharacters[7]} ${pollMessageArray[7]}\n${emojiCharacters[8]} ${pollMessageArray[8]}\n${emojiCharacters[9]} ${pollMessageArray[9]}`, message);
            case 11: return sendPollEmbedMessage(`${emojiCharacters[1]} ${pollMessageArray[1]}\n${emojiCharacters[2]} ${pollMessageArray[2]}\n${emojiCharacters[3]} ${pollMessageArray[3]}\n${emojiCharacters[4]} ${pollMessageArray[4]}\n${emojiCharacters[5]} ${pollMessageArray[5]}\n${emojiCharacters[6]} ${pollMessageArray[6]}\n${emojiCharacters[7]} ${pollMessageArray[7]}\n${emojiCharacters[8]} ${pollMessageArray[8]}\n${emojiCharacters[9]} ${pollMessageArray[9]}\n${emojiCharacters[10]} ${pollMessageArray[10]}`, message);
            default: return console.debug(`poll text: that not should be fired even once!`);
        }

    } else return message.channel.send(`Wrong command format, type **${config.BotPrefix}help ${module.exports.help.name}** to see usage and examples!`)
        .then(message => message.delete({ timeout: 10000 })).catch(() => { return });

    /////////////////////////////////////////////////////////////////////////////////////////

    function sendPollEmbedMessage(text, message) {
        // define the embed: poll message
        const embed_poll = new Discord.MessageEmbed()
            .setColor(embedColors.pollMessage)
            .setAuthor('Twisted Tranquility Poll')
            .setTitle(`${pollMessageArray[0]}‏‏‎‏‏‎`)
            .setDescription(text)
            .setTimestamp()
            .setFooter(`Sent by ${message.author.tag}`)
        return message.channel.send(embed_poll)
            .then(pollEmbed => { addOptionReactions(pollEmbed, pollMessageArray.length); })
            .catch(error => {
                message.channel.send(`❌ Something went wrong to send poll\n\nSummary: \`\`\`${error.message}\`\`\``)
                    .then(message => message.delete({ timeout: 15000 })).catch(() => { return });
            });
    }

    async function addOptionReactions(pollEmbed, amount) {
        switch (amount) {
            case 3: try {
                await pollEmbed.react(emojiCharacters[1]);
                await pollEmbed.react(emojiCharacters[2]);
                return;
            } catch (error) {
                if (pollEmbed.deletable) pollEmbed.delete();
                return message.channel.send(`❌ Something went wrong to add poll reactions\n\nSummary: \`\`\`${error.message}\`\`\``)
                    .then(message => message.delete({ timeout: 15000 })).catch(() => { return });
            }

            case 4: try {
                await pollEmbed.react(emojiCharacters[1]);
                await pollEmbed.react(emojiCharacters[2]);
                await pollEmbed.react(emojiCharacters[3]);
                return;
            } catch (error) {
                if (pollEmbed.deletable) pollEmbed.delete();
                return message.channel.send(`❌ Something went wrong to add poll reactions\n\nSummary: \`\`\`${error.message}\`\`\``)
                    .then(message => message.delete({ timeout: 15000 })).catch(() => { return });
            }

            case 5: try {
                await pollEmbed.react(emojiCharacters[1]);
                await pollEmbed.react(emojiCharacters[2]);
                await pollEmbed.react(emojiCharacters[3]);
                await pollEmbed.react(emojiCharacters[4]);
                return;
            } catch (error) {
                if (pollEmbed.deletable) pollEmbed.delete();
                return message.channel.send(`❌ Something went wrong to add poll reactions\n\nSummary: \`\`\`${error.message}\`\`\``)
                    .then(message => message.delete({ timeout: 15000 })).catch(() => { return });
            }

            case 6: try {
                await pollEmbed.react(emojiCharacters[1]);
                await pollEmbed.react(emojiCharacters[2]);
                await pollEmbed.react(emojiCharacters[3]);
                await pollEmbed.react(emojiCharacters[4]);
                await pollEmbed.react(emojiCharacters[5]);
                return;
            } catch (error) {
                if (pollEmbed.deletable) pollEmbed.delete();
                return message.channel.send(`❌ Something went wrong to add poll reactions\n\nSummary: \`\`\`${error.message}\`\`\``)
                    .then(message => message.delete({ timeout: 15000 })).catch(() => { return });
            }

            case 7: try {
                await pollEmbed.react(emojiCharacters[1]);
                await pollEmbed.react(emojiCharacters[2]);
                await pollEmbed.react(emojiCharacters[3]);
                await pollEmbed.react(emojiCharacters[4]);
                await pollEmbed.react(emojiCharacters[5]);
                await pollEmbed.react(emojiCharacters[6]);
                return;
            } catch (error) {
                if (pollEmbed.deletable) pollEmbed.delete();
                return message.channel.send(`❌ Something went wrong to add poll reactions\n\nSummary: \`\`\`${error.message}\`\`\``)
                    .then(message => message.delete({ timeout: 15000 })).catch(() => { return });
            }

            case 8: try {
                await pollEmbed.react(emojiCharacters[1]);
                await pollEmbed.react(emojiCharacters[2]);
                await pollEmbed.react(emojiCharacters[3]);
                await pollEmbed.react(emojiCharacters[4]);
                await pollEmbed.react(emojiCharacters[5]);
                await pollEmbed.react(emojiCharacters[6]);
                await pollEmbed.react(emojiCharacters[7]);
                return;
            } catch (error) {
                if (pollEmbed.deletable) pollEmbed.delete();
                return message.channel.send(`❌ Something went wrong to add poll reactions\n\nSummary: \`\`\`${error.message}\`\`\``)
                    .then(message => message.delete({ timeout: 15000 })).catch(() => { return });
            }

            case 9: try {
                await pollEmbed.react(emojiCharacters[1]);
                await pollEmbed.react(emojiCharacters[2]);
                await pollEmbed.react(emojiCharacters[3]);
                await pollEmbed.react(emojiCharacters[4]);
                await pollEmbed.react(emojiCharacters[5]);
                await pollEmbed.react(emojiCharacters[6]);
                await pollEmbed.react(emojiCharacters[7]);
                await pollEmbed.react(emojiCharacters[8]);
                return;
            } catch (error) {
                if (pollEmbed.deletable) pollEmbed.delete();
                return message.channel.send(`❌ Something went wrong to add poll reactions\n\nSummary: \`\`\`${error.message}\`\`\``)
                    .then(message => message.delete({ timeout: 15000 })).catch(() => { return });
            }

            case 10: try {
                await pollEmbed.react(emojiCharacters[1]);
                await pollEmbed.react(emojiCharacters[2]);
                await pollEmbed.react(emojiCharacters[3]);
                await pollEmbed.react(emojiCharacters[4]);
                await pollEmbed.react(emojiCharacters[5]);
                await pollEmbed.react(emojiCharacters[6]);
                await pollEmbed.react(emojiCharacters[7]);
                await pollEmbed.react(emojiCharacters[8]);
                await pollEmbed.react(emojiCharacters[9]);
                return;
            } catch (error) {
                if (pollEmbed.deletable) pollEmbed.delete();
                return message.channel.send(`❌ Something went wrong to add poll reactions\n\nSummary: \`\`\`${error.message}\`\`\``)
                    .then(message => message.delete({ timeout: 15000 })).catch(() => { return });
            }

            case 11: try {
                await pollEmbed.react(emojiCharacters[1]);
                await pollEmbed.react(emojiCharacters[2]);
                await pollEmbed.react(emojiCharacters[3]);
                await pollEmbed.react(emojiCharacters[4]);
                await pollEmbed.react(emojiCharacters[5]);
                await pollEmbed.react(emojiCharacters[6]);
                await pollEmbed.react(emojiCharacters[7]);
                await pollEmbed.react(emojiCharacters[8]);
                await pollEmbed.react(emojiCharacters[9]);
                await pollEmbed.react(emojiCharacters[10]);
                return;
            } catch (error) {
                if (pollEmbed.deletable) pollEmbed.delete();
                return message.channel.send(`❌ Something went wrong to add poll reactions\n\nSummary: \`\`\`${error.message}\`\`\``)
                    .then(message => message.delete({ timeout: 15000 })).catch(() => { return });
            }

            default: return console.debug(`poll reactions: that not should be fired even once!`);
        }
    }
}