import * as react from 'react';
import { CSSProperties, MouseEventHandler } from 'react';

interface IToTopProps {
    style?: CSSProperties;
    className?: string;
    onClick?: MouseEventHandler<HTMLElement>;
}
declare function ToTop(props: IToTopProps): react.JSX.Element;

export { ToTop as default };
