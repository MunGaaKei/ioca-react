/// <reference types="react" />

import * as react_jsx_runtime from 'react/jsx-runtime';
import CheckboxItem from './item.js';
import { ICheckbox } from './type.js';

declare function Checkbox(props: ICheckbox): react_jsx_runtime.JSX.Element;
declare namespace Checkbox {
    var Item: typeof CheckboxItem;
}

export { Checkbox as default };
