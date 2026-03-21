import { AccessTimeRound } from "@ricons/material";
import classNames from "classnames";
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
		className,
		renderItem,
		onChange,
		onBlur,
		popupProps,
		...restProps
	} = props;
	const [timeValue, setTimeValue] = useState(value);
	const [safeValue, setSafeValue] = useState(undefined);
	const [active, setActive] = useState<boolean>(false);

	const handleChange = (v) => {
		setTimeValue(v);
	};

	const handleFallback = (v) => {
		setSafeValue(v);
	};

	const handleValidTime = () => {
		if (!timeValue) return;

		setTimeValue(safeValue);
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
		setTimeValue(value);
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
					value={timeValue}
					format={format}
					periods={periods}
					renderItem={renderItem}
					onChange={handleChange}
					onFallback={handleFallback}
				/>
			}
		>
			<Input
				value={timeValue}
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
				className={classNames("i-timepicker-label", className)}
				{...restProps}
			/>
		</Popup>
	);
}
