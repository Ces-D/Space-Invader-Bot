import Table from "cli-table";
import { ColorResolvable, MessageEmbed } from "discord.js";

export const embedTable = (
  data: string[][],
  color: ColorResolvable,
  head: string[],
  name: string
): MessageEmbed => {
  const embed = new MessageEmbed();
  const table = new Table({
    head: head,
    colWidths: [100, 200],
  });
  data.forEach((v) => {
    table.push(v);
  });

  embed.addField(name, table);
  embed.setColor(color);
  return embed;
};
