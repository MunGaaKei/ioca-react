import ColorsPanel from "@rc-component/color-picker";
import { useEffect, useState } from "react";
import Popup from "../../popup";
import { IColorPicker } from "../type";
import Footer, { ColorMethods } from "./footer";
import Handle from "./handle";
import "./index.css";

export default function ColorPicker(props: IColorPicker) {
	const {
		value,
		type = "HEX",
		disabledAlpha,
		children,
		usePanel,
		handle = "both",
		placeholder = "Colors",
		popupProps,
		onChange,
	} = props;

	const [colorType, setColorType] = useState(type);
	const [colorValue, setColorValue] = useState(value);
	const [syncValue, setSyncValue] = useState(value);
	const [visible, setVisible] = useState<boolean | undefined>(popupProps?.visible);

	const handleChange = (target) => {
		setSyncValue(target);
	};

	const handleComplete = (target) => {
		const method = ColorMethods[colorType];

		if (target.a !== 1) {
			target.a = parseFloat(target.a.toFixed(3));
		}

		setColorValue(target[method]?.());
	};

	const handleVisibleChange = (v: boolean) => {
		setVisible(v);
		popupProps?.onVisibleChange?.(v);
	};

	const handleTypeChange = (t) => {
		const method = ColorMethods[t];

		setColorType(t);
		setColorValue(syncValue?.[method]?.());
	};

	const handleValueChange = (v) => {
		setColorValue(v);
		setSyncValue(v);
	};

	const handleOk = () => {
		onChange?.(colorValue);
		setVisible(false);
	};

	useEffect(() => {
		setSyncValue(value);
		setColorValue(value);
	}, [value]);

	useEffect(() => {
		if (popupProps?.visible !== undefined) {
			setVisible(popupProps.visible);
		}
	}, [popupProps?.visible]);

	if (usePanel) {
		return <ColorsPanel {...props} />;
	}

	return (
		<Popup
			trigger='click'
			touchable
			position='bottom'
			{...popupProps}
			visible={visible}
			content={
				<ColorsPanel
					value={syncValue}
					disabledAlpha={disabledAlpha}
					panelRender={(panel) => {
						return (
							<>
								{panel}
								<Footer
									value={colorValue}
									type={colorType}
									onTypeChange={handleTypeChange}
									onChange={handleValueChange}
									onOk={handleOk}
								/>
							</>
						);
					}}
					onChange={handleChange}
					onChangeComplete={handleComplete}
				/>
			}
			onVisibleChange={handleVisibleChange}
		>
			{children ?? (
				<Handle
					color={value}
					handle={handle}
					placeholder={placeholder}
				/>
			)}
		</Popup>
	);
}
