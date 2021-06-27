import { GuildMember, Message, Permissions } from "discord.js";

export const parseForArguments = (
  message: Message,
  requiresMention: boolean,
  subCmds: string[]
) => {
  let args: { [key: string]: any } = {};
  const cleanedMsg = message.content.toLowerCase().trim().split(" ").slice(1);
  if (requiresMention) {
    if (message.mentions.members?.first(1).length === 1) {
      args["member"] = message.mentions.members.first(1);
    } else {
      throw "You are missing arguments. Try again";
    }
  }
  cleanedMsg.forEach((m) => {
    const halves = m.split("=");
    if (halves.length === 2) {
      subCmds.includes(halves[0]);
      args[halves[0]] = halves[1];
    }
  });
  console.log("Arguments: ", args);
  return args;
};

export const hasAdminPermissions = (member: GuildMember | null): boolean => {
  if (member) {
    const isAdmin = member.hasPermission(Permissions.FLAGS.ADMINISTRATOR) ? true : false;
    return isAdmin;
  }
  return false;
};

//TODO: make sure there are no spaces between the subcommands and the = sign
