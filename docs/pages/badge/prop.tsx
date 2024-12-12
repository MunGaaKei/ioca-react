import { Badge, Button, Flex } from "@p";
import { useState } from "react";

export const DBasic = {
	demo: () => {
		const [count, setCount] = useState(0);

		return (
			<Flex gap={12}>
				<Badge
					disabled={count === 0}
					content={count}
					contentClass='bg-blue'
				>
					<Button onClick={() => setCount((v) => v + 1)}>
						Click Me
					</Button>
				</Badge>
				<Badge
					dot
					disabled={count === 0}
					content={count}
					contentClass='bg-error'
				>
					<Button
						className='bg-yellow'
						onClick={() => {
							if (count === 0) return;
							setCount((v) => v - 1);
						}}
					>
						Dot Like
					</Button>
				</Badge>
				<Button className='bg-error-0' onClick={() => setCount(0)}>
					Clear
				</Button>
			</Flex>
		);
	},
	code: `const [count, setCount] = useState(0);

return (
    <Flex gap={12}>
        <Badge
            disabled={count === 0}
            content={count}
            contentClass='bg-blue'
        >
            <Button onClick={() => setCount((v) => v + 1)}>
                Click Me
            </Button>
        </Badge>
        <Badge
            dot
            disabled={count === 0}
            content={count}
            contentClass='bg-error'
        >
            <Button
				className='bg-yellow'
				onClick={() => {
					if (count === 0 ) return
					setCount((v) => v - 1);
				}}
			>
				Dot Like
			</Button>
        </Badge>
        <Button className='bg-error-0' onClick={() => setCount(0)}>
            Clear
        </Button>
    </Flex>
);`,
	lang: "javascript",
};

export const PBadge = [
	{
		name: "content",
		desc: "显示内容",
		type: ["ReactNode"],
	},
	{
		name: "contentClass",
		desc: "内容 className",
		type: ["string"],
	},
	{
		name: "dot",
		desc: "显示成圆点",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "dotSize",
		desc: "圆点尺寸",
		type: ["string", "number"],
	},
	{
		name: "round",
		desc: "圆角",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "disabled",
		desc: "是否生效",
		type: ["boolean"],
		def: "false",
	},
];
