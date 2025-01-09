import { MouseEvent, ReactNode } from "react";
import { Root, createRoot } from "react-dom/client";
import { TFileType } from "../js/usePreview/type";
import { TOption, TOptions, TRelativeOptions } from "../type";

type TComputePosition = {
	containerSize: number;
	targetSize: number;
	targetOffset: number;
	contentSize: number;
	gap: number;
	align?: "start" | "center" | "end";
};

export function getPosition(
	$source?: HTMLElement | null,
	$popup?: HTMLElement | null,
	options: TRelativeOptions = {}
): [
	x: number,
	y: number,
	z: {
		arrowX: number;
		arrowY: number;
		arrowPos: string;
	}
] {
	const { refWindow, gap = 0, offset = 0, position = "top", align } = options;

	if (!$source || !$popup)
		return [
			0,
			0,
			{
				arrowX: 0,
				arrowY: 0,
				arrowPos: "bottom",
			},
		];

	const rectT = $source.getBoundingClientRect();
	const rectC = $popup.getBoundingClientRect();

	let w = window.innerWidth;
	let h = window.innerHeight;
	let {
		left: tl,
		top: tt,
		right: tr,
		bottom: tb,
		width: tw,
		height: th,
	} = rectT;
	const { height: ch, width: cw } = rectC;

	if (!refWindow) {
		const rectPa = $source.offsetParent?.getBoundingClientRect();

		w = rectPa?.width || w;
		h = rectPa?.height || h;
		tl = $source.offsetLeft;
		tt = $source.offsetTop;
		tr = tl + rectT.width;
		tb = tt + rectT.height;
	}

	let y = 0;
	let x = 0;
	let arrowX = 0;
	let arrowY = 0;
	let arrowPos = "bottom";

	switch (position) {
		case "left":
		case "right":
			y =
				th !== ch
					? computePosition({
							containerSize: h,
							targetSize: th,
							targetOffset: tt,
							contentSize: ch,
							gap,
							align,
					  })
					: tt;
			arrowY = y < tt ? tt - y + th / 2 : th / 2;

			const xl = tl - offset - cw;
			const xr = tr + offset + cw;

			if (position === "left") {
				const R = xl < 0 && xr <= w;
				x = R ? tr + offset : xl;
				arrowX = R ? 0 : cw;
				arrowPos = R ? "left" : "right";
			} else {
				const R = w > xr || xl < 0;
				x = R ? tr + offset : xl;
				arrowX = R ? 0 : cw;
				arrowPos = R ? "left" : "right";
			}

			break;
		case "top":
		case "bottom":
			x =
				tw !== cw
					? computePosition({
							containerSize: w,
							targetOffset: tl,
							targetSize: tw,
							contentSize: cw,
							gap,
							align,
					  })
					: tl;
			arrowX = x > tl ? cw / 2 : tl - x + tw / 2;

			const yt = tt - offset - ch;
			const yb = tb + offset + ch;
			if (position === "top") {
				const T = yt < 0 && yb <= h;
				y = T ? tb + offset : yt;
				arrowY = T ? 0 : ch;
				arrowPos = T ? "top" : "bottom";
			} else {
				const B = h > yb || yt < 0;
				y = B ? tb + offset : yt;
				arrowY = B ? 0 : ch;
				arrowPos = B ? "top" : "bottom";
			}
			break;
		default:
			break;
	}

	return [
		x,
		y,
		{
			arrowX,
			arrowY,
			arrowPos,
		},
	];
}

export function getPointPosition(e: MouseEvent, content: HTMLElement) {
	const { pageX: x, pageY: y } = e;
	const { width: w, height: h } = content.getBoundingClientRect();
	const { innerHeight: wh, innerWidth: ww } = window;

	const left = x + w >= ww ? (x - w > 0 ? x - w : x) : x;
	const top = y + h >= wh ? (y - h > 0 ? y - h : y) : y;

	return [left, top];
}

