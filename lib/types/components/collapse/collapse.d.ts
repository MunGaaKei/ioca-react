import * as react from 'react';
import Item from './item.js';
import { ICollapse } from './type.js';

declare const Collapse: {
    (props: ICollapse): react.JSX.Element;
    Item: typeof Item;
};

export { Collapse as default };
