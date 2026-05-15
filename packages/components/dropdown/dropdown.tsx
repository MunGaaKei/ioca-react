import { createContext, useEffect, useState } from "react";
import List from "../list";
import Popup from "../popup";
import "./index.css";
import Item from "./item";
import { IDropdown } from "./type";

export const DropdownCloseCtx = createContext<(() => void) | null>(null);

const Dropdown = (props: IDropdown) => {
	const { visible, width, content, children, ...restProps } = props;
	const [active, setActive] = useState(visible);

	if (!content) {
		return children;
	}

	const close = () => setActive(false);

	const handleVisibleChange = (v: boolean) => {
		setActive(v);
		if (props.onVisibleChange) {
			props.onVisibleChange(v);
		}
	};

	useEffect(() => {
		setActive(visible);
	}, [visible]);

	return (
		<Popup
			trigger='click'
			position='bottom'
			content={
				<DropdownCloseCtx.Provider value={close}>
					<List
						className='i-dropdown-content'
						style={{ minWidth: width }}
					>
						{typeof content === "function"
							? content(close)
							: content}
					</List>
				</DropdownCloseCtx.Provider>
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
