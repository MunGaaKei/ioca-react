import { useState } from "react";
import List from "../list";
import Popup from "../popup";
import "./index.css";
import Item from "./item";
import { IDropdown } from "./type";

const Dropdown = (props: IDropdown) => {
	const { visible, width, content, children, ...restProps } = props;
	const [active, setActive] = useState(visible);

	return (
		<Popup
			trigger='click'
			position='bottom'
			content={
				<List
					className='i-dropdown-content'
					style={{ minWidth: width }}
				>
					{typeof content === "function"
						? content(() => setActive(false))
						: content}
				</List>
			}
			{...restProps}
			touchable
			visible={active}
			onVisibleChange={setActive}
		>
			{children}
		</Popup>
	);
};

Dropdown.Item = Item;

export default Dropdown;
