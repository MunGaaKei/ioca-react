import classNames from "classnames";
import { IInputContainer } from "./type";

export default function InputContainer(props: IInputContainer) {
	const {
		as: As = "label",
		label,
		className,
		labelInline,
		style,
		children,
		status,
		tip,
		required,
	} = props;

	return (
		<As
			className={classNames("i-input-label", className, {
				"i-input-inline": labelInline,
			})}
			style={style}
		>
			{label && (
				<span className='i-input-label-text'>
					{required && <span className='error'>*</span>}
					{label}
				</span>
			)}

			{children}

			{tip && (
				<span
					className={classNames("i-input-message", {
						[`i-input-${status}`]: status !== "normal",
					})}
				>
					{tip}
				</span>
			)}
		</As>
	);
}
