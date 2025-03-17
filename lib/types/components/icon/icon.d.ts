/// <reference types="react" />

import * as react from 'react';
import { IIcon } from './type.js';

declare const Icon: (props: IIcon) => string | number | bigint | boolean | Iterable<react.ReactNode> | Promise<string | number | bigint | boolean | react.ReactPortal | react.ReactElement<unknown, string | react.JSXElementConstructor<any>> | Iterable<react.ReactNode> | null | undefined> | react.ReactElement<unknown, string | react.JSXElementConstructor<any>> | null | undefined;

export { Icon as default };
