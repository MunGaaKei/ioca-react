import { HideImageTwotone } from "@ricons/material";
import { useReactive } from "ahooks";
import classNames from "classnames";
import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "../../js/hooks";
import usePreview from "../../js/usePreview";
import Icon from "../icon";
import Loading from "../loading";
import "./index.css";
import List from "./list";
import type { CompositionImage, IImage } from "./type";

const Image = (props: IImage) => {
	const {
		src,
		thumb,
		round,
		size,
		height,
		width,
		ratio,
		initSize,
		lazyload,
		fallback = (
			<Icon icon={<HideImageTwotone />} size='2em' className='color-5' />
		),
		fit,
		style,
		className,
		cover,
		coverClass,
		usePreview: previewable,
		onLoad,
		onError,
		onClick,
		...restProps
	} = props;

	const state = useReactive<{ status?: string }>({
		status: "loading",
	});
	const ref = useRef<HTMLImageElement>(null);

	const { observe, unobserve } = useIntersectionObserver();
	const preview = usePreview();

	const handleError = (err) => {
		onError?.(err);
		state.status = "error";
	};

	const handleLoad = (e) => {
		onLoad?.(e);
		state.status = undefined;
	};

	const handleClick = (e) => {
		onClick?.(e);

		if (!previewable || !src) return;

		const previewConfigs =
			typeof previewable === "boolean" ? {} : previewable;

		preview({
			...previewConfigs,
			items: [
				{
					src,
					type: "IMAGE",
				},
			],
		});
	};

	useEffect(() => {
		if (!src || typeof window === "undefined") return;

		if (!ref.current?.complete && observe && lazyload) {
			state.status = "loading";
		}

		if (!lazyload || !ref.current || !observe) return;

		observe(ref.current, (tar: HTMLElement, visible: boolean) => {
			if (!visible) return;

			tar.setAttribute("src", tar.dataset.src || "");
			unobserve(tar);
		});

		return () => {
			ref.current && unobserve(ref.current);
		};
	}, [src]);

	restProps[lazyload ? "data-src" : "src"] = thumb ?? src;
	const iSize = state.status === "loading" ? initSize : undefined;

	return (
		<div
			style={{
				width: width ?? size ?? iSize,
				height: height ?? size ?? iSize,
				aspectRatio: ratio,
				...style,
			}}
			className={classNames("i-image", className, {
				rounded: round,
				[`i-image-${state.status}`]: state.status,
			})}
			onClick={handleClick}
		>
			{state.status === "error" ? (
				fallback
			) : (
				<>
					{src && (
						<img
							ref={ref}
							style={{ objectFit: fit }}
							{...restProps}
							onLoad={handleLoad}
							onError={handleError}
						/>
					)}

					{src && state.status === "loading" && <Loading absolute />}

					{cover && (
						<div
							className={classNames("i-image-cover", coverClass)}
						>
							{cover}
						</div>
					)}
				</>
			)}
		</div>
	);
};

Image.List = List;

export default Image as CompositionImage;