function computePosition({
	containerSize,
	targetSize,
	targetOffset,
	contentSize,
	gap,
	align = "center",
}: TComputePosition) {
	const centerPoint = targetOffset + targetSize / 2;

	switch (align) {
		case "start":
			return targetOffset + contentSize > containerSize
				? targetOffset + targetSize
				: targetOffset;
		case "center":
			if (targetSize >= contentSize) {
				return centerPoint - contentSize / 2;
			}

			if (centerPoint + contentSize / 2 + gap > containerSize) {
				return targetOffset + targetSize - contentSize;
			}

			if (centerPoint - contentSize / 2 - gap < 0) {
				return gap;
			}

			return centerPoint - contentSize / 2;
		case "end":
			const result = targetOffset + targetSize - contentSize;
			return result > 0 ? result : gap;
		default:
			return centerPoint - contentSize / 2;
	}
}

export function formatOption(options: TOptions): TOption[] {
	return options.map((option) =>
		["string", "number"].includes(typeof option)
			? { label: option, value: option }
			: option
	) as TOption[];
}

export function animate(
	from: number,
	to: number,
	duration: number = 1000,
	callback?: (v: number) => void,
	easing: (t: number) => number = (t) => 1 - Math.pow(1 - t, 4)
) {
	const start = performance.now();
	const diff = to - from;
	let raf = requestAnimationFrame(loop);

	function loop() {
		raf = requestAnimationFrame(loop);

		const past = performance.now() - start;
		let percent = past / duration;

		if (percent >= 1) {
			percent = 1;
			cancelAnimationFrame(raf);
		}

		const pass = diff * easing(percent);
		callback?.(pass);
	}
}

export function formatNumber(
	value: number,
	options: {
		precision?: number;
		thousand?: string;
	} = {}
) {
	const { precision, thousand } = options;

	const result = value.toFixed(precision);

	if (!thousand) return result;

	const points = result.split(".");
	const integer = points[0].replace(
		/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
		`$&${thousand}`
	);

	if (points.length === 1) return integer;

	return `${integer}.${points[1]}`;
}

export function renderNode(node: ReactNode, container = document.body) {
	const div: HTMLDivElement | null = document.createElement("div");
	container.append(div);

	const root: Root | null = createRoot(div);
	const sto = setTimeout(() => {
		root?.render(node);
	}, 0);

	return () => {
		div?.remove();
		root?.unmount();
		sto && clearTimeout(sto);
	};
}

export function getSuffixByUrl(url: string) {
	return url.match(/\.([^\./\?]+)($|\?)/)?.[1];
}

export function getFileType(suffix: string, type?: string): TFileType {
	switch (true) {
		case ["jpg", "jpeg", "png", "webp", "svg"].includes(suffix) ||
			type?.startsWith("image/"):
			return TFileType["IMAGE"];
		case ["mp4", "avi"].includes(suffix) || type?.startsWith("video/"):
			return TFileType["VIDEO"];
		default:
			return TFileType["UNKNOWN"];
	}
}

export function fullScreen(el: HTMLElement) {
	el.requestFullscreen?.();
}

export function exitFullScreen() {
	document.exitFullscreen?.();
}

export function formatTime(
	time: number,
	options?: {
		zero?: boolean;
		units?: string[];
	}
) {
	const result: string[] = [];
	const { zero = true, units = ["", ":", ":"] } = options || {};

	const l = units.length;
	let i = 0;

	while (i < l) {
		if (time <= 0 && i > 1) break;

		const n = Math.round(time % 60);

		time = Math.floor(time / 60);

		result.unshift((zero && n < 10 ? `0${n}` : n) + units[i++]);
	}

	return result.join("");
}

export function getNextSorter(
	prevSortBy: string,
	prevSortType: string,
	sortBy: string
): [sortBy: string, sortType: string] {
	const types = ["desc", "asc"];

	if (prevSortBy === sortBy) {
		const i = types.findIndex((t) => t === prevSortType) + 1;
		const type = types[i] || "";
		const by = type === "" ? "" : sortBy;

		return [by, type];
	}

	return [sortBy, "desc"];
}

export function formatBytes(bytes: number, decimals = 2) {
	if (!+bytes) return "0 Bytes";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function clamp(value: number, min: number, max: number) {
	return value < min ? min : value > max ? max : value;
}
