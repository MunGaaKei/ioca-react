import { ComponentType, ReactNode, useEffect, useState } from "react";

interface IAsyncContentProps {
    load: () => Promise<{ default: ComponentType<any> }>;
    loader?: ReactNode;
}

type TAsyncContentState = { status: "loading" } | { status: "loaded"; Component: ComponentType<any> } | { status: "error"; error: Error };

const AsyncContent = (props: IAsyncContentProps) => {
    const { load, loader } = props;
    const [state, setState] = useState<TAsyncContentState>({ status: "loading" });

    useEffect(() => {
        let cancelled = false;
        setState({ status: "loading" });

        load()
            .then((module) => {
                if (!cancelled) {
                    setState({ status: "loaded", Component: module.default });
                }
            })
            .catch((error: Error) => {
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
            return <state.Component />;
        case "error":
            return null;
        case "loading":
        default:
            return loader ?? null;
    }
};

export default AsyncContent;
