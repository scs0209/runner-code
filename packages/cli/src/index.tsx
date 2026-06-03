import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { Header } from "./components/header";
import { InputBar } from "./components/input-bar";

/**
 * Root application component that renders the centered CLI UI layout.
 *
 * Renders a full-screen container with a dark background that centers its content,
 * includes the `Header`, and a constrained-width area that hosts the `InputBar`.
 *
 * @returns The root JSX element for the CLI application containing the header and input bar.
 */
function App() {
	return (
		<box
			alignItems="center"
			justifyContent="center"
			backgroundColor="#0D0D12"
			width="100%"
			height="100%"
			gap={2}
		>
			<Header />
			<box width="100%" maxWidth={78} paddingX={2}>
				<InputBar onSubmit={() => {}} />
			</box>
		</box>
	);
}

const renderer = await createCliRenderer({
	targetFps: 60,
	exitOnCtrlC: false,
});
createRoot(renderer).render(<App />);
