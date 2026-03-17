import { IDropdown, IDropItem } from './type.js';
import * as react from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

declare const Dropdown: {
    (props: IDropdown): string | number | bigint | boolean | react_jsx_runtime.JSX.Element | Iterable<react.ReactNode> | Promise<string | number | bigint | boolean | react.ReactPortal | react.ReactElement<unknown, string | react.JSXElementConstructor<any>> | Iterable<react.ReactNode>>;
    Item: (props: IDropItem) => react_jsx_runtime.JSX.Element;
};

export { Dropdown as default };
