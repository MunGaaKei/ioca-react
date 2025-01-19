import ColorsPanel from "@rc-component/color-picker";
import "@rc-component/color-picker/assets/index.css";
import { useReactive } from "ahooks";
import { useEffect } from "react";
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

	const state = useReactive({
		type,
		value,
		syncValue: value,
		visible: popupProps?.visible,
	});

	const handleChange = (target) => {
		state.syncValue = target;
	};

	const handleComplete = (target) => {
		const method = ColorMethods[state.type];

		if (target.a !== 1) {
			target.a = parseFloat(target.a.toFixed(3));
		}

		state.value = target[method]?.();
	};

	const handleVisibleChange = (v: boolean) => {
		state.visible = v;
		popupProps?.onVisibleChange?.(v);
	};

	const handleTypeChange = (t) => {
		const method = ColorMethods[t];

		state.type = t;
		state.value = state.syncValue[method]?.();
	};

	const handleValueChange = (v) => {
		state.value = v;
		state.syncValue = v;
	};

	const handleOk = () => {
		onChange?.(state.value);
		state.visible = false;
	};

	useEffect(() => {
		state.syncValue = value;
		state.value = value;
	}, [value]);

	if (usePanel) {
		return <ColorsPanel {...props} />;
	}

	return (
		<Popup
			trigger='click'
			touchable
			position='bottom'
			{...popupProps}
			visible={state.visible}
			content={
				<ColorsPanel
					value={state.syncValue}
					disabledAlpha={disabledAlpha}
					panelRender={(panel) => {
						return (
							<>
								{panel}
								<Footer
									value={state.value}
									type={state.type}
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
