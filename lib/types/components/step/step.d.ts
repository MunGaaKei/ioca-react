import * as react from 'react';
import Item from './item.js';
import { IStep } from './type.js';

declare const Step: {
    (props: IStep): react.JSX.Element;
    Item: typeof Item;
};

export { Step as default };
