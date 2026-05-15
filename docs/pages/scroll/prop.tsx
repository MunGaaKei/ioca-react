import { Flex, Scroll, Tag } from "@p";

const ITEMS = Array.from({ length: 20 }, (_, i) => i + 1);

export const DBasic = {
    demo: (
        <Scroll>
            <Flex gap={8}>
                {ITEMS.map((i) => (
                    <div
                        key={i}
                        style={{
                            width: 120,
                            height: 80,
                            background: "var(--color-main-0)",
                            borderRadius: "var(--radius)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontSize: 24,
                            fontWeight: 600,
                            color: "var(--color-main)",
                        }}
                    >
                        {i}
                    </div>
                ))}
            </Flex>
        </Scroll>
    ),
    code: `<Scroll>
    <Flex gap={8}>
        {items.map((i) => (
            <div key={i} style={{ width: 120, height: 80, ... }}>
                {i}
            </div>
        ))}
    </Flex>
</Scroll>`,
    lang: "xml",
};

export const DDraggable = {
    demo: (
        <Scroll draggable>
            <Flex gap={8}>
                {ITEMS.map((i) => (
                    <Tag
                        key={i}
                        size="large"
                        style={{
                            width: 120,
                            height: 80,
                            background: "var(--color-main-0)",
                            borderRadius: "var(--radius)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontSize: 24,
                            fontWeight: 600,
                            color: "var(--color-main)",
                        }}
                    >
                        {i}
                    </Tag>
                ))}
            </Flex>
        </Scroll>
    ),
    code: `<Scroll draggable>
    <Flex gap={8}>
        {items.map((i) => (
            <Tag key={i} size='large' style={{ ... }}>
                {i}
            </Tag>
        ))}
    </Flex>
</Scroll>`,
    lang: "xml",
};

export const PScroll = [
    {
        name: "draggable",
        desc: "启用鼠标拖拽滚动",
        type: ["boolean"],
        def: "false",
    },
    {
        name: "onScroll",
        desc: "滚动事件回调",
        type: ["(e: UIEvent<HTMLDivElement>) => void"],
        event: true,
    },
];
