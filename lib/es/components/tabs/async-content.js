import { jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';

const AsyncContent = (props) => {
    const { load, loader } = props;
    const [state, setState] = useState({ status: "loading" });
    useEffect(() => {
        let cancelled = false;
        setState({ status: "loading" });
        load()
            .then((module) => {
            if (!cancelled) {
                setState({ status: "loaded", Component: module.default });
            }
        })
            .catch((error) => {
            if (!cancelled) {
                setState({ status: "error", error });
            }
        });
        return () => {
            cancelled = true;
        };
    }, [load]);
    switch (state.status) {
        case "loaded":
            return jsx(state.Component, {});
        case "error":
            return null;
        case "loading":
        default:
            return loader ?? null;
    }
};

export { AsyncContent as default };
