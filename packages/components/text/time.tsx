import { formatTime } from "@p/js/utils";
import { useMemo } from "react";
import Text from "./text";
import { ITextTime } from "./type";

export default function Number(props: ITextTime) {
	const { seconds, zero, units, ...restProps } = props;

	const text = useMemo(() => {
		if (seconds === undefined) return "";

		return formatTime(seconds, {
			zero,
			units,
		});
	}, [seconds]);

	return <Text {...restProps}>{text}</Text>;
}
