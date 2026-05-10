import { memo, useCallback, useEffect, useRef } from "react";
import { useMouseMove, useMouseUp, useReactive } from "../../js/hooks";

type ResizeProps = {
	index: number;
	onWidthChange: (
		index: number,
		width: number,
		phase?: "preview" | "commit",
	) => void;
};

const Resize = memo(function Resize(props: ResizeProps) {
	const { index, onWidthChange } = props;
	const state = useReactive({
		resizing: false,
		x: 0,
		width: 0,
	});

	const rafId = useRef<number | null>(null);
	const nextWidth = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			if (rafId.current != null) cancelAnimationFrame(rafId.current);
		};
	}, []);

	const flush = useCallback(() => {
		rafId.current = null;
		if (nextWidth.current == null) return;
		onWidthChange(index, nextWidth.current, "preview");
	}, [index, onWidthChange]);

	const schedule = useCallback(
		(w: number) => {
			nextWidth.current = w;
			if (rafId.current != null) return;
			rafId.current = requestAnimationFrame(flush);
		},
		[flush],
	);

	const handleMouseDown = (e: any) => {
		const tar = e.target as HTMLElement;
		const width = (tar.offsetParent as HTMLElement).offsetWidth;

		Object.assign(state, {
			x: e.pageX,
			resizing: true,
			width,
		});
	};

	const handleMouseMove = useCallback(
		(e: any) => {
			if (!state.resizing) return;

			e.preventDefault();

			const after = state.width + e.pageX - state.x;
			if (after <= 24) return;

			schedule(after);
		},
		[index, schedule, state],
	);

	const handleMouseUp = useCallback(() => {
		if (!state.resizing) return;

		state.resizing = false;
		const w = nextWidth.current;
		if (rafId.current != null) cancelAnimationFrame(rafId.current);
		rafId.current = null;
		if (w != null) onWidthChange(index, w, "commit");
		nextWidth.current = null;
	}, [index, onWidthChange, state]);

	useMouseMove(handleMouseMove);
	useMouseUp(handleMouseUp);

	return (
		<i
			className='i-datagrid-resizor'
			onMouseDown={handleMouseDown}
			onClick={(e) => e.stopPropagation()}
		/>
	);
});

export default Resize;
