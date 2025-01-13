import classNames from "classnames";
import { useEffect } from "react";
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
		children,
		onEnter,
		...restProps
	} = props;

	const handleEnter = (e) => {
		if (e.keyCode !== 13) return;

		onEnter?.(form.data, form);
	};

	useEffect(() => {
		Object.assign(form, {
			data: { ...initialValues },
			rules,
		});
	}, [form]);

	return (
		<Context.Provider value={form}>
			<form
				style={{ ...style, width }}
				className={classNames("i-form", className)}
				onKeyDown={handleEnter}
				{...restProps}
			>
				{children}
			</form>
		</Context.Provider>
	);
};

Form.useForm = useForm;
Form.Field = Field;

export default Form;
