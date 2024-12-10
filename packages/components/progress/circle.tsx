import Text from "../text";
import { IProgress } from "./type";

export default function Circle(
	props: Pick<IProgress, "value" | "height" | "size">
) {
	const { value, height = 40, size = 8 } = props;

	return (
		<div className='i-progress-circle'>
			<svg width={height} height={height}>
				<circle
					cx={height / 2}
					cy={height / 2}
					r={height / 2 - size / 2}
					fill='none'
					stroke='var(--background-opacity-2)'
					strokeWidth={size}
				/>
				<circle
					cx={height / 2}
					cy={height / 2}
					r={height / 2 - size / 2}
					fill='none'
					stroke='var(--color-main)'
					strokeWidth={size}
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
