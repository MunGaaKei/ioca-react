import classNames from "classnames";
import { forwardRef } from "react";
import { createPortal } from "react-dom";
import { IPopupContent } from "./type";

const Content = forwardRef<HTMLDivElement, IPopupContent>((props, ref) => {
	const { arrow, className, children, ...restProps } = props;

	const content = (
		<div
			ref={ref}
			className={classNames("i-popup", className)}
			{...restProps}
		>
			{arrow && <div className='i-popup-arrow' />}

			{children}
		</div>
	);

	const container =
		typeof document === "undefined" ? null : (document.body as HTMLElement);
	if (!container) return null;
	return createPortal(content, container);
});

export default Content;
