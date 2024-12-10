import { InboxTwotone } from "@ricons/material";
import classNames from "classnames";
import "./index.css";

export default function Empty(props) {
	const { className, ...restProps } = props;

	return (
		<InboxTwotone
			className={classNames("i-empty", className)}
			{...restProps}
		/>
	);
}
