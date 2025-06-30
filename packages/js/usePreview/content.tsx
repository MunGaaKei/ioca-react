import Button from "@p/components/button";
import Icon from "@p/components/icon";
import {
	AspectRatioRound,
	CloseRound,
	FileDownloadOutlined,
	KeyboardArrowLeftRound,
	KeyboardArrowRightRound,
	OpenInNewRound,
	RotateLeftRound,
	RotateRightRound,
} from "@ricons/material";
import { useReactive } from "ahooks";
import classNames from "classnames";
import { throttle } from "radash";
import { useMemo, useRef } from "react";
import { useMouseMove, useMouseUp } from "../hooks";
import { getFileType, getSuffixByUrl } from "../utils";
import DefaultRenderFile from "./renderFile";
import { IPreview, TFileType, TPreviewItem } from "./type";

export default function Content(props: IPreview) {
	const {
		items = [],
		initial = 0,
		renderFile = DefaultRenderFile,
		onRotate,
		onChange,
		onClose,
		onZoom,
	} = props;
	const state = useReactive({
		current: initial,
		rotate: 0,
		scale: 1,
		translate: [0, 0],
		start: [0, 0],
		dragging: false,
		controlHidden: true,
	});
	const box = useRef<HTMLDivElement>(null);
	const translate = useRef<number[]>([0, 0]);
	const hiddenTO = useRef<any>(null);

	const files = useMemo(() => {
		return items.map((item) => {
			const o: TPreviewItem = {
				src: "",
			};
			if (typeof item === "string") {
				o.src = item;
			} else {
				Object.assign(o, item);
			}

			o.suffix = getSuffixByUrl(o.src) || "";
			o.type = getFileType(o.suffix, item["type"]);

			return o;
		});
	}, [items]);

	const { file, content } = useMemo(() => {
		const file = files[state.current];
		const content = renderFile(file);

		return {
			file,
			content,
		};
	}, [state.current, items]);

	const isImage = file.type === TFileType.IMAGE;

	const handleSwitch = (next: number) => {
		const l = files.length;
		const { current: before } = state;
		if (next >= l) {
			state.current = 0;
		} else if (next < 0) {
			state.current = l - 1;
		} else {
			state.current = next;
		}
		onChange?.(state.current, before);

		state.rotate = files[state.current].rotate || 0;

		if (state.scale !== 1) {
			state.scale = 1;
			onZoom?.(1);
		}
		onRotate?.(state.rotate);
		state.translate = translate.current = [0, 0];
	};

	const handleRotate = (deg: number) => {
		state.rotate += deg;

		onRotate?.(state.rotate);
	};

	const handleMouseWheel = throttle({ interval: 60 }, (e) => {
		e.stopPropagation();
		e.preventDefault();
		if (!isImage) return;
		let after = state.scale + (e.deltaY < 0 ? 0.05 : -0.05);
		if (after > 2) after = 2;
		if (after < 0.25) after = 0.25;

		onZoom?.(after);
		state.scale = after;
	});

	const handleMouseDown = (e) => {
		if (!isImage) return;
		e.preventDefault();
		state.dragging = true;
		state.start = [e.pageX, e.pageY];
	};

	const clearHiddenTO = () => {
		if (!hiddenTO.current || state.controlHidden) return;
		clearTimeout(hiddenTO.current);
		hiddenTO.current = null;
	};

	const setHiddenFalse = () => {
		if (!state.controlHidden) return;
		state.controlHidden = false;

		clearHiddenTO();
		hiddenTO.current = setTimeout(() => {
			state.controlHidden = true;
		}, 1000);
	};

	const throttleMouseMove = throttle({ interval: 300 }, setHiddenFalse);

	const handleMouseMove = (e) => {
		throttleMouseMove();
		if (!state.dragging) return;
		e.preventDefault();

		const [x, y] = translate.current;
		const [ox, oy] = state.start;
		const offsetX = e.pageX - ox;
		const offsetY = e.pageY - oy;

		state.translate = [x + offsetX, y + offsetY];
	};

	const handleMouseUp = () => {
		if (!state.dragging) return;
		state.dragging = false;
		translate.current = state.translate;
	};

	useMouseMove(handleMouseMove);
	useMouseUp(handleMouseUp);

	return (
		<>
			<div
				ref={box}
				className={classNames("i-preview-content", {
					"no-transition": state.dragging,
				})}
				style={{
					transform: `translate(${state.translate
						.map((n) => `${n}px`)
						.join(",")}) rotate(${state.rotate}deg) scale(${
						state.scale
					})`,
				}}
				onWheel={handleMouseWheel}
				onMouseDown={handleMouseDown}
				onClick={(e) => e.stopPropagation()}
			>
				{content}
			</div>

			<div
				className={classNames("i-preview-controls", {
					"i-preview-controls-hidden": state.controlHidden,
				})}
			>
				<Button square flat onClick={onClose}>
					<Icon icon={<CloseRound />} />
				</Button>
				{files.length > 1 && (
					<span className='px-8'>
						{state.current + 1} / {files.length}
					</span>
				)}
				{state.scale !== 1 && (
					<Button flat onClick={() => (state.scale = 1)}>
						<Icon icon={<AspectRatioRound />} />
						<span className='mt-2'>
							{(state.scale * 100).toFixed(0)}%
						</span>
					</Button>
				)}
				<Button square flat href={file.src} target='_blank'>
					<Icon icon={<OpenInNewRound />} />
				</Button>
				<Button square flat href={file.src} download target='_blank'>
					<Icon icon={<FileDownloadOutlined />} />
				</Button>
				<Button square flat onClick={() => handleRotate(90)}>
					<Icon icon={<RotateRightRound />} />
				</Button>
				<Button square flat onClick={() => handleRotate(-90)}>
					<Icon icon={<RotateLeftRound />} />
				</Button>

				{files.length > 1 && (
					<>
						<Button
							square
							flat
							onClick={() => handleSwitch(state.current - 1)}
						>
							<Icon icon={<KeyboardArrowLeftRound />} />
						</Button>
						<Button
							square
							flat
							onClick={() => handleSwitch(state.current + 1)}
						>
							<Icon icon={<KeyboardArrowRightRound />} />
						</Button>
					</>
				)}
			</div>
		</>
	);
}
