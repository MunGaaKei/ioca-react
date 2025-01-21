import Text from "../text";
import { IProgress } from "./type";

export default function Circle(
	props: Pick<IProgress, "value" | "circleSize" | "lineWidth">
) {
	const { value, circleSize = 40, lineWidth = 8 } = props;

	return (
		<div className='i-progress-circle'>
			<svg width={circleSize} height={circleSize}>
				<circle
					cx={circleSize / 2}
					cy={circleSize / 2}
					r={circleSize / 2 - lineWidth / 2}
					fill='none'
					stroke='var(--background-opacity-2)'
					strokeWidth={lineWidth}
				/>
				<circle
					cx={circleSize / 2}
					cy={circleSize / 2}
					r={circleSize / 2 - lineWidth / 2}
					fill='none'
					stroke='var(--color-main)'
					strokeWidth={lineWidth}
					strokeDasharray={100}
					pathLength={100}
					className='i-progress-circle-path'
					strokeLinecap='round'
					style={{
						strokeDashoffset: `calc(100 - ${value})`,
					}}
				/>
			</svg>

			<span className='i-progress-circle-value'>
				<span>{value}</span>
				<Text size='.81em' className='color-7'>
					%
				</Text>
			</span>
		</div>
	);
}
