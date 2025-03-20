'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var PubSub = require('pubsub-js');
var react = require('react');
var context = require('./context.js');
var field = require('./field.js');
var useConfig = require('./useConfig.js');
var useForm = require('./useForm.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);
var PubSub__default = /*#__PURE__*/_interopDefaultCompat(PubSub);

const Form = (props) => {
    const { form = {}, rules, initialValues, style, className, width, columns = 1, gap = "1em", labelInline, labelWidth, labelRight, children, onKeyDown, onEnter, onChange, ...restProps } = props;
    const handleKeyDown = (e) => {
        onKeyDown?.(e);
        if (e.keyCode !== 13)
            return;
        onEnter?.(form.data, form);
    };
    const gridColumns = react.useMemo(() => {
        if (!columns)
            return;
        if (typeof columns === "number")
            return `minmax(0, 1fr) `.repeat(columns);
        return columns;
    }, [columns]);
    react.useEffect(() => {
        Object.assign(form, {
            data: { ...initialValues },
            rules,
        });
    }, [form]);
    react.useEffect(() => {
        PubSub__default.subscribe(`${form.id}:change`, (evt, v) => {
            onChange?.(v.name, v.value);
        });
        return () => {
            PubSub__default.unsubscribe(`${form.id}:change`);
        };
    }, []);
    return (jsxRuntime.jsx(context.default, { value: form, children: jsxRuntime.jsx("form", { style: {
                ...style,
                width,
                gap,
                gridTemplateColumns: gridColumns,
                "--label-width": labelWidth,
                "--label-align": labelRight ? "right" : undefined,
            }, className: classNames__default("i-form", className, {
                "i-form-inline": labelInline,
            }), onKeyDown: handleKeyDown, ...restProps, children: children }) }));
};
Form.useForm = useForm.default;
Form.Field = field.default;
Form.useConfig = useConfig.default;

exports.default = Form;
//# sourceMappingURL=form.js.map
