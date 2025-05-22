'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var field = require('./field.js');
var form = require('./form.js');
var useForm = require('./useForm.js');

function useConfig(configs, formProps) {
    const form$1 = useForm.default();
    const { onChange } = formProps ?? {};
    const [values, setValues] = react.useState({});
    const handleChange = (name, value) => {
        setValues(() => ({ ...form$1.get() }));
        onChange?.(name, value);
    };
    const node = react.useMemo(() => {
        return (jsxRuntime.jsx(form.default, { ...formProps, onChange: handleChange, form: form$1, children: configs.map((config) => {
                const { name, label, required, component: El, componentProps = {}, colspan = 1, render, shouldUpdate, shouldRender, } = config;
                const { className } = componentProps;
                if (shouldRender && !shouldRender(values, form$1)) {
                    return jsxRuntime.jsx(react.Fragment, {}, name);
                }
                return (jsxRuntime.jsx(field.default, { name: name, required: required, children: render?.(config, values) ?? (jsxRuntime.jsx(El, { label: label, required: required, ...componentProps, className: `${className} ${colspan !== 1
                            ? `colspan-${colspan}`
                            : ""}` })) }, name));
            }) }));
    }, [configs, values]);
    return {
        form: form$1,
        node,
    };
}

exports.default = useConfig;
//# sourceMappingURL=useConfig.js.map
