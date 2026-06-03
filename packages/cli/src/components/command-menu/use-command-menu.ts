import type { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { type RefObject, useMemo, useRef, useState } from "react";
import { getFilteredCommands } from "./filter-commands";
import type { Command } from "./types";

type UseCommandMenuReturn = {
	showCommandMenu: boolean;
	commandQuery: string;
	selectedIndex: number;
	scrollRef: RefObject<ScrollBoxRenderable | null>;
	handleContentChange: (text: string) => void;
	resolveCommand: (index: number) => Command | undefined;
	setSelectedIndex: (index: number) => void;
};

/**
 * Manage state and keyboard interactions for a slash-command menu used with text input.
 *
 * Tracks the current input value, whether the menu is visible, the highlighted command index,
 * and a scroll container ref; provides handlers to update input, resolve a selected command,
 * and synchronize scrolling when navigating with the keyboard.
 *
 * @returns An object containing:
 * - `showCommandMenu`: whether the command menu is visible
 * - `commandQuery`: the input text after a leading `/` when the menu is open, otherwise `""`
 * - `selectedIndex`: the currently highlighted command index
 * - `scrollRef`: a ref to the scrollable container used to keep the highlighted item in view
 * - `handleContentChange`: a function to update the input and toggle the menu based on the `/` prefix
 * - `resolveCommand`: a function that returns the command at a given index (and closes the menu if found)
 * - `setSelectedIndex`: setter to update the highlighted index
 */
export function useCommandMenu(): UseCommandMenuReturn {
	const [textValue, setTextValue] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [showCommandMenu, setShowCommandMenu] = useState(false);
	const scrollRef = useRef<ScrollBoxRenderable>(null);

	const commandQuery =
		showCommandMenu && textValue.startsWith("/") ? textValue.slice(1) : "";

	const filteredCommands = useMemo(
		() => getFilteredCommands(commandQuery),
		[commandQuery],
	);

	const close = () => {
		setShowCommandMenu(false);
	};

	const handleContentChange = (text: string) => {
		setTextValue(text);
		setSelectedIndex(0);

		// 사용자가 새 글자를 입력하면 목록 스크롤을 맨 위로 되돌린다
		const scrollbox = scrollRef.current;
		if (scrollbox) {
			scrollbox.scrollTo(0);
		}

		const prefix = text.startsWith("/") ? text.slice(1) : null;
		if (prefix !== null && !prefix.includes(" ")) {
			setShowCommandMenu(true);
		} else {
			close();
		}
	};

	// 특정 인덱스의 명령어를 찾는다 (실행은 호출자에서 처리)
	const resolveCommand = (index: number): Command | undefined => {
		const command = filteredCommands[index];
		if (command) {
			close();
		}
		return command;
	};

	// 화살표 키로 선택을 이동하고, 하이라이트가 화면을 벗어나면 목록도 함께 스크롤한다
	useKeyboard((key) => {
		if (!showCommandMenu) return;

		if (key.name === "escape") {
			key.preventDefault();
			close();
		} else if (key.name === "up") {
			key.preventDefault();
			setSelectedIndex((i: number) => {
				const newIndex = Math.max(0, i - 1);
				// 경계를 넘어 이동할 때도 하이라이트 항목이 보이도록 스크롤을 맞춘다
				const sb = scrollRef.current;
				if (sb && newIndex < sb.scrollTop) {
					sb.scrollTo(newIndex);
				}
				return newIndex;
			});
		} else if (key.name === "down") {
			key.preventDefault();
			setSelectedIndex((i: number) => {
				if (filteredCommands.length === 0) {
					return 0;
				}

				const newIndex = Math.min(filteredCommands.length - 1, i + 1);
				const sb = scrollRef.current;
				if (sb) {
					const viewportHeight = sb.viewport.height;
					const visibleEnd = sb.scrollTop + viewportHeight - 1;
					if (newIndex > visibleEnd) {
						sb.scrollTo(newIndex - viewportHeight + 1);
					}
				}
				return newIndex;
			});
		}
	});

	return {
		showCommandMenu,
		commandQuery,
		selectedIndex,
		scrollRef,
		handleContentChange,
		resolveCommand,
		setSelectedIndex,
	};
}
