import classNames from "classnames";
import "./index.css";
import { ICard } from "./type";

const Card = (props: ICard) => {
	const {
		hideShadow,
		border,
		className,
		children,
		header,
		footer,
		...restProps
	} = props;

	return (
		<div
			className={classNames("i-card", className, {
				shadow: !hideShadow,
				"i-card-bordered": border,
			})}
			{...restProps}
		>
			{header && <div className='i-card-header'>{header}</div>}

			{children && <div className='i-card-content'>{children}</div>}

			{footer && <div className='i-card-footer'>{footer}</div>}
		</div>
	);
};

export default Card;
