import message, { MessageContainer } from "./message";

const Message = Object.assign(message, { Container: MessageContainer });

export { MessageContainer };
export default Message;
