import { exitFullScreen, fullScreen } from "@p/js/utils";
import {
	FullscreenExitRound,
	FullscreenRound,
	PauseRound,
	PlayArrowRound,
	StopRound,
	VolumeDownRound,
	VolumeOffRound,
} from "@ricons/material";
import { useReactive } from "ahooks";
import classNames from "classnames";
import { throttle } from "radash";
import { useEffect, useImperativeHandle, useRef } from "react";
import Button from "../button";
import Icon from "../icon";
import Progress from "../progress";
import Text from "../text";
import "./index.css";
import { IVideo } from "./type";

const Video = (props: IVideo) => {
	const {
		ref,
		style,
		hideControls,
		autoplay,
		muted,
		volume = 50,
		height,
		width,
		useOriginControls,
		timeProgressProps = {
			barClass: "bg-blue",
		},
		volumeProgressProps = {
			barClass: "bg-blue",
		},
		className,
		onFullScreenChange,
		...restProps
	} = props;
	const state = useReactive({
		playing: autoplay,
		volume: muted ? 0 : volume,
		volumeCache: 0,
		muted,
		current: 0,
		duration: 0,
		isFullscreen: false,
		controlHidden: true,
		draggingProgress: false,
	});
	const videoRef = useRef<HTMLVideoElement>(null);
	const hiddenTO = useRef<any>(null);

	const timeUpdateListener = (e) => {
		const tar = e.target;
		if (tar.paused || state.draggingProgress) return;

		Object.assign(state, {
			current: tar.currentTime,
		});
	};

	const playChangeListener = (e) => {
		state.playing = !e.target.paused;
	};

	const fsChangeListener = () => {
		const tar = videoRef.current?.parentElement;
		if (!tar) return;

		state.isFullscreen = document.fullscreenElement === tar;
	};

	const volumeChangeListener = (e) => {
		const tar = e.target;
		Object.assign(state, {
			volume: tar.volume * 100,
			muted: tar.volume === 0,
		});
	};

	const handlePlay = () => {
		const v = videoRef.current;
		if (!v) return;

		v.paused ? v.play() : v.pause();
	};

	const handleReady = (e) => {
		const tar = e.target;
		Object.assign(state, {
			duration: tar.duration,
			current: tar.currentTime,
		});
		tar.volume = state.volume / 100;
	};

	const handleMuted = () => {
		const v = videoRef.current;
		if (!v) return;

		if (v.volume > 0) {
			state.volumeCache = v.volume;
			v.volume = 0;
			return;
		}
		v.volume = state.volumeCache === 0 ? 0.5 : state.volumeCache;
	};

	const handleStop = () => {
		const v = videoRef.current;
		if (!v) return;

		v.currentTime = 0;
		v.pause();
	};

	const handleFullscreen = () => {
		const tar = videoRef.current?.parentElement;
		if (!tar) return;

		state.isFullscreen ? exitFullScreen() : fullScreen(tar);
		onFullScreenChange?.(!state.isFullscreen);
	};

	const handleUpdateTime = (t) => {
		const v = videoRef.current;
		if (!v) return;

		v.currentTime = (state.duration * t) / 100;
	};

	const handleUpdateVolume = (t) => {
		const v = videoRef.current;
		if (!v) return;

		v.volume = t / 100;
	};

	const showControls = !hideControls && !useOriginControls;

	const clearHiddenTO = () => {
		if (!hiddenTO.current) return;
		clearTimeout(hiddenTO.current);
		hiddenTO.current = null;
	};

	const setHiddenFalse = () => {
		if (!showControls || !state.controlHidden) return;
		state.controlHidden = false;

		clearHiddenTO();
		hiddenTO.current = setTimeout(() => {
			state.controlHidden = true;
		}, 1000);
	};

	const handleDraggingProgress = (dragging) => {
		state.draggingProgress = dragging;
	};

	const handleMouseMove = throttle({ interval: 900 }, setHiddenFalse);

	useImperativeHandle(ref, () => ({
		play: () => {
			const v = videoRef.current;
			if (!v) return;

			v.play();
		},
		pause: () => {
			const v = videoRef.current;
			if (!v) return;

			v.pause();
		},
		stop: handleStop,
		fullscreen: handleFullscreen,
		getVideo: () => videoRef.current,
	}));

	useEffect(() => {
		const v = videoRef.current;
		if (!v) return;

		v.addEventListener("timeupdate", timeUpdateListener);
		v.addEventListener("play", playChangeListener);
		v.addEventListener("pause", playChangeListener);
		v.addEventListener("volumechange", volumeChangeListener);
		document.addEventListener("fullscreenchange", fsChangeListener);

		return () => {
			clearHiddenTO();
			v.removeEventListener("timeupdate", timeUpdateListener);
			v.removeEventListener("play", playChangeListener);
			v.removeEventListener("pause", playChangeListener);
			v.removeEventListener("volumechange", volumeChangeListener);
			document.removeEventListener("fullscreenchange", fsChangeListener);
		};
	}, []);

	const currentValue = (state.current / state.duration) * 100;

	return (
		<div
			className={classNames("i-video", className)}
			style={{ height, width, ...style }}
			onClick={handlePlay}
			onDoubleClick={() => handleFullscreen()}
			onMouseMove={handleMouseMove}
		>
			<video
				ref={videoRef}
				onCanPlay={handleReady}
				{...restProps}
				controls={useOriginControls}
			/>

			{showControls && (
				<div
					className={classNames("i-video-controls", {
						"i-video-controls-hidden": state.controlHidden,
					})}
					onClick={(e) => e.stopPropagation()}
				>
					<Button.Toggle
						className='i-video-btn'
						flat
						square
						after={<Icon icon={<PauseRound />} />}
						active={state.playing}
						onClick={handlePlay}
					>
						<Icon icon={<PlayArrowRound />} />
					</Button.Toggle>
					<Button
						className='i-video-btn'
						flat
						square
						onClick={handleStop}
					>
						<Icon icon={<StopRound />} />
					</Button>
					<span className='i-video-times font-sm'>
						<Text.Time seconds={state.current} /> /
						<Text.Time seconds={state.duration} />
					</span>
					<Progress
						{...timeProgressProps}
						value={currentValue}
						onChange={handleUpdateTime}
						onDraggingChange={handleDraggingProgress}
					/>

					<div className='i-video-control-volume'>
						<Button.Toggle
							className='i-video-btn'
							flat
							square
							active={state.volume <= 0}
							after={
								<Icon
									icon={<VolumeOffRound />}
									style={{ padding: ".125em" }}
								/>
							}
							onClick={handleMuted}
						>
							<Icon icon={<VolumeDownRound />} />
						</Button.Toggle>

						<div className='i-video-volume'>
							<Progress
								style={{ height: 100 }}
								vertical
								{...volumeProgressProps}
								value={state.volume}
								onChange={handleUpdateVolume}
							/>
						</div>
					</div>

					<Button.Toggle
						className='i-video-btn'
						flat
						square
						after={<Icon icon={<FullscreenExitRound />} />}
						active={state.isFullscreen}
						onClick={() => handleFullscreen()}
					>
						<Icon icon={<FullscreenRound />} />
					</Button.Toggle>
				</div>
			)}
		</div>
	);
};

export default Video;
