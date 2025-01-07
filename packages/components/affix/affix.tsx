import classNames from "classnames";
import { debounce } from "radash";
import {
	Children,
	MouseEvent,
	cloneElement,
	useEffect,
	useMemo,
	useState,
} from "react";
import "./index.css";
import ToTop from "./totop";
import { IAffix } from "./type";

const Affix = (props: IAffix) => {
	const {
		position = "fixed",
		left,
		top,
		right,
		bottom,
		offset,
		style,
		className,
		children,
		getContainer = () => document.body,
	} = props;

	const [hidden, setHidden] = useState<boolean>(false);

	const hijackChildren = useMemo(() => {
		return Children.map(children, (node: any) => {
			if (node.type === ToTop) {
				const { onClick } = node.props;

				return cloneElement(node, {
					key: node.key,
					...node.props,
					onClick: (e: MouseEvent) => {
						const container = getContainer();

						onClick?.(e);
						container?.scrollTo({
							top: 0,
							left: 0,
							behavior: "smooth",
						});
					},
				});
			}

			return node;
		});
	}, [children, getContainer]);

	useEffect(() => {
		const container = getContainer();
		if (!offset || !container) return;

		const listener = debounce({ delay: 160 }, () => {
			const top = container.scrollTop;

			setHidden(top < offset);
		});

		listener();
		container.addEventListener("scroll", listener);

		return () => {
			container.removeEventListener("scroll", listener);
		};
	}, [offset, getContainer]);

	return (
		<div
			className={classNames("i-affix", className, {
				"i-affix-hidden": hidden,
			})}
			style={{
				...style,
				position,
				left,
				top,
				right,
				bottom,
			}}
		>
			{hijackChildren}
		</div>
	);
};

Affix.ToTop = ToTop;

export default Affix;
