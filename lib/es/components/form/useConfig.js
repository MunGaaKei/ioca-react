import { jsx } from 'react/jsx-runtime';
import { useState, useMemo, Fragment } from 'react';
import Field from './field.js';
import Form from './form.js';
import useForm from './useForm.js';

function useConfig(configs, formProps) {
    const form = useForm();
    const { onChange } = formProps ?? {};
    const [values, setValues] = useState({});
    const handleChange = (name, value) => {
        setValues(() => ({ ...form.get() }));
        onChange?.(name, value);
    };
    const node = useMemo(() => {
        return (jsx(Form, { ...formProps, onChange: handleChange, form: form, children: configs.map((config) => {
                const { name, label, required, component: El, componentProps = {}, colspan = 1, render, shouldUpdate, shouldRender, } = config;
                const { className, style } = componentProps;
                if (shouldRender && !shouldRender(values, form)) {
                    return jsx(Fragment, {}, name);
                }
                return (jsx(Field, { name: name, required: required, children: render?.(config, values) ?? (jsx(El, { label: label, required: required, ...componentProps, className: `${className ?? ""} ${colspan !== 1
                            ? `colspan-${colspan}`
                            : ""}` })) }, name));
            }) }));
    }, [configs, values]);
    return {
        form,
        node,
    };
}

export { useConfig as default };
//# sourceMappingURL=useConfig.js.map
