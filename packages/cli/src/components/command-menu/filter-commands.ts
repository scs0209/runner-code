import { COMMANDS } from "./commands";
import type { Command } from "./types";

/**
 * Selects commands whose names start with the given query, using case-insensitive prefix matching.
 *
 * If `query` is an empty string, the full list of commands is returned.
 *
 * @param query - The prefix to match against each command's name (case-insensitive).
 * @returns The array of commands whose names start with `query`; the full command list when `query` is empty.
 */
export function getFilteredCommands(query: string): Command[] {
	if (query.length === 0) return COMMANDS;
	return COMMANDS.filter((cmd) =>
		cmd.name.toLowerCase().startsWith(query.toLowerCase()),
	);
}
