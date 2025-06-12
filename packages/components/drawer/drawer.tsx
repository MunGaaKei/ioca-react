import { useReactive } from "ahooks";
import classNames from "classnames";
import { useEffect, useRef, useTransition } from "react";
import { createPortal } from "react-dom";
import { useKeydown } from "../../js/hooks";
import Helpericon from "../utils/helpericon";
import "./index.css";
import { IDrawer } from "./type";

function Drawer(props: IDrawer) {
	const {
		visible,
		position = "left",
		header,
		footer,
		backdropClosable = true,
		hideCloseButton,
		keepDOM,
		className,
		disabledEsc,
		children,
		onVisibleChange,
		onClose,
		...restProps
	} = props;

	const toggable = useRef(true);
	const state = useReactive({
		show: visible,
		active: visible,
	});
	const [isPending, startTransition] = useTransition();

	const handleHide = () => {
		if (!toggable.current || isPending) return;
		toggable.current = false;

		startTransition(() => {
			state.active = false;

			setTimeout(() => {
				if (!keepDOM) {
					state.show = false;
				}
				onVisibleChange?.(false);
				toggable.current = true;
				onClose?.();
			}, 240);
		});
	};

	const handleShow = () => {
		if (!toggable.current || isPending) return;

		state.show = true;
		onVisibleChange?.(true);
		toggable.current = false;

		startTransition(() => {
			requestAnimationFrame(() => {
				state.active = true;
				toggable.current = true;
			});
		});
	};

	useEffect(() => {
		visible ? handleShow() : handleHide();
	}, [visible]);

	const handleBackdropClick = () => {
		backdropClosable && handleHide();
	};

	useKeydown(
		(e) => {
			if (e.code !== "Escape" || !visible) return;
			handleHide();
		},
		{
			disabled: disabledEsc,
		}
	);

	if (!state.show) return null;

	return createPortal(
		<div
			className={classNames("i-backdrop-drawer", className, {
				"i-active": state.active,
			})}
			onClick={handleBackdropClick}
			{...restProps}
		>
			<div
				className={classNames("i-drawer", `i-drawer-${position}`)}
				onClick={(e) => e.stopPropagation()}
			>
				{header && (
					<header className='i-drawer-header'>
						{header}

						{!hideCloseButton && (
							<Helpericon
								className='i-drawer-close'
								onClick={handleHide}
							/>
						)}
					</header>
				)}

				<div className='i-drawer-content'>{children}</div>

				{footer && <div className='i-drawer-footer'>{footer}</div>}
			</div>
		</div>,
		document.body
	);
}

export default Drawer;
