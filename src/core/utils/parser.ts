export const parseForArguments = (message: string) => {
  return message.toLowerCase().trim().split(" ").slice(1);
};
