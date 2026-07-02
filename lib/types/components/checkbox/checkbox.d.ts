import * as react from 'react';
import CheckboxItem from './item.js';
import { ICheckbox } from './type.js';

declare function Checkbox(props: ICheckbox): react.JSX.Element;
declare namespace Checkbox {
    var Item: typeof CheckboxItem;
}

export { Checkbox as default };
