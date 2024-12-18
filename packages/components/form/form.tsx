import classNames from "classnames";
import { useEffect } from "react";
import Context from "./context";
import Field from "./field";
import "./index.css";
import { IForm } from "./type";
import useForm, { IFormInstance } from "./useForm";

const Form = (props: IForm): JSX.Element => {
	const {
		form = {} as IFormInstance,
		rules,
		initialValues,
		style,
		className,
		width,
		children,
		...restProps
	} = props;

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
