import Api from "./components/api";
import Demo from "./components/demo";
import { DBasic, PColumn, PDatagrid } from "./components/props/datagrid";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Datagrid</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<h4 className='mb-20 blue'>Datagrid</h4>
			<Api apis={PDatagrid} />

			<h4 id='i-column' className='mt-40 mb-20 blue'>
				IColumn
			</h4>
			<Api apis={PColumn} />
		</>
	);
}
