import PubSub from "pubsub-js";
import {
	Children,
	cloneElement,
	isValidElement,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import Context from "./context";
import { IField } from "./type";

function Field(props: IField) {
	const { name, required, children } = props;
	const [fieldValue, setFieldValue] = useState<any>(undefined);
	const [fieldStatus, setFieldStatus] = useState("normal");
	const [fieldMessage, setFieldMessage] = useState<any>(undefined);
	const form = useContext(Context);
	const { id } = form;

	const handleChange = (v) => {
		if (!name) return;

		form.set(name, v);
		PubSub.publish(`${id}:change`, {
			name,
			value: v,
		});
	};

	const hijackChildren = useMemo(() => {
		return Children.map(children, (node) => {
			if (!isValidElement(node)) return null;

			const { onChange } = node.props as any;

			return cloneElement(node, {
				value: fieldValue,
				status: fieldStatus,
				message: fieldMessage,
				required,
				onChange: (...args) => {
					handleChange(args[0]);
					onChange?.(...args);
					setFieldStatus("normal");
					setFieldMessage(undefined);
				},
			} as any);
		});
	}, [children, fieldValue, fieldStatus, fieldMessage, required]);

	useEffect(() => {
		if (!name) return;

		PubSub.subscribe(`${id}:set:${name}`, (evt, v) => {
			setFieldValue(v);
		});
		PubSub.subscribe(`${id}:invalid:${name}`, (evt, v) => {
			if (v?.value !== undefined) setFieldValue(v.value);
			if (v?.status) setFieldStatus(v.status);
			if ("message" in (v ?? {})) setFieldMessage(v.message);
		});

		Promise.resolve().then(() => {
			form.set(name, form.cacheData[name] ?? undefined);
		});

		return () => {
			PubSub.unsubscribe(`${id}:set:${name}`);
			PubSub.unsubscribe(`${id}:invalid:${name}`);
			form.delete(name);
		};
	}, [name, children]);

	if (!name) return children;

	return hijackChildren;
}

export default Field;
