import { ReactNode } from 'react';
import { IMessage } from './type.js';

declare function message(config: IMessage | ReactNode): {
    instance: IMessage;
    close: () => void;
};
declare namespace message {
    var error: (content: ReactNode) => {
        instance: IMessage;
        close: () => void;
    };
    var success: (content: ReactNode) => {
        instance: IMessage;
        close: () => void;
    };
    var warning: (content: ReactNode) => {
        instance: IMessage;
        close: () => void;
    };
    var one: (config: IMessage) => void;
}

export { message as default };
