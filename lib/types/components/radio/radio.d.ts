/// <reference types="react" />

import * as react_jsx_runtime from 'react/jsx-runtime';
import RadioItem from './item.js';
import { IRadio } from './type.js';

declare function Radio(props: IRadio): react_jsx_runtime.JSX.Element;
declare namespace Radio {
    var Item: typeof RadioItem;
}

export { Radio as default };
