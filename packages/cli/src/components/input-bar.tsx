import type { TextareaRenderable } from "@opentui/core";
import { useRenderer } from "@opentui/react";
import { useCallback, useEffect, useRef } from "react";
import { EmptyBorder, INPUT_KEY_BINDINGS } from "../consts";
import { CommandMenu } from "./command-menu";
import type { Command } from "./command-menu/types";
import { useCommandMenu } from "./command-menu/use-command-menu";
import { StatusBar } from "./status-bar";

interface InputBarProps {
	onSubmit: (value: string) => void;
	disabled?: boolean;
}

export const InputBar = ({ onSubmit, disabled = false }: InputBarProps) => {
	const textareaRef = useRef<TextareaRenderable>(null);
	const onSubmitRef = useRef<() => void>(() => {});
	const renderer = useRenderer();

	const {
		showCommandMenu,
		commandQuery,
		selectedIndex,
		scrollRef,
		handleContentChange,
		resolveCommand,
		setSelectedIndex,
	} = useCommandMenu();

	const handleTextareaChange = useCallback(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		handleContentChange(textarea.plainText);
	}, [handleContentChange]);

	const handleSubmit = useCallback(() => {
		if (disabled) return;

		const textarea = textareaRef.current;
		if (!textarea) return;

		const text = textarea.plainText.trim();
		if (text.length === 0) return;

		onSubmit(text);
		textarea.setText("");
	}, [disabled, onSubmit]);

	const handleCommand = useCallback(
		(command?: Command) => {
			const textarea = textareaRef.current;
			if (!textarea || !command) return;

			textarea.setText("");

			if (command.action) {
				command.action({
					exit: () => renderer.destroy(),
					navigate: (_path: string) => {
						// 라우팅 레이어가 아직 없어 현재는 no-op 처리
					},
				});
			} else {
				textarea.insertText(command.value + " ");
			}
		},
		[renderer],
	);

	const handleCommandExecute = useCallback(
		(index: number) => {
			const command = resolveCommand(index);
			handleCommand(command);
		},
		[handleCommand, resolveCommand],
	);

	// 텍스트 입력 핸들러 설정
	useEffect(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		textarea.onSubmit = () => {
			onSubmitRef.current();
		};
	}, []);

	// 제출 핸들러 설정
	onSubmitRef.current = () => {
		if (disabled) return;

		if (showCommandMenu) {
			const command = resolveCommand(selectedIndex);
			handleCommand(command);
			return;
		}

		handleSubmit();
	};

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
					{showCommandMenu && (
						<box
							position="absolute"
							bottom="100%"
							left={0}
							width="100%"
							backgroundColor={"#1A1A24"}
							zIndex={10}
						>
							<CommandMenu
								query={commandQuery}
								selectedIndex={selectedIndex}
								scrollRef={scrollRef}
								onSelect={setSelectedIndex}
								onExecute={handleCommandExecute}
							/>
						</box>
					)}
					<textarea
						ref={textareaRef}
						focused={!disabled}
						placeholder={`Ask anything... "Fix a bug in the database"`}
						keyBindings={INPUT_KEY_BINDINGS}
						onContentChange={handleTextareaChange}
					/>
					<StatusBar />
				</box>
			</box>
		</box>
	);
};
