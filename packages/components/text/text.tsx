import classNames from "classnames";
import { useMemo } from "react";
import "./index.css";
import { CompositionText, IText } from "./type";

const Text = (props: IText) => {
	const {
		as: Tag = "span",
		size,
		weight,
		decoration,
		gradient,
		style,
		className,
		children,
	} = props;

	const gradients = useMemo(() => {
		if (!gradient || !Array.isArray(gradient)) return {};

		return {
			background: `-webkit-linear-gradient(${gradient.join(",")})`,
			backgroundClip: "text",
		};
	}, [gradient]);

	return (
		<Tag
			style={{
				fontSize: size,
				fontWeight: weight,
				textDecoration: decoration,
				...gradients,
				...style,
			}}
			className={classNames(className, {
				"i-text-gradient": gradient,
			})}
		>
			{children}
		</Tag>
	);
};

export default Text as CompositionText;
