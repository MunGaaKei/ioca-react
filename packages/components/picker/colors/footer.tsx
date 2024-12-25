import { useReactive } from "ahooks";
import { useEffect } from "react";
import Input from "../../input";
import Select from "../../select";

export const ColorMethods = {
	HEX: "toHexString",
	RGB: "toRgbString",
	HSB: "toHsbString",
};

export default function Footer(props) {
	const { value, type, onTypeChange, onChange } = props;
	const state = useReactive({
		value,
		type,
	});

	const handleChange = (v) => {
		state.value = v;
		onChange?.(v);
	};

	const handleTypeChange = (t) => {
		state.type = t;
		onTypeChange(t);
	};

	useEffect(() => {
		state.value = value;
		state.type = type;
	}, [value, type]);

	return (
		<div className='i-colorpicker-footer'>
			<Select
				readOnly
				hideClear
				hideArrow
				style={{ width: "5.6em" }}
				options={["RGB", "HEX", "HSB"]}
				value={state.type}
				onChange={handleTypeChange}
			/>
			<Input value={state.value} onChange={handleChange} />
		</div>
	);
}
