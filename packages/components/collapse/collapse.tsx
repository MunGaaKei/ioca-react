import { MinusRound, PlusRound } from "@ricons/material";
import classNames from "classnames";
import { Children, useMemo, useState } from "react";
import Helpericon from "../utils/helpericon";
import "./index.css";
import Item from "./item";
import { ICollapse, ICollapseItem, TKey } from "./type";

const Collapse = (props: ICollapse) => {
	const {
		active,
		items,
		multiple,
		border,
		headerClickable,
		className,
		children,
		renderToggle = (active: boolean) =>
			active ? <MinusRound /> : <PlusRound />,
		onCollapse,
		...restProps
	} = props;

	const [activeKey, setActiveKey] = useState(active);

	const collapses = useMemo(() => {
		if (!items) {
			if (!children) return [];

			return (
				Children.map(children, (node, i) => {
					const { key, props: nodeProps } = node as {
						key?: TKey;
						props?: any;
					};
					const { title, children, content, disabled, ...restProps } =
						nodeProps;

					return {
						...restProps,
						key: key || i,
						title,
						content: children || content,
						disabled,
					};
				}) || []
			);
		}

		return items;
	}, [children]);

	const handleHeaderClick = (item: ICollapseItem) => {
		if (!headerClickable) return;

		handleToggle(item);
	};

	const handleToggle = (item: ICollapseItem, e?) => {
		const { key, disabled } = item;
		e?.stopPropagation();
		if (disabled) return;

		if (!multiple) {
			const nextActive = activeKey === key ? undefined : key;
			setActiveKey(nextActive);
			onCollapse?.(key as TKey, nextActive !== undefined);
			return;
		}

		const group = Array.isArray(activeKey) ? [...activeKey] : [];

		const i = group.findIndex((k) => k === key);

		if (i > -1) {
			group.splice(i, 1);
		} else {
			key !== undefined && group.push(key);
		}
		setActiveKey(group as any);
		onCollapse?.(key as TKey, i < 0);
	};

	return (
		<div
			className={classNames(
				"i-collapse",
				{
					"i-collapse-bordered": border,
				},
				className
			)}
			{...restProps}
		>
			{collapses.map((item) => {
				const {
					key,
					title,
					content,
					disabled,
					className,
					...restProps
				} = item;
				const isActive = multiple
					? ((activeKey as TKey[]) || []).includes(key)
					: activeKey === key;

				return (
					<div
						key={key}
						className={classNames("i-collapse-item", className, {
							"i-collapse-active": isActive,
							"i-collapse-disabled": disabled,
						})}
						{...restProps}
					>
						<div
							className='i-collapse-header'
							onClick={() => handleHeaderClick(item)}
						>
							{title}

							<Helpericon
								active
								className='i-collapse-toggle'
								icon={renderToggle(isActive)}
								onClick={(e) => handleToggle(item, e)}
							/>
						</div>

						<div className='i-collapse-content'>{content}</div>
					</div>
				);
			})}
		</div>
	);
};

Collapse.Item = Item;

export default Collapse;
