import { useReactive } from "ahooks";
import { useMouseMove, useMouseUp } from "../../js/hooks";

export default function Resize(props) {
	const { index, onWidthChange } = props;
	const state = useReactive({
		resizing: false,
		x: 0,
		width: 0,
	});

	const handleMouseDown = (e) => {
		const tar = e.target as HTMLElement;
		const width = (tar.offsetParent as HTMLElement).offsetWidth;

		Object.assign(state, {
			x: e.pageX,
			resizing: true,
			width,
		});
	};

	const handleMouseMove = (e) => {
		if (!state.resizing) return;

		e.preventDefault();

		const after = state.width + e.pageX - state.x;
		if (after <= 24) return;

		onWidthChange(index, after);
	};

	const handleMouseUp = () => {
		if (!state.resizing) return;

		state.resizing = false;
	};

	useMouseMove(handleMouseMove);
	useMouseUp(handleMouseUp);

	return (
		<i
			className='i-datagrid-resizor'
			onMouseDown={handleMouseDown}
			onClick={(e) => e.stopPropagation()}
		/>
	);
}
