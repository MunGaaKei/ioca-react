import { useReactive } from "ahooks";
import classNames from "classnames";
import { uid } from "radash";
import {
	ReactNode,
	forwardRef,
	isValidElement,
	useEffect,
	useRef,
} from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import type { IMessage, IMessageItem, THeights, TMessageQueue } from "./type";

const AlignMap = {
	left: "flex-start",
	center: "center",
	right: "flex-end",
};

const GlobalConfig = {
	align: "center",
	offset: "12px",
	gap: 12,
	max: 0,
};

const ItemDefaultConfig = {
	duration: 3000,
	closable: true,
	active: false,
};

const container = createContainer();
const handler = {
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

createRoot(container).render(<Messages />);

const MessageItem = forwardRef<HTMLDivElement, IMessageItem>(function (
	{ active, content, top, className, style, onClick },
	ref
) {
	return (
		<div
			ref={ref}
			className={classNames("i-message", className, {
				"i-message-active": active,
			})}
			style={{
				...style,
				top,
			}}
			onClick={onClick}
		>
			{content}
		</div>
	);
});

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
	const offsetTop = {
		left: 0,
		center: 0,
		right: 0,
	};

	useEffect(() => {
		Object.assign(handler, {
			callout: function (item: IMessage) {
				const { align = "center", unshift, onShow } = item;
				const size = queue[align][unshift ? "unshift" : "push"](item);
				state.items[align] = [...queue[align]];

				setTimeout(() => {
					const h = ref.current?.offsetHeight || 0;

					queue[align][unshift ? 0 : size - 1].active = true;
					state.items[align] = [...queue[align]];
					heights[align][unshift ? "unshift" : "push"](h);
					state.tops[align] = [...heights[align]];
					onShow?.();
				}, 0);

				item.duration !== 0 &&
					setTimeout(this.close.bind(item), item.duration);
			},
			close: function () {
				const item = this as IMessage;
				const { align = "center", onHide } = item;
				const index = queue[align].findIndex((i) => i.id === item.id);
				if (index < 0) return;

				queue[align][index].active = false;
				state.items[align] = [...queue[align]];

				item.timer = setTimeout(() => {
					const index = queue[align].findIndex(
						(i) => i.id === item.id
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

	const renderItems = (item, i) => {
		if (!item) return <></>;

		const { id, active, content, align = "center", className } = item;
		offsetTop[align] += state.tops[align][i - 1] || 0;
		const top = GlobalConfig.gap * i + offsetTop[align];

		return (
			<MessageItem
				key={id}
				ref={ref}
				active={active}
				content={content}
				top={top}
				className={className}
				style={{ alignSelf: AlignMap[align] }}
				onClick={handler.close.bind(item)}
			/>
		);
	};

	return (
		<div className='i-messages'>
			{state.items.left.map(renderItems)}
			{state.items.center.map(renderItems)}
			{state.items.right.map(renderItems)}
		</div>
	);
}

export function setMessageConfig(config: IMessage) {
	Object.assign(GlobalConfig, config);
}

function message(config: IMessage | ReactNode) {
	if (
		["string", "number"].includes(typeof config) ||
		isValidElement(config)
	) {
		config = { content: config as ReactNode };
	}

	config = Object.assign(
		{ id: uid(7) },
		ItemDefaultConfig,
		config as IMessage
	);

	handler.callout(config as IMessage);

	return handler.close.bind(config);
}

function createContainer() {
	const container = document.createElement("div");
	container.dataset.id = "messages";
	document.body.append(container);

	return container;
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

export default message;
