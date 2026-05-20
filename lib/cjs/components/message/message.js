'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var radash = require('radash');
var react = require('react');
var hooks = require('../../js/hooks.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const AlignMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
};
const ContainerConfig = {
    align: "center",
    fromBottom: false,
    unshift: false,
    gap: 12,
    offset: "12px",
    duration: 3000,
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
const MessageItem = function ({ ref, active, content, top, bottom, className, style, onClick, }) {
    return (jsxRuntime.jsx("div", { ref: ref, className: classNames__default("i-message", className, {
            "i-message-active": active,
        }), style: {
            ...style,
            ...(bottom !== undefined ? { bottom } : { top }),
        }, onClick: onClick, children: content }));
};
function Messages() {
    const ref = react.useRef(null);
    const state = hooks.useReactive({
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
    react.useEffect(() => {
        Object.assign(handler, {
            callout: function (item) {
                const { align = "center", unshift, onShow } = item;
                queue[align][unshift ? "unshift" : "push"](item);
                state.items[align] = [...queue[align]];
                item.close = this.close.bind(item);
                // Pre-fill 0-height placeholder so heights stays index-aligned with queue
                if (unshift) {
                    heights[align].unshift(0);
                }
                else {
                    heights[align].push(0);
                }
                state.tops[align] = [...heights[align]];
                requestAnimationFrame(() => {
                    const h = ref.current?.offsetHeight || 0;
                    const idx = queue[align].findIndex((i) => i.id === item.id);
                    if (idx < 0)
                        return;
                    queue[align][idx].active = true;
                    state.items[align] = [...queue[align]];
                    heights[align][idx] = h;
                    state.tops[align] = [...heights[align]];
                    onShow?.();
                });
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
    const renderGroup = (align) => {
        const items = state.items[align];
        const tops = state.tops[align];
        const gap = ContainerConfig.gap;
        if (ContainerConfig.fromBottom) {
            // bottom-up: calculate bottom-edge positions
            let offset = 0;
            const bottoms = [];
            for (let i = items.length - 1; i >= 0; i--) {
                bottoms[i] = offset;
                offset += (tops[i] || 0) + gap;
            }
            return items.map((item, i) => {
                if (!item)
                    return jsxRuntime.jsx(jsxRuntime.Fragment, {});
                const { id, active, content, className, style: itemStyle } = item;
                return (jsxRuntime.jsx(MessageItem, { ref: ref, active: active, content: content, bottom: bottoms[i], className: className, style: {
                        ...itemStyle,
                        alignSelf: AlignMap[align],
                    }, onClick: handler.close.bind(item) }, id));
            });
        }
        // top-down (default)
        let offset = 0;
        return items.map((item, i) => {
            if (!item)
                return jsxRuntime.jsx(jsxRuntime.Fragment, {});
            const { id, active, content, className, style: itemStyle } = item;
            const top = offset;
            offset += (tops[i] || 0) + gap;
            return (jsxRuntime.jsx(MessageItem, { ref: ref, active: active, content: content, top: top, className: className, style: {
                    ...itemStyle,
                    alignSelf: AlignMap[align],
                }, onClick: handler.close.bind(item) }, id));
        });
    };
    return (jsxRuntime.jsxs("div", { className: "i-messages", style: {
            margin: ContainerConfig.offset,
        }, children: [renderGroup("left"), renderGroup("center"), renderGroup("right")] }));
}
function message(config) {
    if (typeof config !== "object" || react.isValidElement(config)) {
        config = { content: config };
    }
    const msg = {
        id: radash.uid(7),
        active: false,
        align: ContainerConfig.align,
        duration: ContainerConfig.duration,
        closable: true,
        unshift: ContainerConfig.unshift,
        ...config,
    };
    handler.callout(msg);
    return {
        instance: msg,
        close: handler.close.bind(msg),
    };
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
function MessageContainer({ align = "center", fromBottom = false, unshift = false, gap = 12, offset = "12px", duration = 3000, }) {
    ContainerConfig.align = align;
    ContainerConfig.fromBottom = fromBottom;
    ContainerConfig.unshift = unshift;
    ContainerConfig.gap = gap;
    ContainerConfig.offset = offset;
    ContainerConfig.duration = duration;
    return null;
}
// 默认 Portal 到 document.body（仅在客户端执行，避免 SSR 问题）
if (typeof document !== "undefined") {
    import('react-dom/client').then(({ createRoot }) => {
        const container = document.createElement("div");
        container.dataset.id = "messages";
        document.body.append(container);
        createRoot(container).render(jsxRuntime.jsx(Messages, {}));
    });
}

exports.MessageContainer = MessageContainer;
exports.default = message;
//# sourceMappingURL=message.js.map
