import classNames from "classnames";
import { useMemo } from "react";
import "./index.css";
import { IFlex } from "./type";

const Flex: React.FC<IFlex> = (props: IFlex) => {
	const {
		as: Component = "div" as any,
		align,
		justify,
		direction,
		wrap,
		gap,
		columns,
		className,
		style,
		...restProps
	} = props;

	const gridColumns = useMemo(() => {
		if (!columns) return;

		if (typeof columns === "number") return `repeat(${columns}, 1fr)`;

		return columns;
	}, [columns]);

	return (
		<Component
			{...restProps}
			style={{
				alignItems: align,
				justifyContent: justify,
				gap,
				flexDirection: direction,
				flexWrap: wrap === true ? "wrap" : wrap,
				gridTemplateColumns: gridColumns as any,
				...style,
			}}
			className={classNames(className, {
				[columns ? "grid" : "flex"]: true,
			})}
		/>
	);
};

export default Flex;
