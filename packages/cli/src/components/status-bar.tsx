import { TextAttributes } from "@opentui/core";

/**
 * Renders a horizontal status bar showing a "Build" label, a dimmed separator glyph, and a version string.
 *
 * @returns The JSX element for the status bar containing the build label, separator, and version.
 */
export function StatusBar() {
	return (
		<box flexDirection="row" gap={1}>
			<text fg={"cyan"}>Build</text>

			<text attributes={TextAttributes.DIM} fg={"gray"}>
				›
			</text>
			<text>opus-4-6</text>
		</box>
	);
}
