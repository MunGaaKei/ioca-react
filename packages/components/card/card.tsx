import classNames from "classnames";
import "./index.css";
import { ICard } from "./type";

const Card = (props: ICard) => {
	const { hideShadow, border, style, className, children, header, footer } =
		props;

	return (
		<div
			style={style}
			className={classNames("i-card", className, {
				shadow: !hideShadow,
				"i-card-bordered": border,
			})}
		>
			{header && <div className='i-card-header'>{header}</div>}

			{children && <div className='i-card-content'>{children}</div>}

			{footer && <div className='i-card-footer'>{footer}</div>}
		</div>
	);
};

export default Card;
