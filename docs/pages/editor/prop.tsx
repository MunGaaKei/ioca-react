import { RefEditor } from "@/packages/components/editor/type";
import { Button, Editor, Flex } from "@p";
import { useRef } from "react";

export const DBasic = {
	demo: () => {
		const editorRef = useRef<RefEditor>(null);

		const handleGet = () => {
			console.log(editorRef.current?.getSafeValue());
		};

		const handleSet = () => {
			editorRef.current?.setValue(
				`<b>bold</b> <a data-ioca="react" href="#editor" target="_blank" data-a="123">link</a> <strike>strike</strike> <span style="text-decoration: underline;">underline</span> <i>italic</i>
<img src="/docs/assets/jay.jpg" />
<style>body{background:red;}</style>
<script>alert(1)</script>`
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
				<Editor ref={editorRef} height={300} />
			</>
		);
	},
	code: `const editorRef = useRef<RefEditor>(null);

const handleGet = () => {
	console.log(editorRef.current?.getSafeValue());
};

const handleSet = () => {
	editorRef.current?.setValue(
		\`<b>bold</b> <a data-ioca="react" href="#editor" target="_blank" data-a="123">link</a> <strike>strike</strike> <span style="text-decoration: underline;">underline</span> <i>italic</i>
<img src="/docs/assets/jay.jpg" />
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
		<Editor ref={editorRef} height={300} />
	</>
);`,
	lang: "javascript",
};

export const PEditor = [
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
		name: "richPaste",
		desc: "粘贴时不阻止默认事件",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "controls",
		desc: "操作栏提供的功能，目前支持的有：bold, italic, underline, strike, redo, undo, clear",
		type: ["string[]", "'simple'", "'all'", "'none'"],
		def: "'simple'",
	},
	{
		name: "onInput",
		desc: "输入时触发",
		type: ["(html: string, e: FormEvent<HTMLDivElement>) => void"],
		event: true,
	},
];

export const PRef = `interface RefEditor {

	input: HTMLDivElement | null;

	getSafeValue: () => string;

	setValue: (html: string) => void;

}
`;
