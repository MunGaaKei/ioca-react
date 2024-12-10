import List from "../list";
import Popup from "../popup";
import { IDropItem } from "./type";

const { Item: ListItem } = List;

const Item = (props: IDropItem) => {
	const { more, moreProps, ...restProps } = props;
	const Li = <ListItem {...restProps} />;

	if (!more) return Li;

	return (
		<Popup
			position='right'
			touchable
			arrow={false}
			align='start'
			offset={10}
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
