import { useContext, useRef, useState } from "react";
import List from "../list";
import Popup from "../popup";
import { DropdownCloseCtx } from "./dropdown";
import { IDropItem } from "./type";

const { Item: ListItem } = List;

const Item = (props: IDropItem) => {
    const {
        more,
        moreProps,
        onClick,
        ref: itemRef,
        children,
        ...restProps
    } = props;
    const close = useContext(DropdownCloseCtx);
    const liRef = useRef<HTMLLIElement>(null);
    const [position, setPosition] = useState<"left" | "right">("right");

    const {
        position: morePosition,
        onVisibleChange: moreOnVisibleChange,
        width: moreWidth,
        ...restMoreProps
    } = moreProps ?? {};
    const effectivePosition = morePosition ?? position;

    const handleVisibleChange = (v: boolean) => {
        if (v && liRef.current) {
            const rect = liRef.current.getBoundingClientRect();
            setPosition(rect.left > window.innerWidth / 2 ? "left" : "right");
        }
        moreOnVisibleChange?.(v);
    };

    const Li = (
        <ListItem
            ref={itemRef ?? liRef}
            onClick={(e) => {
                e.stopPropagation();
                if (!more) close?.();
                onClick?.(e);
            }}
            {...restProps}
        >
            {children}
        </ListItem>
    );

    if (!more) return Li;

    return (
        <Popup
            {...restMoreProps}
            position={effectivePosition}
            touchable
            arrow={false}
            align="start"
            offset={11}
            hideDelay={240}
            onVisibleChange={handleVisibleChange}
            content={
                <List
                    className="i-dropdown-content"
                    style={{ minWidth: moreWidth }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {more}
                </List>
            }
        >
            {Li}
        </Popup>
    );
};

export default Item;
