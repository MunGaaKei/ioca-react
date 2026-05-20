import message, { MessageContainer } from './message.js';

declare const Message: typeof message & {
    Container: typeof MessageContainer;
};

export { MessageContainer, Message as default };
