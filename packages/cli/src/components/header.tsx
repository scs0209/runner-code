export const Header = () => {
	return (
		<box alignItems="center" justifyContent="center">
			<box
				flexDirection="row"
				justifyContent="center"
				alignItems="flex-end"
				gap={0.5}
			>
				<ascii-font font="tiny" text="Runner" color="blue" />
				<ascii-font font="tiny" text="Code" />
			</box>
		</box>
	);
};
