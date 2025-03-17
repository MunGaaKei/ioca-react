'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ahooks = require('ahooks');
var PubSub = require('pubsub-js');
var react = require('react');
var context = require('./context.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var PubSub__default = /*#__PURE__*/_interopDefault(PubSub);

function Field(props) {
    const { name, required, children } = props;
    const state = ahooks.useReactive({
        value: undefined,
        status: "normal",
        message: undefined,
        update: 0,
    });
    const form = react.useContext(context.default);
    const { id } = form;
    const handleChange = (v) => {
        if (!name)
            return;
        form.set(name, v);
        PubSub__default.default.publish(`${id}:change`, {
            name,
            value: v,
        });
    };
    const hijackChildren = react.useMemo(() => {
        return react.Children.map(children, (node) => {
            if (!react.isValidElement(node))
                return null;
            const { onChange } = node.props;
            const { value, status, message } = state;
            return react.cloneElement(node, {
                value,
                status,
                message,
                required,
                onChange: (...args) => {
                    handleChange(args[0]);
                    onChange?.(...args);
                    Object.assign(state, {
                        status: "normal",
                        message: undefined,
                    });
                },
            });
        });
    }, [children, state.update]);
    react.useEffect(() => {
        if (!name)
            return;
        PubSub__default.default.subscribe(`${id}:set:${name}`, (evt, v) => {
            state.value = v;
            state.update += 1;
        });
        PubSub__default.default.subscribe(`${id}:invalid:${name}`, (evt, v) => {
            Object.assign(state, v);
            state.update += 1;
        });
        Promise.resolve().then(() => {
            form.set(name, form.cacheData[name] ?? undefined);
        });
        return () => {
            PubSub__default.default.unsubscribe(`${id}:set:${name}`);
            PubSub__default.default.unsubscribe(`${id}:invalid:${name}`);
            form.delete(name);
        };
    }, [name, children]);
    if (!name)
        return children;
    return hijackChildren;
}

exports.default = Field;
//# sourceMappingURL=field.js.map
