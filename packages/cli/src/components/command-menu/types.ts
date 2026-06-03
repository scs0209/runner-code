export type CommandContext = {
	exit: () => void;
	navigate: (path: string) => void;
};

export type Command = {
	name: string;
	description: string;
	value: string;
	action?: (ctx: CommandContext) => void | Promise<void>;
};
