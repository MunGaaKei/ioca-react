import classNames from "classnames";
import { uid } from "radash";
import { ReactNode, isValidElement, useEffect, useRef } from "react";
import { useReactive } from "../../js/hooks";
import "./index.css";
import type {
	IMessage,
	IMessageConfig,
	IMessageContainerProps,
	IMessageItem,
	THeights,
	TMessageQueue,
} from "./type";

const AlignMap = {
	left: "flex-start",
	center: "center",
	right: "flex-end",
};

const ContainerConfig = {
	align: "center",
	fromBottom: false,
	unshift: false,
	gap: 12,
	offset: "12px",
	duration: 3000,
};

const handler: {
	oneInstance: null | IMessage;
	callout: (item: IMessage) => void;
	close: () => void;
} = {
	oneInstance: null,
	callout(item: IMessage) {},
	close() {},
};

const queue: TMessageQueue = {
	left: [],
	center: [],
	right: [],
};
const heights: THeights = {
	left: [],
	center: [],
	right: [],
};

const MessageItem = function ({
	ref,
	active,
	content,
	top,
	bottom,
	className,
	style,
	onClick,
}: IMessageItem) {
	return (
		<div
			ref={ref}
			className={classNames("i-message", className, {
				"i-message-active": active,
			})}
			style={{
				...style,
				...(bottom !== undefined ? { bottom } : { top }),
			}}
			onClick={onClick}
		>
			{content}
		</div>
	);
};

function Messages() {
	const ref = useRef<HTMLDivElement>(null);
	const state = useReactive<{
		tops: THeights;
		items: TMessageQueue;
	}>({
		items: {
			left: [],
			center: [],
			right: [],
		},
		tops: {
			left: [],
			center: [],
			right: [],
		},
	});

	useEffect(() => {
		Object.assign(handler, {
			callout: function (item: IMessage) {
				const { align = "center", unshift, onShow } = item;
				queue[align][unshift ? "unshift" : "push"](item);
				state.items[align] = [...queue[align]];
				item.close = this.close.bind(item);

				// Pre-fill 0-height placeholder so heights stays index-aligned with queue
				if (unshift) {
					heights[align].unshift(0);
				} else {
					heights[align].push(0);
				}
				state.tops[align] = [...heights[align]];

				requestAnimationFrame(() => {
					const h = ref.current?.offsetHeight || 0;
					const idx = queue[align].findIndex((i) => i.id === item.id);
					if (idx < 0) return;

					queue[align][idx].active = true;
					state.items[align] = [...queue[align]];
					heights[align][idx] = h;
					state.tops[align] = [...heights[align]];
					onShow?.();
				});

				if (item.duration !== 0) {
					item.timer = setTimeout(() => {
						this.close.call(item);
					}, item.duration);
				}
			},
			close: function () {
				const item = this as unknown as IMessage;
				const { align = "center", onHide } = item;
				const index = queue[align].findIndex((i) => i.id === item.id);
				if (index < 0) return;

				queue[align][index].active = false;
				state.items[align] = [...queue[align]];

				item.timer = setTimeout(() => {
					const index = queue[align].findIndex(
						(i) => i.id === item.id,
					);

					queue[align].splice(index, 1);
					heights[align].splice(index, 1);
					state.tops[align] = [...heights[align]];
					state.items[align] = [...queue[align]];
					item.timer && clearTimeout(item.timer);
					onHide?.();
				}, 240);
			},
		});
	}, []);

	const renderGroup = (align: string) => {
		const items = state.items[align];
		const tops = state.tops[align];
		const gap = ContainerConfig.gap;

		if (ContainerConfig.fromBottom) {
			// bottom-up: calculate bottom-edge positions
			let offset = 0;
			const bottoms: number[] = [];
			for (let i = items.length - 1; i >= 0; i--) {
				bottoms[i] = offset;
				offset += (tops[i] || 0) + gap;
			}

			return items.map((item: IMessage, i: number) => {
				if (!item) return <></>;

				const { id, active, content, className, style: itemStyle } =
					item;

				return (
					<MessageItem
						key={id}
						ref={ref}
						active={active}
						content={content}
						bottom={bottoms[i]}
						className={className}
						style={{
							...itemStyle,
							alignSelf: AlignMap[align],
						}}
						onClick={handler.close.bind(item)}
					/>
				);
			});
		}

		// top-down (default)
		let offset = 0;
		return items.map((item: IMessage, i: number) => {
			if (!item) return <></>;

			const { id, active, content, className, style: itemStyle } = item;
			const top = offset;

			offset += (tops[i] || 0) + gap;

			return (
				<MessageItem
					key={id}
					ref={ref}
					active={active}
					content={content}
					top={top}
					className={className}
					style={{
						...itemStyle,
						alignSelf: AlignMap[align],
					}}
					onClick={handler.close.bind(item)}
				/>
			);
		});
	};

	return (
		<div
			className="i-messages"
			style={{
				margin: ContainerConfig.offset,
			}}
		>
			{renderGroup("left")}
			{renderGroup("center")}
			{renderGroup("right")}
		</div>
	);
}

function message(config: IMessageConfig | ReactNode) {
	if (typeof config !== "object" || isValidElement(config as ReactNode)) {
		config = { content: config as ReactNode };
	}

	const msg: IMessage = {
		id: uid(7),
		active: false,
		align: ContainerConfig.align,
		duration: ContainerConfig.duration,
		closable: true,
		unshift: ContainerConfig.unshift,
		...(config as IMessageConfig),
	};

	handler.callout(msg);

	return {
		instance: msg,
		close: handler.close.bind(msg),
	};
}

message.error = (content: ReactNode) => {
	return message({
		content,
		className: "bg-error",
	});
};

message.success = (content: ReactNode) => {
	return message({
		content,
		className: "bg-success",
	});
};

message.warning = (content: ReactNode) => {
	return message({
		content,
		className: "bg-warning",
	});
};

message.info = (content: ReactNode) => {
	return message({
		content,
		className: "bg-blue",
	});
};

message.one = (config: IMessageConfig) => {
	const o = handler.oneInstance;

	if (o) {
		if (o.active && o.duration !== 0) {
			clearTimeout(o.timer);
			o.timer = setTimeout(() => {
				o.close?.();
			}, o.duration);
		} else {
			handler.callout(o);
		}
	} else {
		const { instance } = message(config);
		handler.oneInstance = instance;
	}
};

function MessageContainer({
	align = "center",
	fromBottom = false,
	unshift = false,
	gap = 12,
	offset = "12px",
	duration = 3000,
}: IMessageContainerProps) {
	ContainerConfig.align = align;
	ContainerConfig.fromBottom = fromBottom;
	ContainerConfig.unshift = unshift;
	ContainerConfig.gap = gap;
	ContainerConfig.offset = offset;
	ContainerConfig.duration = duration;

	return null;
}

// 默认 Portal 到 document.body（仅在客户端执行，避免 SSR 问题）
if (typeof document !== "undefined") {
	import("react-dom/client").then(({ createRoot }) => {
		const container = document.createElement("div");
		container.dataset.id = "messages";
		document.body.append(container);
		createRoot(container).render(<Messages />);
	});
}

export { MessageContainer };
export default message;
