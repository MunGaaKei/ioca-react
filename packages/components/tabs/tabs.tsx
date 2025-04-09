import { MoreHorizRound } from "@ricons/material";
import { useReactive, useSize } from "ahooks";
import classNames from "classnames";
import { pick } from "radash";
import {
	CSSProperties,
	Children,
	useEffect,
	useImperativeHandle,
	useRef,
} from "react";
import { useIntersectionObserver } from "../../js/hooks";
import Button from "../button";
import Icon from "../icon";
import Popup from "../popup";
import Helpericon from "../utils/helpericon";
import "./index.css";
import TabItem from "./item";
import { CompositionTabs, ITabItem, ITabs } from "./type";

type TState = {
	active?: string;
	prevActive?: string;
	barStyle: CSSProperties;
	cachedTabs: string[];
	overflow: boolean;
	more: ITabItem[];
	tabs: ITabItem[];
};

const Tabs = ((props: ITabs) => {
	const {
		ref,
		active,
		tabs: items,
		type = "default",
		prepend,
		append,
		children,
		className,
		vertical,
		toggable,
		navsJustify = "start",
		bar = true,
		hideMore,
		barClass,
		renderMore = () => (
			<Button flat square size='small'>
				<Icon icon={<MoreHorizRound />} />
			</Button>
		),
		onTabChange,
		...rest
	} = props;

	const navRefs = useRef<HTMLElement[]>([]);
	const barRef = useRef<HTMLSpanElement>(null);
	const navsRef = useRef<HTMLDivElement>(null);
	const state = useReactive<TState>({
		active,
		prevActive: undefined,
		barStyle: {},
		cachedTabs: [],
		overflow: false,
		more: [],
		tabs: [],
	});
	const { observe, unobserve } = useIntersectionObserver();
	const size = useSize(navsRef);

	useEffect(() => {
		if (!items) {
			if (!children) {
				state.tabs = [];
				return;
			}

			state.tabs = Children.map(children, (node, i) => {
				const { key, props: nodeProps } = node as {
					key?: string;
					props?: any;
				};
				const { title, children, content, keepDOM } = nodeProps;

				const cloned = children
					? typeof children === "string"
						? children
						: pick(children, ["props", "type", "$$typeof", "ref"])
					: content;

				return {
					key: key || String(i),
					title,
					content: cloned,
					keepDOM,
				};
			}) as ITabItem[];

			return;
		}

		state.tabs = items.map((item, i) => {
			if (["string", "number"].includes(typeof item)) {
				return { key: item, title: item };
			}
			if (item.key === undefined) {
				item.key = i;
			}
			return item;
		});
	}, [children, items]);

	const add = (tab: ITabItem) => {
		const { key } = tab;
		const i = state.tabs.findIndex((t) => t.key === key);

		if (i > -1) {
			open(state.tabs[i].key ?? `${i}`);
			return;
		}

		const l = state.tabs.length;
		const tkey = tab.key ?? `${l}`;
		state.tabs.push({ ...tab, key: tkey });
		open(tkey);
	};

	const close = (key: string) => {
		const i = state.tabs.findIndex((t) => t.key === key);

		if (i < 0) return;

		state.tabs.splice(i, 1);

		if (state.active !== key) return;

		const next = state.tabs[i] || state.tabs[i - 1];
		open(state.prevActive ?? next?.key ?? "");
	};

	const open = (key: string) => {
		if (key === state.active) {
			if (!toggable) return;

			onTabChange?.(undefined, key);
			state.active = undefined;

			state.barStyle = {
				height: 0,
				width: 0,
			};
			return;
		}

		state.prevActive = state.active;
		onTabChange?.(key, state.active);
		state.active = key;
	};

	useEffect(() => {
		if (!size || hideMore || !observe) return;
		const { scrollHeight, scrollWidth } = navsRef.current as HTMLElement;
		const { width, height } = size;

		state.overflow = scrollHeight > height || scrollWidth > width;

		if (!state.overflow) return;

		navRefs.current.map((nav, i) => {
			if (!nav) return;
			observe(nav, (tar: HTMLElement, visible: boolean) => {
				if (!state.tabs[i]) return;
				state.tabs[i].intersecting = visible;
				state.more = state.tabs.filter((tab) => !tab.intersecting);
			});
		});
	}, [size, hideMore, state.tabs.length]);

	useEffect(() => {
		if (!bar || type === "pane" || state.active === undefined) {
			return;
		}

		const index = state.tabs.findIndex((tab) => tab.key === state.active);

		setTimeout(() => {
			const nav = navRefs.current[index];

			if (!nav) return;

			if (state.tabs[index].keepDOM && state.active) {
				const i = state.cachedTabs.findIndex((k) => k === state.active);
				i < 0 && state.cachedTabs.unshift(state.active);
			}

			const { offsetHeight, offsetLeft, offsetTop, offsetWidth } = nav;
			const isLine = type === "line";

			state.barStyle = {
				height: !vertical && isLine ? ".25em" : offsetHeight,
				width: vertical && isLine ? ".25em" : offsetWidth,
				transform: `translate(${offsetLeft}px, ${offsetTop}px)`,
			};
		}, 16);
	}, [state.active, bar, size]);

	useEffect(() => {
		if (active === undefined || state.active === active) return;

		open(active);
	}, [active]);

	useEffect(() => {
		if (hideMore || !unobserve) return;

		return () => {
			navRefs.current?.map(unobserve);
		};
	}, [state.tabs.length]);

	useEffect(() => {
		if (!navsRef.current || vertical) return;

		const handleMouseWheel = (e) => {
			e.stopPropagation();
			e.preventDefault();

			if (vertical) return;

			navsRef.current?.scrollBy({
				left: e.deltaY + e.deltaX,
			});
		};

		navsRef.current.addEventListener("wheel", handleMouseWheel, {
			passive: false,
		});

		return () => {
			if (!navsRef.current) return;
			navsRef.current.removeEventListener("wheel", handleMouseWheel);
		};
	}, [navsRef.current]);

	useImperativeHandle(ref, () => ({
		open,
		close,
		add,
		navs: navsRef,
	}));

	return (
		<div
			className={classNames(
				"i-tabs",
				{ flex: vertical, [`i-tabs-${type}`]: type !== "default" },
				className
			)}
			{...rest}
		>
			<div
				className={classNames("i-tab-navs-container", {
					"i-tab-navs-vertical": vertical,
				})}
			>
				{prepend}

				<div
					ref={navsRef}
					className={classNames(
						"i-tab-navs",
						`justify-${navsJustify}`
					)}
				>
					{state.tabs.map((tab, i) => {
						const { title, key = `${i}`, closable } = tab;

						return (
							<a
								key={key}
								ref={(ref) => (navRefs.current[i] = ref as any)}
								className={classNames("i-tab-nav", {
									"i-tab-active": state.active === key,
								})}
								onClick={() => open(key)}
							>
								{title}

								{closable && (
									<Helpericon
										as='i'
										active
										className='i-tab-nav-close'
										onClick={(e) => {
											e.stopPropagation();
											close(key);
										}}
									/>
								)}
							</a>
						);
					})}

					{bar && (
						<span
							ref={barRef}
							className={classNames("i-tab-navs-bar", barClass)}
							style={state.barStyle}
						/>
					)}
				</div>

				{!hideMore && state.overflow && state.more.length > 0 && (
					<Popup
						arrow={false}
						position={vertical ? "right" : "bottom"}
						align='end'
						touchable
						hideDelay={500}
						content={
							<div className='i-tabs-morelist pd-4'>
								{state.more.map((tab, i) => {
									const { key = `${i}`, title } = tab;
									const isActive = state.active === key;

									return (
										<a
											key={key}
											className={classNames("i-tab-nav", {
												"i-tab-active": isActive,
											})}
											onClick={() => open(key)}
										>
											{title}
										</a>
									);
								})}
							</div>
						}
					>
						{renderMore(state.more)}
					</Popup>
				)}

				{append}
			</div>

			<div className='i-tab-contents'>
				{state.tabs.map((tab, i) => {
					const { key = `${i}`, content } = tab;
					const isActive = state.active === key;
					const show =
						isActive ||
						(key !== undefined && state.cachedTabs.includes(key));

					return (
						show && (
							<div
								key={key}
								className={classNames("i-tab-content", {
									"i-tab-active": isActive,
								})}
							>
								{content}
							</div>
						)
					);
				})}
			</div>
		</div>
	);
}) as CompositionTabs;

Tabs.Item = TabItem;

export default Tabs;
