import { EmptyBorder, INPUT_KEY_BINDINGS } from "../consts";
import { CommandMenu } from "./command-menu";
import { StatusBar } from "./status-bar";

interface InputBarProps {
	onSubmit: (value: string) => void;
	disabled?: boolean;
}

export const InputBar = ({ onSubmit, disabled = false }: InputBarProps) => {
	return (
		<box width="100%" alignItems="center">
			<box
				border={["left"]}
				borderColor={"cyan"}
				customBorderChars={{ ...EmptyBorder, vertical: "┃", bottomLeft: "╹" }}
				width="100%"
			>
				<box
					position="relative"
					justifyContent="center"
					paddingX={2}
					paddingY={1}
					backgroundColor={"#1A1A24"}
					width="100%"
					gap={1}
				>
					<box
						position="absolute"
						bottom="100%"
						left={0}
						width="100%"
						backgroundColor={"#1A1A24"}
						zIndex={10}
					>
						{true && <CommandMenu query="" />}
					</box>
					<textarea
						focused={!disabled}
						placeholder={`Ask anything... "Fix a bug in the database"`}
						keyBindings={INPUT_KEY_BINDINGS}
					/>
					<StatusBar />
				</box>
			</box>
		</box>
	);
};
