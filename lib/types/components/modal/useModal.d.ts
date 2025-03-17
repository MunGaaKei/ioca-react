/// <reference types="react" />

import { IModal } from './type.js';

declare function useModal(): {
    open: (props: IModal) => void;
    update: (props: IModal) => void;
    close: () => void;
};

export { useModal as default };
