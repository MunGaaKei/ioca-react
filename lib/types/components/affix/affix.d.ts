import * as react from 'react';
import ToTop from './totop.js';
import { IAffix } from './type.js';

declare const Affix: {
    (props: IAffix): react.JSX.Element;
    ToTop: typeof ToTop;
};

export { Affix as default };
