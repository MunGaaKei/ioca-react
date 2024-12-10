import { useReactive } from "ahooks";
import PubSub from "pubsub-js";
import {
	Children,
	cloneElement,
	isValidElement,
	useCallback,
	useContext,
	useEffect,
	useMemo,
} from "react";
import Context from "./context";
import { IField } from "./type";

function Field(props: IField) {
	const { name, required, children } = props;
	const state = useReactive({
		value: undefined,
		status: "normal",
		message: undefined,
		update: 0,
	});
	const form = useContext(Context);
	const { id } = form;

	const handleChange = useCallback(
		(v) => {
			if (!name) return;

			form.set(name, v);
		},
		[name]
	);

	const hijackChildren = useMemo(() => {
		return Children.map(children, (node) => {
			if (!isValidElement(node)) return null;

			const { onChange } = node.props as any;
			const { value, status, message } = state;

			return cloneElement(node, {
				value,
				status,
				message,
				required,
				onChange: (...args) => {
					handleChange(args[0]);
					onChange?.(...args);
					Object.assign(state, {
						status: "normal",
						message: undefined,
					});
				},
			} as any);
		});
	}, [children, state.update]);

	useEffect(() => {
		if (!name) return;

		PubSub.subscribe(`${id}:set:${name}`, (evt, v) => {
			state.value = v;
			state.update += 1;
		});
		PubSub.subscribe(`${id}:invalid:${name}`, (evt, v) => {
			Object.assign(state, v);
			state.update += 1;
		});

		setTimeout(() => {
			form.data[name] = form.data[name] ?? undefined;
		}, 0);

		return () => {
			PubSub.unsubscribe(`${id}:set:${name}`);
			PubSub.unsubscribe(`${id}:invalid:${name}`);
		};
	}, [name]);

	if (!name) return children;

	return hijackChildren;
}

export default Field;
