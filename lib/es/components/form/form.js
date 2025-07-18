import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import PubSub from 'pubsub-js';
import { useMemo, useEffect } from 'react';
import Context from './context.js';
import Field from './field.js';
import useConfig from './useConfig.js';
import useForm from './useForm.js';

const Form = (props) => {
    const { form = {}, rules, initialValues, style, className, width, columns, itemMaxWidth, gap = "1em", labelInline, labelWidth, labelRight, children, onKeyDown, onEnter, onChange, ...restProps } = props;
    const handleKeyDown = (e) => {
        onKeyDown?.(e);
        if (e.keyCode !== 13)
            return;
        onEnter?.(e, form.data, form);
    };
    const gridColumns = useMemo(() => {
        if (!columns && !itemMaxWidth)
            return;
        if (itemMaxWidth) {
            return `repeat(auto-fill, minmax(${itemMaxWidth}, 1fr))`;
        }
        if (typeof columns === "number") {
            return `minmax(0, 1fr) `.repeat(columns);
        }
        return columns;
    }, [columns]);
    useEffect(() => {
        Object.assign(form, {
            data: { ...initialValues },
            rules,
        });
    }, [form]);
    useEffect(() => {
        PubSub.subscribe(`${form.id}:change`, (evt, v) => {
            onChange?.(v.name, v.value);
        });
        return () => {
            PubSub.unsubscribe(`${form.id}:change`);
        };
    }, []);
    return (jsx(Context, { value: form, children: jsx("form", { style: {
                ...style,
                width,
                gap,
                gridTemplateColumns: gridColumns,
                "--label-width": labelWidth,
                "--label-align": labelRight ? "right" : undefined,
            }, className: classNames("i-form", className, {
                "i-form-inline": labelInline,
            }), onKeyDown: handleKeyDown, ...restProps, children: children }) }));
};
Form.useForm = useForm;
Form.Field = Field;
Form.useConfig = useConfig;

export { Form as default };
//# sourceMappingURL=form.js.map
