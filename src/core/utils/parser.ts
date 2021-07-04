import { GuildMember, Message, Permissions } from "discord.js";

type Arguments = {
  member?: GuildMember;
  [key: string]: any;
};

/**
 *
 * @param requiresMention substitute for the name variable
 * @param subCmds array of values searching for
 * @returns object containing the sub command values
 */
export const parseForArguments = (
  message: Message,
  requiresMention: boolean,
  subCmds: string[]
) => {
  let args: Arguments = {};
  const cleanedMsg = message.content.toLowerCase().trim().split(" ").slice(1);
  if (requiresMention == true && message.mentions.members?.first() !== undefined) {
    // if true and have
    args["member"] = message.mentions.members.first();
  } else if (requiresMention == true && message.mentions.members?.first() === undefined) {
    // if true and not have
    args["member"] = undefined;
  }

  // loop through message and grab only the values that are in the subCmds array
  cleanedMsg.forEach((m) => {
    const halves = m.split("=");
    if (halves.length === 2) {
      if (subCmds.includes(halves[0])) {
        args[halves[0]] = halves[1];
      }
    }
  });
  return args;
};

export const hasAdminPermissions = (member: GuildMember | null): boolean => {
  if (member) {
    const isAdmin = member.hasPermission(Permissions.FLAGS.ADMINISTRATOR) ? true : false;
    return isAdmin;
  }
  return false;
};

export const isMember = (message: Message) => {
  const status = message.member !== null ? true : false;
  return status;
};

export const argumentsFulfilled = (
  args: Arguments,
  subCmds: string[],
  requiresMention: boolean
): boolean => {
  let fulfilled = true;
  for (const cmd of subCmds) {
    if (args[cmd] === undefined) {
      fulfilled = false;
    }
  }
  if (requiresMention && args["member"] === undefined) {
    fulfilled = false;
  }

  return fulfilled;
};
