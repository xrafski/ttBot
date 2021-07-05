const config = require("../bot-settings.json");
const { bot, botReply } = require('../twistedBot');

//////////////////////////////////////////////////////////////////////////////////////////////
//                                   VERIFICATION HANDLER                                   //
//////////////////////////////////////////////////////////////////////////////////////////////

bot.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.channel.id != config.verification.channelID) return; // block reactions outside verification channel.
    const captain = reaction.message.guild.members.cache.get(user.id).roles.cache.some(role => role.id === config.roles.captainRoleID);
    const enforcer = reaction.message.guild.members.cache.get(user.id).roles.cache.some(role => role.id === config.roles.enforcerRoleID);
    const officer = reaction.message.guild.members.cache.get(user.id).roles.cache.some(role => role.id === config.roles.officerRoleID);
    const vice = reaction.message.guild.members.cache.get(user.id).roles.cache.some(role => role.id === config.roles.viceRoleID);
    const leader = reaction.message.guild.members.cache.get(user.id).roles.cache.some(role => role.id === config.roles.leaderRoleID);

    try {
        await reaction.message.fetch();
    } catch (error) { // If error while fetching reaction message
        return console.error(`verification.js:1 () ${error}`);
    }

    if (captain || enforcer || officer || vice || leader) { // TT staff reactions
        if (reaction.emoji.name === '✅')
            return verificationFunction(reaction.message)
                .then(() => console.info(`verification.js (ℹ) '${user.tag}' reacted with '${reaction.emoji.name}' on #${reaction.message.channel.name} channel under ${reaction.message.url} message.`));
        else return reaction.users.remove(user.id)
            .catch(error => botReply(`${user} ❌ Bot reaction error:\n\`\`\`${error}\`\`\``, reaction.message, 5000)); // remove reaction if the condition is not met
    } else return reaction.users.remove(user.id)
        .catch(error => botReply(`${user} ❌ Bot reaction error:\n\`\`\`${error}\`\`\``, reaction.message, 5000)); // remove reaction if the condition is not met

    //////////////////////////////////////////////////////////////////////////////////////////////

    function verificationFunction(message) {
        const verificationContent = message.content.replace(/\s/g, '').split('/');
        if (!verificationContent[1]) {
            botReply(`${user} ❌ Invalid verification format`, message, 5000);
            return reaction.users.remove(user.id)
                .catch(error => botReply(`${user} ❌ Bot reaction error:\n\`\`\`${error}\`\`\``, message, 5000));
        } else {
            switch (verificationContent[1].toLowerCase()) {
                case 'm': case 'member': case 'memeber': return giveMemberRole(reaction.message.member, verificationContent[0]);
                case 'n': case 'nonmember': case 'nomember': case 'nonmemeber': case 'nomemeber': case 'non-member': case 'no-member': case 'non-memeber': case 'no-memeber': return renameUser(reaction.message.member, verificationContent[0], "nonmember");
                default: {
                    botReply(`${user} ❌ Invalid verification format`, message, 5000);
                    return reaction.users.remove(user.id)
                        .catch(error => botReply(`${user} ❌ Bot reaction error:\n\`\`\`${error}\`\`\``, mesage, 5000));
                }
            }
        }
    }

    async function giveMemberRole(memberObject, nickName) {
        const role2add = reaction.message.guild.roles.cache.find(role => role.id === config.roles.memberRoleID);
        const role2del = reaction.message.guild.roles.cache.find(role => role.id === config.roles.nonmemberRoleID);
        if (role2add && role2del) {
            if (memberObject) {
                return await memberObject.roles.add(role2add).catch(error => {
                    botReply(`${user} ❌ Error to add ${role2add.name} to ${memberObject.user.tag}!\n\`\`\`${error}\`\`\``, reaction.message, 5000);
                    reaction.users.remove(user.id) // remove reaction if error
                        .catch(error => botReply(`${user} ❌ Bot reaction error:\n\`\`\`${error}\`\`\``, reaction.message, 5000));
                })
                    .then(async memberRoleAdded => {
                        if (!memberRoleAdded) return;
                        await memberObject.roles.remove(role2del)
                            .catch(error => {
                                botReply(`${user} ❌ Error to remove ${role2del.name} from ${memberObject.user.tag}!\n\`\`\`${error}\`\`\``, reaction.message, 5000);
                                reaction.users.remove(user.id) // remove reaction if error
                                    .catch(error => botReply(`${user} ❌ Bot reaction error:\n\`\`\`${error}\`\`\``, reaction.message, 5000));
                            })
                            .then(nonmemberRoleAdded => {
                                if (memberRoleAdded && nonmemberRoleAdded) {
                                    botReply(`✅ ${role2add.name} added to ${memberObject.user.tag}`, reaction.message, 5000);
                                    return renameUser(memberObject, nickName, 'member');
                                }
                            })
                    });
            } else {
                reaction.users.remove(user.id) // remove reaction if the condition is not met
                    .catch(error => botReply(`${user} ❌ Bot reaction error:\n\`\`\`${error}\`\`\``, reaction.message, 5000));
                return botReply(`${user} ❌ User not found as a server member.`, reaction.message, 5000);
            }
        } else {
            botReply(`${user} ❌ Error to find member or nonmember role!`, reaction.message, 5000);
            return reaction.users.remove(user.id)
                .catch(error => botReply(`${user} ❌ Bot reaction error:\n\`\`\`${error}\`\`\``, reaction.message, 5000)); // remove reaction if the condition is not me
        }
    }

    function renameUser(member, nickname, mode) { // Rename user
        if (member) {
            switch (mode) {
                case "member": return member.setNickname(nickname + '🍀', 'Verification System')
                    .catch(error => {
                        botReply(`${user} ❌ ${member.user.tag} rename error:\n\`\`\`${error}\`\`\``, reaction.message, 5000);
                        return reaction.users.remove(user.id)
                            .catch(error => botReply(`${user} ❌ Bot reaction error:\n\`\`\`${error}\`\`\``, reaction.message, 5000));
                    });
                case "nonmember": return member.setNickname(nickname, 'Verification System')
                    .catch(error => {
                        botReply(`${user} ❌ ${member.user.tag} rename error:\n\`\`\`${error}\`\`\``, reaction.message, 5000);
                        return reaction.users.remove(user.id)
                            .catch(error => botReply(`${user} ❌ Bot reaction error:\n\`\`\`${error}\`\`\``, reaction.message, 5000));
                    });
                default: return;
            }
        } else {
            botReply(`${user} ❌ ERROR: ${reaction.message.author.tag} left the server or not cached.`, reaction.message, 5000);
            return reaction.users.remove(user.id)
                .catch(error => botReply(`${user} ❌ Bot reaction error:\n\`\`\`${error}\`\`\``, reaction.message, 5000)); // remove reaction if the condition is not met
        }
    }
})