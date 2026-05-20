import { Button, Flex, Message } from "@p";
import { draw } from "radash";

export const DBasic = {
    demo: <Button onClick={() => Message(Math.random())}>Click Me</Button>,
    code: `<Button onClick={() => Message(Math.random())}>Click Me</Button>`,
    lang: "xml",
};

export const DTypes = {
    demo: () => {
        const handleClick = () => {
            const color =
                draw([
                    "bg-pink",
                    "bg-blue",
                    "bg-black",
                    "bg-green",
                    "bg-red",
                    "bg-aqua",
                ]) ?? "";

            Message({
                content: "一条消息",
                className: color,
                unshift: true,
            });
        };

        return (
            <Button className="bg-pink" onClick={handleClick}>
                Click Me
            </Button>
        );
    },
    code: `const handleClick = () => {
	const color =
		draw([
			"bg-pink",
			"bg-blue",
			"bg-black",
			"bg-green",
			"bg-red",
			"bg-aqua",
		]) ?? "";

	Message({
		content: "一条消息",
		className: color,
		unshift: true,
	});
};

return (
	<Button className='bg-pink' onClick={handleClick}>
		Click Me
	</Button>
);`,
    lang: "javascript",
};

export const DFast = {
    demo: () => {
        const handleError = () => {
            Message.error("错误信息");
        };

        const handleSuccess = () => {
            Message.success("成功了");
        };

        return (
            <Flex gap={12}>
                <Button className="bg-error" onClick={handleError}>
                    Error
                </Button>

                <Button className="bg-success" onClick={handleSuccess}>
                    Success
                </Button>
            </Flex>
        );
    },
    code: `const handleError = () => {
    Message.error("错误信息");
};

const handleSuccess = () => {
    Message.success("成功了");
};

return (
    <Flex gap={12}>
        <Button className="bg-error" onClick={handleError}>
            Error
        </Button>

        <Button className="bg-success" onClick={handleSuccess}>
            Success
        </Button>
    </Flex>
);`,
    lang: "javascript",
};

export const PMessageInstance = `message.success(config: IMessageConfig);

message.error(config: IMessageConfig);

message.warning(config: IMessageConfig);

message.one(config: IMessageConfig);
`;

export const PMessage = [
    {
        name: "content",
        desc: "显示内容",
        type: ["ReactNode"],
    },
    {
        name: "duration",
        desc: "持续时间，当为 0 时只能通过手动控制消失，单位ms，可覆盖 Message.Container 的 duration",
        type: ["number"],
    },
    {
        name: "style",
        desc: "消息内联样式",
        type: ["CSSProperties"],
    },
    {
        name: "className",
        desc: "消息类名",
        type: ["string"],
    },
    {
        name: "unshift",
        desc: "从顶部插入新消息",
        type: ["boolean"],
        def: "false",
    },
    {
        name: "closable",
        desc: "可以通过点击让消息消失",
        type: ["boolean"],
        def: "true",
    },
    {
        name: "onShow",
        desc: "消息显示时触发",
        type: ["() => void"],
        event: true,
    },
    {
        name: "onHide",
        desc: "消息隐藏时触发",
        type: ["() => void"],
        event: true,
    },
];

export const PMessageContainer = [
    {
        name: "align",
        desc: "消息水平对齐方向",
        type: ["'left'", "'center'", "'right'"],
        def: "'center'",
    },
    {
        name: "fromBottom",
        desc: "消息从底部滑出",
        type: ["boolean"],
        def: "false",
    },
    {
        name: "unshift",
        desc: "新消息默认从顶部插入",
        type: ["boolean"],
        def: "false",
    },
    {
        name: "gap",
        desc: "消息之间的间隔，单位px",
        type: ["number"],
        def: 12,
    },
    {
        name: "offset",
        desc: "与视窗边距的间隔，可为CSS单位",
        type: ["string"],
        def: "'12px'",
    },
    {
        name: "duration",
        desc: "默认持续时间，当为 0 时只能通过手动控制消失，单位ms",
        type: ["number"],
        def: 3000,
    },
    {
        name: "className",
        desc: "容器类名",
        type: ["string"],
    },
    {
        name: "style",
        desc: "容器内联样式",
        type: ["CSSProperties"],
    },
];
