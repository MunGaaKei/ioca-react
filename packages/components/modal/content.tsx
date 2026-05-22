import { memo, useMemo, useState } from "react";
import Button from "../button";
import Helpericon from "../utils/helpericon";
import "./index.css";
import { IModalContent } from "./type";

const Content = (props: IModalContent) => {
	const {
		title,
		footer,
		hideCloseButton,
		footerLeft,
		okButtonProps,
		cancelButtonProps,
		children,
		onOk,
		onClose,
	} = props;
	const showHeader = title || !hideCloseButton;

	const [loading, setLoading] = useState(false);

	const handleOk = async () => {
		setLoading(true);
		try {
			const ret = await onOk?.();

			if (ret === false) return;

			onClose?.();
		} finally {
			setLoading(false);
		}
	};

	const renderFooter = useMemo(() => {
		if (footer || footer === null) return footer;

		const propsOk = Object.assign(
			{
				children: "确定",
				onClick: handleOk,
			},
			okButtonProps,
			{ loading }
		);
		const propsCancel = Object.assign(
			{
				secondary: true,
				children: "关闭",
				onClick: onClose,
			},
			cancelButtonProps
		);

		return (
			<>
				{footerLeft}
				<Button {...propsOk} />
				<Button {...propsCancel} />
			</>
		);
	}, [footer, okButtonProps, cancelButtonProps, loading]);

	return (
		<>
			{showHeader && (
				<header className='i-modal-header'>
					{title && <b>{title}</b>}

					<Helpericon
						active={!hideCloseButton}
						className='i-modal-close'
						onClick={onClose}
					/>
				</header>
			)}

			<div className='i-modal-content'>{children}</div>

			<footer className='i-modal-footer'>{renderFooter}</footer>
		</>
	);
};

export default memo(Content);
