import * as react_jsx_runtime from 'react/jsx-runtime';
import { CSSProperties, MouseEventHandler } from 'react';

interface IToTopProps {
    style?: CSSProperties;
    className?: string;
    onClick?: MouseEventHandler<HTMLElement>;
}
declare function ToTop(props: IToTopProps): react_jsx_runtime.JSX.Element;

export { ToTop as default };
