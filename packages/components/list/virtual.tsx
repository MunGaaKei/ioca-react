import VList from "rc-virtual-list";
import { IVirtual } from "./type";

const Virtual = (props: IVirtual) => {
	const { data, itemKey, renderItem, ...restProps } = props;

	return (
		<VList data={data} itemKey={itemKey} {...restProps}>
			{(item, i) => {
				return renderItem?.(item, i);
			}}
		</VList>
	);
};

export default Virtual;
