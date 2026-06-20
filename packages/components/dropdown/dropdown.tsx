import { createContext, useCallback, useContext, useEffect, useState } from "react";
import List from "../list";
import Popup from "../popup";
import "./index.css";
import Item from "./item";
import { IDropdown } from "./type";

export const DropdownContext = createContext<{
    close: () => void;
    border?: boolean;
}>({ close: () => {} });

export const useDropdown = () => useContext(DropdownContext);

const Dropdown = (props: IDropdown) => {
    const { visible, width, content, children, ...restProps } = props;
    const [active, setActive] = useState(visible);

    if (!content) {
        return children;
    }

    const close = useCallback(() => setActive(false), []);

    const handleVisibleChange = useCallback(
        (v: boolean) => {
            setActive(v);
            props.onVisibleChange?.(v);
        },
        [props.onVisibleChange],
    );

    useEffect(() => {
        setActive(visible);
    }, [visible]);

    return (
        <Popup
            trigger="click"
            position="bottom"
            border
            content={
                <DropdownContext.Provider value={{ close, border: props.border }}>
                    <List type="option" className="i-dropdown-content" style={{ minWidth: width }} role="menu">
                        {typeof content === "function" ? content(close) : content}
                    </List>
                </DropdownContext.Provider>
            }
            {...restProps}
            touchable
            visible={active}
            onVisibleChange={handleVisibleChange}
        >
            {children}
        </Popup>
    );
};

Dropdown.Item = Item;

export default Dropdown;
