import classNames from "classnames";
import "./index.css";
import type { IBadge } from "./type";

const Badge = (props: IBadge): JSX.Element => {
	const {
		content,
		contentClass,
		dot,
		dotSize,
		round,
		disabled,
		style,
		className,
		children,
	} = props;

	return (
		<div
			style={style}
			className={classNames("i-badge", { rounded: round }, className)}
		>
			{children}

			<div
				className={classNames("i-badge-content", contentClass, {
					"i-badge-dot": dot,
					"i-badge-hidden": disabled,
				})}
				style={{ fontSize: dotSize }}
			>
				{content}
			</div>
		</div>
	);
};

export default Badge;
