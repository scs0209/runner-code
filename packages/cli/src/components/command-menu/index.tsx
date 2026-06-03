import { type ScrollBoxRenderable, TextAttributes } from "@opentui/core";
import type { BoxProps } from "@opentui/react";
import type { RefObject } from "react";
import { COMMANDS } from "./commands";
import { getFilteredCommands } from "./filter-commands";

const MAX_VISIBLE_ITEMS = 8;

// 주석 한국어로 변경
// 모든 명령어 이름을 고정된 너비의 열로 정렬하여 설명이 동일한 수평 위치에서 시작하도록 합니다.
// 가장 긴 명령어 이름을 수용하도록 너비가 조정되어 테이블 형태로 보기 좋게 정렬됩니다.
const COMMAND_COL_WIDTH =
	Math.max(...COMMANDS.map((cmd) => cmd.name.length)) + 4;

type CommandMenuProps = {
	query: string;
	selectedIndex: number;
	scrollRef: RefObject<ScrollBoxRenderable | null>;
	onSelect: (index: number) => void;
	onExecute: (index: number) => void;
};

export function CommandMenu({
	query,
	selectedIndex,
	scrollRef,
	onSelect,
	onExecute,
}: CommandMenuProps) {
	const filtered = getFilteredCommands(query);
	const visibleHeight = Math.min(filtered.length, MAX_VISIBLE_ITEMS);

	if (filtered.length === 0) {
		return (
			<box paddingX={1}>
				<text attributes={TextAttributes.DIM}>No matching commands</text>
			</box>
		);
	}

	return (
		<scrollbox ref={scrollRef} height={visibleHeight}>
			{filtered.map((cmd, i) => {
				const isSelected = i === selectedIndex;
				const itemProps = {
					role: "menuitem",
					flexDirection: "row",
					paddingX: 1,
					height: 1,
					overflow: "hidden",
					backgroundColor: isSelected ? "#89B4FA" : undefined,
					onMouseMove: () => onSelect(i),
					onMouseDown: () => onExecute(i),
				} as BoxProps;

				return (
					<box key={cmd.value} {...itemProps}>
						<box width={COMMAND_COL_WIDTH} flexShrink={0}>
							<text selectable={false} fg={isSelected ? "black" : "white"}>
								/{cmd.name}
							</text>
						</box>
						<box flexGrow={1} flexShrink={1} overflow="hidden">
							<text selectable={false} fg={isSelected ? "black" : "gray"}>
								{cmd.description}
							</text>
						</box>
					</box>
				);
			})}
		</scrollbox>
	);
}
