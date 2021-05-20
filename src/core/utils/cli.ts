export default class CliBase {
    protected PRIMARY_PREFIX = "!";
    protected SECONDARY_PREFIX = "-";
    protected MAX_SUB_COMMANDS = 3;

    private getCommands(args: string[]) {
        let primaryCmd: string[] | undefined = [];
        let secondaryCmd: string[] | undefined = [];

        args.forEach((arg) => {
            // check if more than one primary command else clean and store
            if (arg.startsWith(this.PRIMARY_PREFIX)) {
                if (primaryCmd.length === 1) console.error("Only 1 command at a time");
                primaryCmd.push(arg.slice(this.PRIMARY_PREFIX.length));
            } // check if more than max sub commands else clean and store
            else if (arg.startsWith(this.SECONDARY_PREFIX)) {
                if (secondaryCmd.length === this.MAX_SUB_COMMANDS) {
                    console.error(
                        `Only ${this.MAX_SUB_COMMANDS} sub-command(s) at a time`
                    );
                }
                secondaryCmd.push(arg.slice(this.SECONDARY_PREFIX.length));
            }
        });

        return {
            primaryCommand: primaryCmd[0],
            subCommands: secondaryCmd,
        };
    }

    Commands(content: string) {
        const args = content.trim().toLowerCase().split(/ +/g);
        if (args.length > 5) console.error("To many arguments in your message");
        return this.getCommands(args);
    }
}
