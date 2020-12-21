const config = require("../bot-settings.json");
const { bot } = require('../ttBot');

//////////////////////////////////////////////////////////////////////////////////////////////
//                                   VERIFICATION HANDLER                                   //
//////////////////////////////////////////////////////////////////////////////////////////////

bot.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.channel.id != config.verificationChannelID) return; // block reactions outside verification channel.
    const captain = reaction.message.guild.members.cache.get(user.id).roles.cache.some(role => role.id === config.captainRoleID);
    const enforcer = reaction.message.guild.members.cache.get(user.id).roles.cache.some(role => role.id === config.enforcerRoleID);
    const officer = reaction.message.guild.members.cache.get(user.id).roles.cache.some(role => role.id === config.officerRoleID);
    const vice = reaction.message.guild.members.cache.get(user.id).roles.cache.some(role => role.id === config.viceRoleID);
    const leader = reaction.message.guild.members.cache.get(user.id).roles.cache.some(role => role.id === config.leaderRoleID);

    try {
        await reaction.message.fetch();
    } catch (error) { // If error while fetching reaction message
        return errorLog('verification.js:1\nProbably missing permissions [READ_MESSAGE_HISTORY] to fetch reaction.message object in the verification channel!', error);
    }

    if (captain || enforcer || officer || vice || leader) { // TT staff reaction function
        if (reaction.emoji.name === '✅')
            return verificationFunction(reaction.message);
        else return reaction.users.remove(user.id)
            .catch(error => reaction.message.channel.send(`❌ Bot reaction error:\n\`\`\`${error.message}\`\`\``).catch(() => { return })
                .then(message => { if (message) message.delete({ timeout: 10000 }) }).catch(() => { return })
            ); // remove reaction if the condition is not met
    } else
        return reaction.users.remove(user.id)
            .catch(error => reaction.message.channel.send(`❌ Bot reaction error:\n\`\`\`${error.message}\`\`\``).catch(() => { return })
                .then(message => { if (message) message.delete({ timeout: 10000 }) }).catch(() => { return })
            ); // remove reaction if the condition is not met

    //////////////////////////////////////////////////////////////////////////////////////////////

    function verificationFunction(message) {
        const messageContentWithoutSpaces = message.content.replace(/\s/g, '');
        const verificationContent = messageContentWithoutSpaces.split('/');
        console.debug(verificationContent);

        if (!verificationContent[1]) {
            return message.channel.send(`❌ Invalid verification format`).catch(() => { return })
                .then(message => {
                    if (message) message.delete({ timeout: 10000 });
                    return reaction.users.remove(user.id)
                        .catch(error => reaction.message.channel.send(`❌ Bot reaction error:\n\`\`\`${error.message}\`\`\``).catch(() => { return })
                            .then(message => { if (message) message.delete({ timeout: 10000 }) }).catch(() => { return })
                        ); // remove reaction if the condition is not met
                });
        } else {
            switch (verificationContent[1].toLowerCase()) {
                case 'm': case 'member': case 'memeber': {
                    giveMemberRole(reaction.message.member);
                    return renameUser(reaction.message.member, verificationContent[0], "member");
                }
                case 'n': case 'nonmember': case 'nomember': case 'nonmemeber': case 'nomemeber': return renameUser(reaction.message.member, verificationContent[0], "nonmember");
                default: {
                    return message.channel.send(`❌ Invalid verification format`).catch(() => { return })
                        .then(message => {
                            if (message) message.delete({ timeout: 10000 });
                            return reaction.users.remove(user.id)
                                .catch(error => reaction.message.channel.send(`❌ Bot reaction error:\n\`\`\`${error.message}\`\`\``).catch(() => { return })
                                    .then(message => { if (message) message.delete({ timeout: 10000 }) }).catch(() => { return })
                                ); // remove reaction if not M nor N type
                        });
                }
            }
        }
    }

    function renameUser(member, nickname, mode) { // Rename user
        if (member) {
            switch (mode) {
                case "member": return member.setNickname(nickname + '🍀', 'Verification System')
                    // .then(changed => { console.debug(`${member.user.tag} nickname changed to: ${changed.nickname}`) })
                    .catch(error => reaction.message.channel.send(`❌ ${reaction.message.author.tag} rename error:\n\`\`\`${error.message}\`\`\``).catch(() => { return })
                        .then(message => { if (message) message.delete({ timeout: 10000 }) }).catch(() => { return }));

                case "nonmember": return member.setNickname(nickname, 'Verification System')
                    // .then(changed => { console.debug(`${member.user.tag} nickname changed to: ${changed.nickname}`) })
                    .catch(error => reaction.message.channel.send(`❌ ${reaction.message.author.tag} rename error:\n\`\`\`${error.message}\`\`\``).catch(() => { return })
                        .then(message => { if (message) message.delete({ timeout: 10000 }) }).catch(() => { return }));

                default: return;
            }
        } else {
            return reaction.message.channel.send(`❌ ERROR: ${reaction.message.author.tag} left the server or not cached.`).catch(() => { return })
                .then(message => {
                    if (message) message.delete({ timeout: 10000 });
                    return reaction.users.remove(user.id)
                        .catch(error => reaction.message.channel.send(`❌ Bot reaction error:\n\`\`\`${error.message}\`\`\``).catch(() => { return })
                            .then(message => { if (message) message.delete({ timeout: 10000 }) }).catch(() => { return })
                        ); // remove reaction if the condition is not met
                });
        }
    }

    async function giveMemberRole(memberObject) {
        const role2add = reaction.message.guild.roles.cache.find(role => role.id === config.memberRoleID);
        const role2del = reaction.message.guild.roles.cache.find(role => role.id === config.nonmemberRoleID);

        if (role2add && role2del) {
            if (memberObject) {
                await memberObject.roles.add(role2add).catch(error => {
                    reaction.message.channel.send(`❌ Error to add ${role2add.name} to ${memberObject.user.tag}!\n\`\`\`${error.message}\`\`\``).catch(() => { })
                        .then(message => { if (message) message.delete({ timeout: 10000 }) }).catch(() => { });

                    reaction.users.remove(user.id) // remove reaction if error
                        .catch(error => reaction.message.channel.send(`❌ Bot reaction error:\n\`\`\`${error.message}\`\`\``).catch(() => { })
                            .then(message => { if (message) message.delete({ timeout: 10000 }) }).catch(() => { })
                        );
                })
                    .then(async memberRoleAdded => {
                        if (!memberRoleAdded) return;

                        await memberObject.roles.remove(role2del).catch(error => {
                            reaction.message.channel.send(`❌ Error to remove ${role2del.name} from ${memberObject.user.tag}!\n\`\`\`${error.message}\`\`\``).catch(() => { })
                                .then(message => { if (message) message.delete({ timeout: 10000 }) }).catch(() => { });

                            reaction.users.remove(user.id) // remove reaction if error
                                .catch(error => reaction.message.channel.send(`❌ Bot reaction error:\n\`\`\`${error.message}\`\`\``).catch(() => { })
                                    .then(message => { if (message) message.delete({ timeout: 10000 }) }).catch(() => { })
                                );
                        })
                            .then(async nonmemberRoleAdded => {
                                if (memberRoleAdded && nonmemberRoleAdded) return reaction.message.channel.send(`✅ ${role2add.name} added to ${memberObject.user.tag}`).catch(() => { })
                                    .then(message => { if (message) message.delete({ timeout: 10000 }) }).catch(() => { });
                            })
                    });
            } else {
                reaction.users.remove(user.id) // remove reaction if the condition is not met
                    .catch(error => reaction.message.channel.send(`❌ Bot reaction error:\n\`\`\`${error.message}\`\`\``)
                        .then(message => message.delete({ timeout: 10000 })).catch(() => { })
                    );

                return reaction.message.channel.send(`❌ User not found as a server member.`).catch(() => { })
                    .then(message => { if (message) message.delete({ timeout: 10000 }) }).catch(() => { });
            }

        } else return reaction.message.channel.send(`❌ Error to find member or nonmember role!`).catch(() => { })
            .then(message => {
                if (message) message.delete({ timeout: 10000 });
                reaction.users.remove(user.id)
                    .catch(error => reaction.message.channel.send(`❌ Bot reaction error:\n\`\`\`${error.message}\`\`\``).catch(() => { })
                        .then(message => { if (message) message.delete({ timeout: 10000 }) }).catch(() => { })
                    ); // remove reaction if the condition is not met
            }).catch(() => { });
    }
})