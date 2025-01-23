import List from "../list";
import Popup from "../popup";
import { IDropItem } from "./type";

const { Item: ListItem } = List;

const Item = (props: IDropItem) => {
	const { more, moreProps, onClick, ...restProps } = props;
	const Li = (
		<ListItem
			onClick={(e) => {
				e.stopPropagation();
				onClick?.(e);
			}}
			{...restProps}
		/>
	);

	if (!more) return Li;

	return (
		<Popup
			position='right'
			touchable
			arrow={false}
			align='start'
			offset={10}
			hideDelay={240}
			{...moreProps}
			content={
				<List
					className='i-dropdown-content'
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
