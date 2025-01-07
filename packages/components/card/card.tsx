import classNames from "classnames";
import { Children, useMemo } from "react";
import { Banner, Footer, Header, Tailer } from "./area";
import "./index.css";
import { ICard } from "./type";

const Card = (props: ICard) => {
	const { shadow = true, border, style, className, children } = props;

	const slots: any = useMemo(() => {
		const nodes = {};

		Children.map(children, (child: any) => {
			const type = child.type;

			switch (type) {
				case Header:
					nodes["header"] = child;
					break;
				case Footer:
					nodes["footer"] = child;
					break;
				case Banner:
					nodes["banner"] = child;
					break;
				case Tailer:
					nodes["tailer"] = child;
					break;
				default:
					nodes["content"] = [...(nodes["content"] || []), child];
					break;
			}
		});

		return nodes;
	}, [children]);

	const { header, banner, content, footer, tailer } = slots;

	return (
		<div
			style={style}
			className={classNames("i-card", className, {
				shadow,
				"i-card-bordered": border,
			})}
		>
			{banner}

			{header}

			{content && <div className='i-card-content'>{content}</div>}

			{footer}

			{tailer}
		</div>
	);
};

Card.Header = Header;
Card.Footer = Footer;
Card.Banner = Banner;
Card.Tailer = Tailer;

export default Card;
