import { Fragment, useMemo, useState } from "react";
import Field from "./field";
import Form from "./form";
import { IForm, IFormItem } from "./type";
import useForm from "./useForm";

export default function useConfig(configs: IFormItem[], formProps?: IForm) {
	const form = useForm();
	const { onChange } = formProps ?? {};
	const [values, setValues] = useState({});

	const handleChange = (name, value) => {
		setValues(() => ({ ...form.get() }));
		onChange?.(name, value);
	};

	const node = useMemo(() => {
		return (
			<Form {...formProps} onChange={handleChange} form={form}>
				{configs.map((config) => {
					const {
						name,
						label,
						required,
						component: El,
						componentProps = {},
						colspan = 1,
						render,
						shouldUpdate,
						shouldRender,
					} = config;
					const { className, style } = componentProps;

					if (shouldRender && !shouldRender(values, form)) {
						return <Fragment key={name} />;
					}

					return (
						<Field key={name} name={name} required={required}>
							{render?.(config, values) ?? (
								<El
									label={label}
									required={required}
									{...componentProps}
									className={`${className ?? ""} ${
										colspan !== 1
											? `colspan-${colspan}`
											: ""
									}`}
								/>
							)}
						</Field>
					);
				})}
			</Form>
		);
	}, [configs, values]);

	return {
		form,
		node,
	};
}
