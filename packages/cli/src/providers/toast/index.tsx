import { useTerminalDimensions } from "@opentui/react";
import {
	createContext,
	useCallback,
	useContext,
	useRef,
	useState,
} from "react";
import {
	DEFAULT_DURATION,
	type ToastOptions,
	type ToastVariant,
} from "./types";

export type ToastContextValue = {
	show: (options: ToastOptions) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};

type ToastProviderProps = {
	children: React.ReactNode;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
	const [toast, setToast] = useState<ToastOptions | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const clearCurrentTimeout = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	const show = useCallback(
		(options: ToastOptions) => {
			const duration = options.duration ?? DEFAULT_DURATION;
			clearCurrentTimeout();

			setToast({
				variant: options.variant ?? "info",
				...options,
				duration,
			});
			timeoutRef.current = setTimeout(() => {
				setToast(null);
			}, duration).unref();
		},
		[clearCurrentTimeout],
	);

	const value: ToastContextValue = {
		show,
	};

	return (
		<ToastContext.Provider value={value}>
			{children}
			<Toast toast={toast} />
		</ToastContext.Provider>
	);
};

type ToastProps = {
	toast: ToastOptions | null;
};

export const Toast = ({ toast }: ToastProps) => {
	const { width } = useTerminalDimensions();

	if (!toast) return null;

	const variantColors: Record<ToastVariant, string> = {
		success: "#82E0AA",
		error: "#E74C5E",
		info: "#56D6C2",
	};

	const borderColor = toast.variant
		? variantColors[toast.variant]
		: variantColors.info;

	return (
		<box
			position="absolute"
			justifyContent="center"
			alignItems="flex-start"
			top={2}
			right={2}
			backgroundColor={"#1A1A24"}
			borderColor={borderColor}
			paddingLeft={2}
			paddingRight={2}
			paddingTop={1}
			paddingBottom={1}
			border={["left", "right"]}
			width={Math.max(1, Math.min(60, width - 6))}
			// TODO: split border 추가
		>
			<box flexDirection="column" gap={1} width="100%">
				<text fg="#E1E1E1" wrapMode="word" width="100%">
					{toast?.message}
				</text>
			</box>
		</box>
	);
};
