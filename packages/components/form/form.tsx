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
		rules = {},
		initialValues = {},
		style,
		className,
		width,
		children,
		...rest
	} = props;

	useEffect(() => {
		Object.assign(form, {
			data: { ...initialValues },
			rules: { ...rules },
		});
	}, [form, rules]);

	return (
		<Context.Provider value={form}>
			<form
				style={{ ...style, width }}
				className={classNames("i-form", className)}
				{...rest}
			>
				{children}
			</form>
		</Context.Provider>
	);
};

Form.useForm = useForm;
Form.Field = Field;

export default Form;
