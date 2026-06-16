import * as react_jsx_runtime from 'react/jsx-runtime';
import Item from './item.js';
import { IStep } from './type.js';

declare const Step: {
    (props: IStep): react_jsx_runtime.JSX.Element;
    Item: typeof Item;
};

export { Step as default };
