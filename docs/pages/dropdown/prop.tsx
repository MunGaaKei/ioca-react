import { Button, Divider, Dropdown, Icon, Tag } from "@p";
import { KeyboardArrowDownRound, KeyboardCommandKeyRound, MoreHorizRound } from "@ricons/material";

export const DBasic = {
    demo: () => {
        const Dropmenu = (close) => {
            return (
                <>
                    <Dropdown.Item>
                        <span>复制</span>
                        <Tag size="small" className="bg-blue-0">
                            <Icon icon={<KeyboardCommandKeyRound />} size="1.125em" />
                            <span>C</span>
                        </Tag>
                    </Dropdown.Item>
                    <Dropdown.Item disabled>
                        <span>粘贴</span>
                        <Tag size="small" className="bg-blue-0">
                            <Icon icon={<KeyboardCommandKeyRound />} size="1.125em" />
                            <span>V</span>
                        </Tag>
                    </Dropdown.Item>

                    <Divider />

                    <Dropdown.Item
                        more={
                            <>
                                <Dropdown.Item onClick={close}>
                                    <span>剪切</span>
                                    <Tag size="small" className="bg-yellow-0">
                                        <Icon icon={<KeyboardCommandKeyRound />} size="1.125em" />
                                        <span>X</span>
                                    </Tag>
                                </Dropdown.Item>
                                <Dropdown.Item
                                    more={
                                        <>
                                            <Dropdown.Item>
                                                <span>彻底删除</span>
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                                <span>移至回收站</span>
                                            </Dropdown.Item>
                                        </>
                                    }
                                >
                                    <span>删除</span>
                                    <Tag size="small" className="bg-red-0">
                                        <Icon icon={<KeyboardCommandKeyRound />} size="1.125em" />
                                        <span>D</span>
                                    </Tag>
                                </Dropdown.Item>
                            </>
                        }
                    >
                        <span>更多</span>
                        <Icon icon={<MoreHorizRound />} />
                    </Dropdown.Item>

                    <Button className="bg-grey mx-4 mt-4" size="small" onClick={close}>
                        取消
                    </Button>
                </>
            );
        };

        return (
            <Dropdown content={Dropmenu} width={160}>
                <Button>
                    下拉菜单
                    <Icon icon={<KeyboardArrowDownRound />} size="1.25em" />
                </Button>
            </Dropdown>
        );
    },
    code: `const Dropmenu = (close) => {
    return (
        <>
            <Dropdown.Item>
                <span>复制</span>
                <Tag size="small" className="bg-blue-0">
                    <Icon
                        icon={<KeyboardCommandKeyRound />}
                        size="1.125em"
                    />
                    <span>C</span>
                </Tag>
            </Dropdown.Item>
            <Dropdown.Item disabled>
                <span>粘贴</span>
                <Tag size="small" className="bg-blue-0">
                    <Icon
                        icon={<KeyboardCommandKeyRound />}
                        size="1.125em"
                    />
                    <span>V</span>
                </Tag>
            </Dropdown.Item>
            <Dropdown.Item
                more={
                    <>
                        <Dropdown.Item onClick={close}>
                            <span>剪切</span>
                            <Tag size="small" className="bg-yellow-0">
                                <Icon
                                    icon={<KeyboardCommandKeyRound />}
                                    size="1.125em"
                                />
                                <span>X</span>
                            </Tag>
                        </Dropdown.Item>
                        <Dropdown.Item
                            more={
                                <>
                                    <Dropdown.Item>
                                        <span>彻底删除</span>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <span>移至回收站</span>
                                    </Dropdown.Item>
                                </>
                            }
                        >
                            <span>删除</span>
                            <Tag size="small" className="bg-red-0">
                                <Icon
                                    icon={<KeyboardCommandKeyRound />}
                                    size="1.125em"
                                />
                                <span>D</span>
                            </Tag>
                        </Dropdown.Item>
                    </>
                }
            >
                <span>更多</span>
                <Icon icon={<MoreHorizRound />} />
            </Dropdown.Item>
            <Divider />
            <Button
                className="bg-grey mt-12"
                size="small"
                onClick={close}
            >
                取消
            </Button>
        </>
    );
};

return (
    <Dropdown content={Dropmenu} width={160}>
        <Button>
            下拉菜单
            <Icon icon={<KeyboardArrowDownRound />} size="1.25em" />
        </Button>
    </Dropdown>
);`,
    lang: "javascript",
};

export const PDropdown = [
    {
        name: "width",
        desc: "弹出内容最小宽度",
        type: ["number", "string"],
    },
    {
        name: "content",
        desc: "内容",
        type: ["ReactNode", "(close: () => void) => ReactNode"],
    },
];

export const PDropdownItem = [
    {
        name: "more",
        desc: "次级菜单，传入 ReactNode 后会自动渲染右侧箭头指示符，hover 时展开子菜单",
        type: ["ReactNode"],
    },
    {
        name: "moreProps",
        desc: "子菜单 Popup 配置，支持 position/offset/width 等属性",
        type: ["object"],
    },
    {
        name: "close（通过 DropdownContext）",
        desc: "所有 Dropdown.Item 均可通过 DropdownContext 获取 close 函数，无需手动透传。点击无 more 的选项会自动关闭菜单",
        type: ["() => void"],
    },
];
