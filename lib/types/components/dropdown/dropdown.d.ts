import { IDropdown, IDropItem } from './type.js';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';

declare const Dropdown: {
    (props: IDropdown): string | number | bigint | boolean | Iterable<react.ReactNode> | Promise<string | number | bigint | boolean | react.ReactPortal | react.ReactElement<unknown, string | react.JSXElementConstructor<any>> | Iterable<react.ReactNode>> | react_jsx_runtime.JSX.Element;
    Item: (props: IDropItem) => react_jsx_runtime.JSX.Element;
};

export { Dropdown as default };
