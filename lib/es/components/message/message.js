import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { uid } from 'radash';
import { useRef, useEffect, isValidElement } from 'react';
import { createRoot } from 'react-dom/client';

const AlignMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
};
const GlobalConfig = {
    align: "center",
    offset: "12px",
    gap: 12,
};
const ItemDefaultConfig = {
    duration: 3000,
    closable: true,
    active: false,
};
const handler = {
    oneInstance: null,
    callout(item) { },
    close() { },
};
const queue = {
    left: [],
    center: [],
    right: [],
};
const heights = {
    left: [],
    center: [],
    right: [],
};
const MessageItem = function ({ ref, active, content, top, className, style, onClick, }) {
    return (jsx("div", { ref: ref, className: classNames("i-message", className, {
            "i-message-active": active,
        }), style: {
            ...style,
            top,
        }, onClick: onClick, children: content }));
};
function Messages() {
    const ref = useRef(null);
    const state = useReactive({
        items: {
            left: [],
            center: [],
            right: [],
        },
        tops: {
            left: [],
            center: [],
            right: [],
        },
    });
    const offsetTop = {
        left: 0,
        center: 0,
        right: 0,
    };
    useEffect(() => {
        Object.assign(handler, {
            callout: function (item) {
                const { align = "center", unshift, onShow } = item;
                const size = queue[align][unshift ? "unshift" : "push"](item);
                state.items[align] = [...queue[align]];
                item.close = this.close.bind(item);
                setTimeout(() => {
                    const h = ref.current?.offsetHeight || 0;
                    queue[align][unshift ? 0 : size - 1].active = true;
                    state.items[align] = [...queue[align]];
                    heights[align][unshift ? "unshift" : "push"](h);
                    state.tops[align] = [...heights[align]];
                    onShow?.();
                }, 12);
                if (item.duration !== 0) {
                    item.timer = setTimeout(() => {
                        this.close.call(item);
                    }, item.duration);
                }
            },
            close: function () {
                const item = this;
                const { align = "center", onHide } = item;
                const index = queue[align].findIndex((i) => i.id === item.id);
                if (index < 0)
                    return;
                queue[align][index].active = false;
                state.items[align] = [...queue[align]];
                item.timer = setTimeout(() => {
                    const index = queue[align].findIndex((i) => i.id === item.id);
                    queue[align].splice(index, 1);
                    heights[align].splice(index, 1);
                    state.tops[align] = [...heights[align]];
                    state.items[align] = [...queue[align]];
                    item.timer && clearTimeout(item.timer);
                    onHide?.();
                }, 240);
            },
        });
    }, []);
    const renderItems = (item, i) => {
        if (!item)
            return jsx(Fragment, {});
        const { id, active, content, align = "center", className } = item;
        offsetTop[align] += state.tops[align][i - 1] || 0;
        const top = GlobalConfig.gap * i + offsetTop[align];
        return (jsx(MessageItem, { ref: ref, active: active, content: content, top: top, className: className, style: { alignSelf: AlignMap[align] }, onClick: handler.close.bind(item) }, id));
    };
    return (jsxs("div", { className: 'i-messages', children: [state.items.left.map(renderItems), state.items.center.map(renderItems), state.items.right.map(renderItems)] }));
}
function message(config) {
    if (["string", "number"].includes(typeof config) ||
        isValidElement(config)) {
        config = { content: config };
    }
    config = Object.assign({ id: uid(7) }, ItemDefaultConfig, config);
    handler.callout(config);
    return {
        instance: config,
        close: handler.close.bind(config),
    };
}
function createContainer() {
    if (typeof document === "undefined")
        return null;
    const container = document.createElement("div");
    container.dataset.id = "messages";
    document.body.append(container);
    return container;
}
message.error = (content) => {
    return message({
        content,
        className: "bg-error",
    });
};
message.success = (content) => {
    return message({
        content,
        className: "bg-success",
    });
};
message.warning = (content) => {
    return message({
        content,
        className: "bg-warning",
    });
};
message.info = (content) => {
    return message({
        content,
        className: "bg-blue",
    });
};
message.one = (config) => {
    const o = handler.oneInstance;
    if (o) {
        if (o.active && o.duration !== 0) {
            clearTimeout(o.timer);
            o.timer = setTimeout(() => {
                o.close?.();
            }, o.duration);
        }
        else {
            handler.callout(o);
        }
    }
    else {
        const { instance } = message(config);
        handler.oneInstance = instance;
    }
};
// 初始化消息容器
let container = null;
let root = null;
if (typeof window !== "undefined") {
    container = createContainer();
    if (container) {
        root = createRoot(container);
        root.render(jsx(Messages, {}));
    }
}

export { message as default };
//# sourceMappingURL=message.js.map
