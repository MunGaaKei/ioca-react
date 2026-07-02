import * as react from 'react';
import RadioItem from './item.js';
import { IRadio } from './type.js';

declare function Radio(props: IRadio): react.JSX.Element;
declare namespace Radio {
    var Item: typeof RadioItem;
}

export { Radio as default };
