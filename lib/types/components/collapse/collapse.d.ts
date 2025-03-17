/// <reference types="react" />

import * as react_jsx_runtime from 'react/jsx-runtime';
import Item from './item.js';
import { ICollapse } from './type.js';

declare const Collapse: {
    (props: ICollapse): react_jsx_runtime.JSX.Element;
    Item: typeof Item;
};

export { Collapse as default };
