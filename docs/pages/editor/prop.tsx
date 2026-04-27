import { Button, Editor, Flex } from "@p";
import { useState } from "react";

export const DBasic = {
    demo: () => {
        const [value, setValue] = useState("");

        const handleGet = () => {
            console.log(value);
        };

        const handleSet = () => {
            setValue(
                `<b>bold</b> <a data-ioca="react" href="#editor" target="_blank" data-a="123">link</a> <strike>strike</strike> <span style="text-decoration: underline;">underline</span> <i>italic</i>
<img src="https://ioca-react.vercel.app/logo.png" width="48" height="48" />
<style>body{background:red;}</style>
<script>alert(1)</script>`,
            );
        };

        return (
            <>
                <Flex className="mb-12" gap={8}>
                    <Button onClick={handleGet}>获取内容</Button>
                    <Button onClick={handleSet} className="bg-blue">
                        设置内容
                    </Button>
                </Flex>

                <Editor
                    value={value}
                    onChange={setValue}
                    height={300}
                    memtion={{
                        options: [
                            {
                                label: "Ioca React",
                                value: "@ioca-react",
                            },
                            {
                                label: "Editor",
                                value: "@editor",
                            },
                        ],
                        insert: (option) => (
                            <a className="blue px-4">{option.label}</a>
                        ),
                    }}
                />
            </>
        );
    },
    code: `const [value, setValue] = useState("");

const handleGet = () => {
	console.log(value);
};

const handleSet = () => {
	setValue(
		\`<b>bold</b> <a data-ioca="react" href="#editor" target="_blank" data-a="123">link</a> <strike>strike</strike> <span style="text-decoration: underline;">underline</span> <i>italic</i>
<img src="https://ioca-react.vercel.app/logo.png" width="48" height="48" />
<style>body{background:red;}</style>
<script>alert(1)</script>\`
	);
};

return (
	<>
		<Flex className='mb-12' gap={8}>
			<Button onClick={handleGet}>获取内容</Button>
			<Button onClick={handleSet} className='bg-blue'>
				设置内容
			</Button>
		</Flex>

		<Editor
			value={value}
			onChange={setValue}
			height={300}
			memtion={{
				options: [
					{
						label: "Ioca React",
						value: "@ioca-react",
					},
					{
						label: "Editor",
						value: "@editor",
					},
				],
				insert: (option) => (
					<span
						className='bg-blue-subtle color-blue px-4 round-4'
						data-value={option.value}
					>
						{option.label}
					</span>
				),
			}}
		/>
	</>
);`,
    lang: "javascript",
};

export const PEditor = [
    {
        name: "value",
        desc: "编辑器内容，rich 模式为 HTML，plaintext 模式为纯文本",
        type: ["string"],
    },
    {
        name: "width",
        desc: "宽度",
        type: ["string", "number"],
    },
    {
        name: "height",
        desc: "高度",
        type: ["string", "number"],
        def: "'10em'",
    },
    {
        name: "placeholder",
        desc: "占位符",
        type: ["string"],
    },
    {
        name: "mode",
        desc: "编辑模式",
        type: ["'rich'", "'plaintext'"],
        def: "'rich'",
    },
    {
        name: "hideControl",
        desc: "隐藏默认工具栏",
        type: ["boolean"],
        def: "false",
    },
    {
        name: "addtionControls",
        desc: "额外工具按钮，点击时会传入最近一次记录的 selection range",
        type: [
            "Array<{ icon: ReactNode; onClick?: (selection: Range | null, e: SyntheticEvent<HTMLButtonElement>) => void }>",
        ],
    },
    {
        name: "memtion",
        desc: "提及配置，输入触发键后展示选项，选中后会在当前 selection 位置插入节点",
        type: [
            "{ key?: string; options: Array<{ label: ReactNode; value: string | number }>; insert?: (option) => ReactNode }",
        ],
    },
    {
        name: "autosize",
        desc: "高度由内容自动撑开",
        type: ["boolean"],
        def: "false",
    },
    {
        name: "border",
        desc: "边框",
        type: ["boolean"],
        def: "true",
    },
    {
        name: "onChange",
        desc: "内容变化时触发",
        type: ["(value: string, e: SyntheticEvent<HTMLDivElement>) => void"],
        event: true,
    },
    {
        name: "onEnter",
        desc: "按下回车时触发，传入后会阻止默认回车行为",
        type: ["(e: KeyboardEvent<HTMLDivElement>) => void"],
        event: true,
    },
];
