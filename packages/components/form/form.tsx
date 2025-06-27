import classNames from "classnames";
import PubSub from "pubsub-js";
import { CSSProperties, useEffect, useMemo } from "react";
import Context from "./context";
import Field from "./field";
import "./index.css";
import { IForm } from "./type";
import useConfig from "./useConfig";
import useForm, { IFormInstance } from "./useForm";

const Form = (props: IForm) => {
	const {
		form = {} as IFormInstance,
		rules,
		initialValues,
		style,
		className,
		width,
		columns,
		itemMaxWidth,
		gap = "1em",
		labelInline,
		labelWidth,
		labelRight,
		children,
		onKeyDown,
		onEnter,
		onChange,
		...restProps
	} = props;

	const handleKeyDown = (e) => {
		onKeyDown?.(e);

		if (e.keyCode !== 13) return;

		onEnter?.(e, form.data, form);
	};

	const gridColumns = useMemo(() => {
		if (!columns && !itemMaxWidth) return;

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

	return (
		<Context value={form}>
			<form
				style={
					{
						...style,
						width,
						gap,
						gridTemplateColumns: gridColumns as any,
						"--label-width": labelWidth,
						"--label-align": labelRight ? "right" : undefined,
					} as CSSProperties
				}
				className={classNames("i-form", className, {
					"i-form-inline": labelInline,
				})}
				onKeyDown={handleKeyDown}
				{...restProps}
			>
				{children}
			</form>
		</Context>
	);
};

Form.useForm = useForm;
Form.Field = Field;
Form.useConfig = useConfig;

export default Form;
