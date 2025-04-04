import classNames from "classnames";
import Helpericon from "../utils/helpericon";
import "./index.css";
import { ITag } from "./type";

const Tag = (props: ITag) => {
	const {
		dot,
		dotClass,
		outline,
		round,
		size = "normal",
		hoverShowClose,
		className,
		children,
		onClose,
		onClick,
		...restProps
	} = props;

	return (
		<span
			className={classNames(
				"i-tag",
				{
					"i-tag-outline": outline,
					"i-tag-clickable": onClick,
					[`i-tag-${size}`]: size !== "normal",
					round,
				},
				className
			)}
			onClick={onClick}
			{...restProps}
		>
			{dot && <span className={classNames("i-tag-dot", dotClass)}></span>}

			{children}

			{onClose && (
				<Helpericon
					active
					className={classNames("i-tag-close", {
						"i-tag-hover-close": hoverShowClose,
					})}
					onClick={onClose}
				/>
			)}
		</span>
	);
};

export default Tag;
