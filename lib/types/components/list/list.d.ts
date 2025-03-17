/// <reference types="react" />

import { IList, IListItem } from './type.js';
import * as react_jsx_runtime from 'react/jsx-runtime';

declare const List: {
    (props: IList): react_jsx_runtime.JSX.Element;
    Item: (props: IListItem) => react_jsx_runtime.JSX.Element;
};

export { List as default };
