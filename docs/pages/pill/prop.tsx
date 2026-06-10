import { Pill } from "@p";
import { useState } from "react";
import { Link } from "react-router";

export const DEditable = {
    demo: () => {
        const [value, setValue] = useState(["Alpha", "Beta"]);

        return (
            <div>
                <div className="mb-12 green">{value.join(", ")}</div>
                <Pill value={value} onChange={setValue} editable />
            </div>
        );
    },
    code: `const [value, setValue] = useState(["Alpha", "Beta"]);

return (
    <div>
        <div className='mb-12 green'>{value.join(", ")}</div>
        <Pill value={value} onChange={setValue} editable />
    </div>
);`,
    lang: "javascript",
};

export const DAsync = {
    demo: () => {
        const [asyncValue, setAsyncValue] = useState(["Alpha", "Beta"]);

        return <Pill label="Async" value={asyncValue} tagProps={{ className: "bg-blue", round: true }} onChange={setAsyncValue} onUpdate={(newValue, oldValue, type) => new Promise((resolve) => setTimeout(() => resolve(true), 1000))} />;
    },
    code: `const [asyncValue, setAsyncValue] = useState(["Alpha", "Beta"]);

return (
    <Pill
        label="Async"
        value={asyncValue}
        tagProps={{ className: "bg-blue", round: true }}
        onChange={setAsyncValue}
        onUpdate={(newValue, oldValue, type) =>
            new Promise((resolve) => setTimeout(() => resolve(true), 1000))
        }
    />
);`,
    lang: "javascript",
};

export const PPill = [
    {
        name: "value",
        desc: "值",
        type: ["any[]"],
        def: "[]",
    },
    {
        name: "renderItem",
        desc: "完全替代默认 Tag 渲染自定义 item。接收 context 包含 value、index、editing、loading、readonly、 remove()",
        type: ["(context: {...}) => ReactNode"],
    },
    {
        name: "validator",
        desc: "同步或异步校验新增或编辑的值是否合法",
        type: ["(value: any) => boolean | Promise<boolean>"],
    },
    {
        name: "format",
        desc: "新增或编辑时对输入值进行转换，转换后再校验和存储",
        type: ["(value: any) => any"],
    },
    {
        name: "tagProps",
        desc: (
            <>
                透传至{" "}
                <Link className="blue" to="/docs/tag#i-tag">
                    Tag
                </Link>{" "}
                的属性
            </>
        ),
        type: ["Partial<ITag>"],
    },
    {
        name: "max",
        desc: "最大可添加数量",
        type: ["number"],
    },
    {
        name: "icon",
        desc: "新增按钮图标",
        type: ["ReactNode"],
    },
    {
        name: "editable",
        desc: "点击已有标签可编辑值",
        type: ["boolean"],
        def: "false",
    },
    {
        name: "readonly",
        desc: "只读模式，不可新增、编辑、删除",
        type: ["boolean"],
        def: "false",
    },
    {
        name: "label",
        desc: "标签",
        type: ["ReactNode"],
    },
    {
        name: "labelInline",
        desc: "标签与内容显示在同一行",
        type: ["boolean"],
        def: "false",
    },
    {
        name: "onChange",
        desc: "值发生改变时触发",
        type: ["(value: any[]) => void"],
        event: true,
    },
    {
        name: "onUpdate",
        desc: "新增、编辑、删除时触发，返回 false 或 Promise<false> 可阻止变更",
        type: ['(newValue, oldValue, type: "delete" | "create" | "update") => void | Promise<boolean>'],
        event: true,
    },
];
