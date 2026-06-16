import { ReactNode } from 'react';
import { IMessageConfig, IMessage, IMessageContainerProps } from './type.js';

declare function message(config: IMessageConfig | ReactNode): {
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
    var one: (config: IMessageConfig) => void;
}
declare function MessageContainer({ align, fromBottom, unshift, gap, offset, duration, }: IMessageContainerProps): any;

export { MessageContainer, message as default };
