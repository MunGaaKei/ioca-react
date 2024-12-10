import classNames from "classnames";
import { IButtonGroup } from "./type";

export default function Group(props: IButtonGroup) {
	const { children, vertical, className, style } = props;

	return (
		<div
			className={classNames(
				className,
				vertical ? "i-btn-group-vertical" : "i-btn-group-horizonal"
			)}
			style={style}
		>
			{children}
		</div>
	);
}
