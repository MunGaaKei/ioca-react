import { River } from "@p";

export const DBasic = {
	demo: (
		<River pauseOnHover>
			{Array.from({ length: 8 }).map((item, i) => {
				return (
					<div
						key={i}
						style={{
							height: "100px",
							width: 100 * (i % 2 === 0 ? 1.2 : 1),
							background: i % 2 === 0 ? "var(--color-9)" : "",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							fontSize: "28px",
						}}
					>
						{i + 1}
					</div>
				);
			})}
		</River>
	),
	code: `<River pauseOnHover>
	{Array.from({ length: 8 }).map((item, i) => {
		return (
			<div
				key={i}
				style={{
					height: "100px",
					width: 100 * (i % 2 === 0 ? 1.2 : 1),
					background: i % 2 === 0 ? "var(--color-9)" : "",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					fontSize: "28px",
				}}
			>
				{i + 1}
			</div>
		);
	})}
</River>`,
	lang: "xml",
};

export const PRiver = [
	{
		name: "speed",
		desc: "速度，每帧移动多少像素(px)",
		type: ["number"],
		def: 1,
	},
	{
		name: "pauseOnHover",
		desc: "鼠标悬停时暂停动画",
		type: ["boolean"],
		def: "false",
	},
];
