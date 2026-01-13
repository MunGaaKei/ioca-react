import { ReactNode } from 'react';
import { IMessage } from './type.js';

declare function message(config: IMessage | ReactNode): {
    instance: IMessage;
    close: any;
};
declare namespace message {
    var error: (content: ReactNode) => {
        instance: IMessage;
        close: any;
    };
    var success: (content: ReactNode) => {
        instance: IMessage;
        close: any;
    };
    var warning: (content: ReactNode) => {
        instance: IMessage;
        close: any;
    };
    var info: (content: ReactNode) => {
        instance: IMessage;
        close: any;
    };
    var one: (config: IMessage) => void;
}

export { message as default };
