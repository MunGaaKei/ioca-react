'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var PubSub = require('pubsub-js');
var react = require('react');
var context = require('./context.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var PubSub__default = /*#__PURE__*/_interopDefaultCompat(PubSub);

function Field(props) {
    const { name, required, children } = props;
    const [fieldValue, setFieldValue] = react.useState(undefined);
    const [fieldStatus, setFieldStatus] = react.useState("normal");
    const [fieldMessage, setFieldMessage] = react.useState(undefined);
    const form = react.useContext(context.default);
    const { id } = form;
    const handleChange = (v) => {
        if (!name)
            return;
        form.set(name, v);
        PubSub__default.publish(`${id}:change`, {
            name,
            value: v,
        });
    };
    const hijackChildren = react.useMemo(() => {
        return react.Children.map(children, (node) => {
            if (!react.isValidElement(node))
                return null;
            const { onChange } = node.props;
            return react.cloneElement(node, {
                value: fieldValue,
                status: fieldStatus,
                message: fieldMessage,
                required,
                onChange: (...args) => {
                    handleChange(args[0]);
                    onChange?.(...args);
                    setFieldStatus("normal");
                    setFieldMessage(undefined);
                },
            });
        });
    }, [children, fieldValue, fieldStatus, fieldMessage, required]);
    react.useEffect(() => {
        if (!name)
            return;
        PubSub__default.subscribe(`${id}:set:${name}`, (evt, v) => {
            setFieldValue(v);
        });
        PubSub__default.subscribe(`${id}:invalid:${name}`, (evt, v) => {
            if (v?.value !== undefined)
                setFieldValue(v.value);
            if (v?.status)
                setFieldStatus(v.status);
            if ("message" in (v ?? {}))
                setFieldMessage(v.message);
        });
        Promise.resolve().then(() => {
            form.set(name, form.cacheData[name] ?? undefined);
        });
        return () => {
            PubSub__default.unsubscribe(`${id}:set:${name}`);
            PubSub__default.unsubscribe(`${id}:invalid:${name}`);
            form.delete(name);
        };
    }, [name, children]);
    if (!name)
        return children;
    return hijackChildren;
}

exports.default = Field;
//# sourceMappingURL=field.js.map
