import classNames from "classnames";

const Area = (name: string) => (props) =>
	(
		<div
			style={props.style}
			className={classNames("i-card-" + name, props.className)}
		>
			{props.children}
		</div>
	);

const Header = Area("header") as any;
const Footer = Area("footer") as any;
const Banner = Area("banner") as any;
const Tailer = Area("tail") as any;

export { Banner, Footer, Header, Tailer };
