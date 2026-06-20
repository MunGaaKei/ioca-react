import { useMemo, useRef, useState } from "react";
import List from "../list";
import Popup from "../popup";
import { useDropdown } from "./dropdown";
import { IDropItem } from "./type";

const { Item: ListItem } = List;

const Item = (props: IDropItem) => {
    const { more, moreProps, onClick, ref: itemRef, type = "option", children, ...restProps } = props;
    const { close, border = true } = useDropdown();
    const liRef = useRef<HTMLLIElement>(null);
    const [position, setPosition] = useState<"left" | "right">("right");

    const { position: morePosition, onVisibleChange: moreOnVisibleChange, width: moreWidth, ...restMoreProps } = moreProps ?? {};
    const effectivePosition = morePosition ?? position;

    const rafRef = useRef<number>(0);
    const handleVisibleChange = (v: boolean) => {
        if (v && liRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                if (!liRef.current) return;
                const rect = liRef.current.getBoundingClientRect();
                setPosition(rect.left > window.innerWidth / 2 ? "left" : "right");
            });
        }
        moreOnVisibleChange?.(v);
    };

    const Li = useMemo(
        () => (
            <ListItem
                ref={itemRef ?? liRef}
                role="menuitem"
                aria-haspopup={more ? "menu" : undefined}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!more) close?.();
                    onClick?.(e);
                }}
                type={type}
                {...restProps}
            >
                {children}
            </ListItem>
        ),
        [itemRef, liRef, more, close, onClick, type, restProps, children],
    );

    if (!more) return Li;

    return (
        <Popup
            border={border}
            {...restMoreProps}
            position={effectivePosition}
            touchable
            arrow={false}
            align="start"
            offset={8}
            hideDelay={240}
            onVisibleChange={handleVisibleChange}
            content={
                <List type="option" padding={4} className="i-dropdown-content" style={{ minWidth: moreWidth }} onClick={(e) => e.stopPropagation()}>
                    {more}
                </List>
            }
        >
            {Li}
        </Popup>
    );
};

export default Item;
