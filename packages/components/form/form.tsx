import classNames from "classnames";
import { useEffect, useMemo } from "react";
import Context from "./context";
import Field from "./field";
import "./index.css";
import { IForm } from "./type";
import useForm, { IFormInstance } from "./useForm";

const Form = (props: IForm) => {
	const {
		form = {} as IFormInstance,
		rules,
		initialValues,
		style,
		className,
		width,
		columns = 1,
		gap = "1em",
		children,
		onEnter,
		...restProps
	} = props;

	const handleEnter = (e) => {
		if (e.keyCode !== 13) return;

		onEnter?.(form.data, form);
	};

	const gridColumns = useMemo(() => {
		if (!columns) return;

		if (typeof columns === "number")
			return `minmax(0, 1fr) `.repeat(columns);

		return columns;
	}, [columns]);

	useEffect(() => {
		Object.assign(form, {
			data: { ...initialValues },
			rules,
		});
	}, [form]);

	return (
		<Context value={form}>
			<form
				style={{
					...style,
					width,
					gap,
					gridTemplateColumns: gridColumns as any,
				}}
				className={classNames("i-form", className)}
				onKeyDown={handleEnter}
				{...restProps}
			>
				{children}
			</form>
		</Context>
	);
};

Form.useForm = useForm;
Form.Field = Field;

export default Form;
