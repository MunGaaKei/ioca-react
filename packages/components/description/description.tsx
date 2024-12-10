import classNames from "classnames";
import { CSSProperties, Fragment } from "react";
import "./index.css";
import { IDescription } from "./type";

const Description = (props: IDescription): JSX.Element => {
	const {
		data,
		colon,
		columns = 1,
		gap = ".5em",
		align,
		labelWidth,
		labelAlign,
		vertical,
		equally,
		style,
		className,
	} = props;

	return (
		<div
			className={classNames("i-description", className)}
			style={
				{
					["--description-label-width"]: labelWidth,
					gridTemplateColumns: `repeat(${columns}, ${
						equally ? "1fr" : "auto"
					})`,
					gap,
					textAlign: align,
					...style,
				} as CSSProperties
			}
		>
			{data.map((item, i) => {
				const {
					label,
					value,
					style,
					hidden,
					rowSpan = 1,
					colSpan = 1,
				} = item;

				if (hidden) return <Fragment key={i} />;

				return (
					<div
						key={i}
						className={classNames("i-description-item", {
							"i-description-item-vertical": vertical,
						})}
						style={{
							gridColumn: `span ${colSpan}`,
							gridRow: `span ${rowSpan}`,
							...style,
						}}
					>
						{label && (
							<div
								className='i-description-label'
								style={{ textAlign: labelAlign }}
							>
								{label}
								{colon}
							</div>
						)}
						<div className='i-description-value'>{value}</div>
					</div>
				);
			})}
		</div>
	);
};

export default Description;
