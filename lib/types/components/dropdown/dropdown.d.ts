import { IDropdown, IDropItem } from './type.js';
import * as react from 'react';

declare const Dropdown: {
    (props: IDropdown): string | number | bigint | boolean | react.JSX.Element | Iterable<react.ReactNode> | Promise<string | number | bigint | boolean | react.ReactPortal | react.ReactElement<unknown, string | react.JSXElementConstructor<any>> | Iterable<react.ReactNode>>;
    Item: (props: IDropItem) => react.JSX.Element;
};

export { Dropdown as default };
