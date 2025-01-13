import { AccessTimeRound } from "@ricons/material";
import { useReactive } from "ahooks";
import { useEffect, useState } from "react";
import Icon from "../../icon";
import Input from "../../input";
import Popup from "../../popup";
import { ITimePicker } from "../type";
import Panel from "./panel";

const FORMAT = "hh:mm:ss";

export default function TimePicker(props: ITimePicker) {
	const {
		name,
		value,
		format = FORMAT,
		periods,
		placeholder = props.format ?? FORMAT,
		renderItem,
		onChange,
		onBlur,
		popupProps,
		...restProps
	} = props;
	const state = useReactive({
		value,
		safeValue: undefined,
	});
	const [active, setActive] = useState<boolean>(false);

	const handleChange = (v) => {
		state.value = v;
	};

	const handleFallback = (v) => {
		state.safeValue = v;
	};

	const handleValidTime = () => {
		if (!state.value) return;

		state.value = state.safeValue;
		handleChange(state.safeValue);
	};

	const handleBlur = (e) => {
		onBlur?.(e);
		handleValidTime();
	};

	const handleVisibleChange = (v) => {
		popupProps?.onVisibleChange?.(v);
		setActive(v);
	};

	useEffect(() => {
		state.value = value;
	}, [value]);

	return (
		<Popup
			visible={active}
			trigger='click'
			position='bottom'
			arrow={false}
			align='start'
			watchResize
			{...popupProps}
			onVisibleChange={handleVisibleChange}
			content={
				<Panel
					value={state.value}
					format={format}
					periods={periods}
					renderItem={renderItem}
					onChange={handleChange}
					onFallback={handleFallback}
				/>
			}
		>
			<Input
				value={state.value}
				placeholder={placeholder}
				append={
					<Icon
						icon={<AccessTimeRound />}
						className='i-timepicker-icon'
						size='1em'
					/>
				}
				onChange={handleChange}
				onBlur={handleBlur}
				{...restProps}
			/>
		</Popup>
	);
}
