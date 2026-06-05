import { useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import "./index.css";
import { TreeList } from "./item";
import { ITree, ITreeItem, FlatNode } from "./type";
import VirtualTree from "./virtual";

const defaultNodeProps = {
	key: "key",
	title: "title",
	children: "children",
};

function flattenTree(
	nodes: ITreeItem[],
	expandedMap: Record<string, boolean>,
	nodeProps: { key: string; title: string; children: string },
	depth = 0,
	parentItem?: ITreeItem,
): FlatNode[] {
	const result: FlatNode[] = [];
	nodes.forEach((item, i) => {
		const mapKey = item[nodeProps.key];
		item.key = mapKey || `${parentItem?.key ?? ""}-${i}`;
		item.parent = parentItem;
		const isExpanded = !!expandedMap[item.key];
		result.push({ node: item, depth, isExpanded });
		const children = item[nodeProps.children];
		if (children?.length) {
			const childNodes = flattenTree(children, expandedMap, nodeProps, depth + 1, item);
			if (isExpanded) result.push(...childNodes);
		}
	});
	return result;
}

const Tree = (props: ITree) => {
	const {
		data = [],
		ref,
		selected,
		checked = [],
		disabledRelated,
		nodeProps,
		height,
		useVirtual,
		onItemSelect,
		onItemCheck,
		...restProps
	} = props;
	const [selectedKey, setSelectedKey] = useState(selected);
	const [checkedKeys, setCheckedKeys] = useState(checked);
	const [partofs, setPartofs] = useState<Record<string, boolean>>({});
	const nodeMapsRef = useRef<Map<any, any>>(new Map());
	const oNodeProps = useMemo(
		() => ({ ...defaultNodeProps, ...nodeProps }),
		[nodeProps],
	);

	const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>(
		() => {
			const map: Record<string, boolean> = {};
			const walk = (nodes: ITreeItem[]) => {
				nodes.forEach((item) => {
					const mapKey = item[oNodeProps.key] as string | undefined;
					if (item.expanded && mapKey) map[mapKey] = true;
					const children = item[oNodeProps.children];
					if (children?.length) walk(children);
				});
			};
			walk(data);
			return map;
		},
	);

	const handleExpand = (key: string) => {
		setExpandedMap((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const flatNodes = useMemo(
		() => flattenTree(data, expandedMap, oNodeProps),
		[data, expandedMap, oNodeProps],
	);

	const isChecked = (key?: string) => checkedKeys.includes(key || "");

	const checkItem = (
		item: ITreeItem,
		checked: boolean,
		direction?: "root" | "leaf",
	) => {
		const { key = "", parent, children } = item;
		const shouldChanged = { [key]: checked };
		const partofs = { [key]: false };

		if (disabledRelated) return [shouldChanged];

		if (checked) {
			if (parent && direction !== "leaf") {
				const hasUnchecked = parent.children?.some(
					(o) => o.key !== key && !isChecked(o.key),
				);

				const [changes, parts] = checkItem(parent, true, "root");

				if (!hasUnchecked) {
					Object.assign(shouldChanged, changes);
				}

				Object.assign(partofs, hasUnchecked ? parts : {}, {
					[parent.key as string]: true,
				});
			}

			if (children?.length && direction !== "root") {
				children.map((o) => {
					if (isChecked(o.key)) return;

					const [changes] = checkItem(o, true, "leaf");

					Object.assign(shouldChanged, changes);
					partofs[o.key as string] = false;
				});
			}

			return [shouldChanged, partofs];
		}

		if (parent && direction !== "leaf") {
			const [changes, parts] = checkItem(parent, false, "root");

			Object.assign(shouldChanged, changes);

			const hasChecked = parent.children?.some(
				(o) => isChecked(o.key) && o.key !== key,
			);

			Object.assign(partofs, hasChecked ? {} : parts, {
				[parent.key as string]: hasChecked,
				[key]: false,
			});
		}
		if (children?.length && direction !== "root") {
			children.map((o) => {
				const [changes] = checkItem(o, false, "leaf");

				if (!isChecked(o.key)) return;

				Object.assign(shouldChanged, changes);
				partofs[o.key as string] = false;
			});
		}

		return [shouldChanged, partofs];
	};

	const handleCheck = (item: ITreeItem, checked: boolean) => {
		const [shouldChanged, partofs] = checkItem(item, checked);
		const changedKeys = Object.keys(shouldChanged);

		const nextChecked = checked
			? Array.from(new Set([...checkedKeys, ...changedKeys]))
			: checkedKeys.filter((k) => !changedKeys.includes(k));

		setCheckedKeys(nextChecked);
		setPartofs((p) => ({ ...p, ...partofs }));
		onItemCheck?.(item, checked, nextChecked);
	};

	const handleSelect = (key: string, item: ITreeItem) => {
		if (!props.selectable) return;

		setSelectedKey(key);
		onItemSelect?.(key, item);
	};

	useEffect(() => {
		if (selected === undefined) return;

		setSelectedKey(selected);
	}, [selected]);

	useEffect(() => {
		nodeMapsRef.current.clear();

		const { key, children } = oNodeProps;
		const recursive = (nodes: any[]) => {
			nodes.map((o) => {
				nodeMapsRef.current.set(o[key], o);

				o[children]?.length > 0 && recursive(o[children]);
			});
		};

		recursive(data);
	}, [data, oNodeProps]);

	useImperativeHandle(ref, () => {
		return {
			getChecked: () => {
				const items: ITreeItem[] = [];
				checkedKeys.map((k) => {
					const item = nodeMapsRef.current.get(k);
					items.push(item);
				});
				return [checkedKeys, items];
			},
			getSelected: () => {
				const item = nodeMapsRef.current.get(selectedKey);
				return [selectedKey, item];
			},
			getPartofs: () => {
				const items: ITreeItem[] = [];
				const keys = Object.keys(partofs).filter((k) => {
					const indeterminate = partofs[k];

					if (indeterminate) {
						const item = nodeMapsRef.current.get(k);
						items.push(item);
					}

					return indeterminate;
				});

				return [keys, items];
			},
		};
	});

	if (useVirtual) {
		return (
			<VirtualTree
				flatNodes={flatNodes}
				onExpand={handleExpand}
				height={height}
				useVirtual={useVirtual}
				selected={selectedKey}
				checked={checkedKeys}
				partofs={partofs}
				nodeProps={oNodeProps}
				onItemCheck={handleCheck}
				onItemSelect={handleSelect}
				{...restProps}
			/>
		);
	}

	return (
		<TreeList
			flatNodes={flatNodes}
			onExpand={handleExpand}
			selected={selectedKey}
			checked={checkedKeys}
			partofs={partofs}
			nodeProps={oNodeProps}
			onItemCheck={handleCheck}
			onItemSelect={handleSelect}
			{...restProps}
		/>
	);
};

export default Tree;
