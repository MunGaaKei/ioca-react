/// <reference types="react" />

import { IPreview } from './type.js';

declare function usePreview(): (config: IPreview) => void;

export { usePreview as default };
