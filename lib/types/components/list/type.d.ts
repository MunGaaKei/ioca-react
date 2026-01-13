import { HTMLAttributes, ReactNode, RefObject } from 'react';

interface IList extends HTMLAttributes<HTMLUListElement> {
    label?: ReactNode | ((i: number) => ReactNode);
    type?: "option" | "default";
    border?: boolean;
}
interface IListItem extends HTMLAttributes<HTMLLIElement>, Pick<IList, "type" | "border"> {
    ref?: RefObject<HTMLLIElement | null>;
    active?: boolean;
    align?: string;
    disabled?: boolean;
    label?: ReactNode;
}

export type { IList, IListItem };
