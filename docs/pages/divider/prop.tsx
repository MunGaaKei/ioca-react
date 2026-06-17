import { Divider, Flex } from "@p";

export const DBasic = {
    demo: () => (
        <Flex direction="column">
            <div>颗粒度</div>
            <Divider className="my-8" />
            <div>闭环</div>
        </Flex>
    ),
    code: `<div>内容区域 A</div>
<Divider className="my-8" />
<div>内容区域 B</div>`,
    lang: "xml",
};

export const PDivider = [
    {
        name: "children",
        desc: "自定义内容，传入后在分割线中间显示文字",
        type: ["ReactNode"],
    },
    {
        name: "color",
        desc: "分割线颜色，同时影响中间文字的颜色",
        type: ["string"],
    },
    {
        name: "width",
        desc: "分割线粗细，number 类型时单位为 px",
        type: ["number", "string"],
    },
];
