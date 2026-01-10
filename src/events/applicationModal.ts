import { ModalSubmitInteraction, GuildMember } from "discord.js";

// 🔴 SAME IDS AS IN embedButtons.ts
const INTERVIEW_ROLE_ID = "1453665716653002774";
const INTERVIEW_VC_ID = "1453665716653002774";

export async function handleApplicationModal(interaction: ModalSubmitInteraction) {
    /* =========================
       ACCEPT WITH REASON
    ========================== */
    if (interaction.customId.startsWith("accept_modal_")) {
        await interaction.deferReply({ flags: 64 });

        const userId = interaction.customId.replace("accept_modal_", "");
        const reason = interaction.fields.getTextInputValue("reason");

        const guild = interaction.guild;
        if (!guild) return;

        try {
            const member = await guild.members.fetch(userId);

            // Add Role
            await member.roles.add(INTERVIEW_ROLE_ID);

            // Unlock VC
            const interviewVC = guild.channels.cache.get(INTERVIEW_VC_ID);
            if (interviewVC?.isVoiceBased()) {
                await interviewVC.permissionOverwrites.edit(userId, {
                    Connect: true,
                });
            }

            // Send DM
            await member.send(
                `✅ **Your application has been accepted.**\n\n**Reason:** ${reason}\n\nYou can now join the **Interview Voice Channel**.`
            );

            // Confirm to Admin
            await interaction.editReply({
                content: `✅ Accepted <@${userId}> with reason: **${reason}**`,
            });
        } catch (error) {
            console.error("Error in accept_modal:", error);
            await interaction.editReply({
                content: `❌ Error processing acceptance. User might have blocked DMs or left the server.`,
            });
        }
        return;
    }

    /* =========================
       DENY WITH REASON
    ========================== */
    if (interaction.customId.startsWith("deny_modal_")) {
        await interaction.deferReply({ flags: 64 });

        const userId = interaction.customId.replace("deny_modal_", "");
        const reason = interaction.fields.getTextInputValue("reason");

        try {
            const member = await interaction.guild?.members.fetch(userId);

            if (member) {
                await member.send(
                    `❌ **Your application has been denied.**\n\n**Reason:** ${reason}\n\nYou may apply again later.`
                );
            }

            await interaction.editReply({
                content: `❌ Application denied for <@${userId}> with reason: **${reason}**`,
            });
        } catch (error) {
            console.error("Error in deny_modal:", error);
            await interaction.editReply({
                content: `❌ Error processing denial. User might have blocked DMs.`,
            });
        }
        return;
    }
}
