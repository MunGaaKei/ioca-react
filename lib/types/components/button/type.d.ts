import { ForwardRefExoticComponent, RefAttributes, ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode, CSSProperties, RefObject } from 'react';
import { LinkProps } from 'react-router';
import Group from './group.js';
import Toggle from './toggle.js';

interface BaseButtonProps {
    as?: "a" | "button" | ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>>;
    ref?: RefObject<HTMLElement | null>;
    children?: ReactNode | string;
    className?: string;
    loading?: boolean;
    flat?: boolean;
    outline?: boolean;
    square?: boolean;
    size?: "mini" | "small" | "normal" | "large" | "extreme";
    disabled?: boolean;
    block?: boolean;
    round?: boolean;
    ripple?: boolean;
    secondary?: boolean;
}
interface IButton extends BaseButtonProps, Omit<ButtonHTMLAttributes<HTMLElement>, "type" | "onToggle">, Omit<AnchorHTMLAttributes<HTMLElement>, "onToggle"> {
}
interface IButtonToggle extends IButton {
    active?: boolean;
    activeClass?: string;
    after?: ReactNode;
    disabled?: boolean;
    toggable?: () => boolean | Promise<boolean>;
    onToggle?: (active: boolean) => void;
}
interface IButtonGroup {
    children?: ReactNode;
    vertical?: boolean;
    buttonProps?: IButton;
    className?: string;
    style?: CSSProperties;
}
interface CompositionButton extends ForwardRefExoticComponent<IButton & RefAttributes<HTMLElement>> {
    Toggle: typeof Toggle;
    Group: typeof Group;
}

export type { CompositionButton, IButton, IButtonGroup, IButtonToggle };
