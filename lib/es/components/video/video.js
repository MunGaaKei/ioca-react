import { jsxs, jsx } from 'react/jsx-runtime';
import { PauseRound, PlayArrowRound, StopRound, VolumeOffRound, VolumeDownRound, FullscreenExitRound, FullscreenRound } from '@ricons/material';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { throttle } from 'radash';
import { useRef, useImperativeHandle, useEffect } from 'react';
import { exitFullScreen, fullScreen } from '../../js/utils.js';
import Button from '../button/button.js';
import Icon from '../icon/icon.js';
import Progress from '../progress/progress.js';
import Text from '../text/text.js';

const Video = (props) => {
    const { ref, style, hideControls, autoplay, muted, volume = 50, height, width, useOriginControls, timeProgressProps = {
        barClass: "bg-blue",
    }, volumeProgressProps = {
        barClass: "bg-blue",
    }, className, onFullScreenChange, ...restProps } = props;
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
    const videoRef = useRef(null);
    const hiddenTO = useRef(null);
    const timeUpdateListener = (e) => {
        const tar = e.target;
        if (tar.paused || state.draggingProgress)
            return;
        Object.assign(state, {
            current: tar.currentTime,
        });
    };
    const playChangeListener = (e) => {
        state.playing = !e.target.paused;
    };
    const fsChangeListener = () => {
        if (typeof document === "undefined")
            return;
        const tar = videoRef.current?.parentElement;
        if (!tar)
            return;
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
        if (!v)
            return;
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
        if (!v)
            return;
        if (v.volume > 0) {
            state.volumeCache = v.volume;
            v.volume = 0;
            return;
        }
        v.volume = state.volumeCache === 0 ? 0.5 : state.volumeCache;
    };
    const handleStop = () => {
        const v = videoRef.current;
        if (!v)
            return;
        v.currentTime = 0;
        v.pause();
    };
    const handleFullscreen = () => {
        const tar = videoRef.current?.parentElement;
        if (!tar)
            return;
        state.isFullscreen ? exitFullScreen() : fullScreen(tar);
        onFullScreenChange?.(!state.isFullscreen);
    };
    const handleUpdateTime = (t) => {
        const v = videoRef.current;
        if (!v)
            return;
        v.currentTime = (state.duration * t) / 100;
    };
    const handleUpdateVolume = (t) => {
        const v = videoRef.current;
        if (!v)
            return;
        v.volume = t / 100;
    };
    const showControls = !hideControls && !useOriginControls;
    const clearHiddenTO = () => {
        if (!hiddenTO.current)
            return;
        clearTimeout(hiddenTO.current);
        hiddenTO.current = null;
    };
    const setHiddenFalse = () => {
        if (!showControls || !state.controlHidden)
            return;
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
            if (!v)
                return;
            v.play();
        },
        pause: () => {
            const v = videoRef.current;
            if (!v)
                return;
            v.pause();
        },
        stop: handleStop,
        fullscreen: handleFullscreen,
        getVideo: () => videoRef.current,
    }));
    useEffect(() => {
        if (typeof document === "undefined")
            return;
        const v = videoRef.current;
        if (!v)
            return;
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
    return (jsxs("div", { className: classNames("i-video", className), style: { height, width, ...style }, onClick: handlePlay, onDoubleClick: () => handleFullscreen(), onMouseMove: handleMouseMove, children: [jsx("video", { ref: videoRef, onCanPlay: handleReady, ...restProps, controls: useOriginControls }), showControls && (jsxs("div", { className: classNames("i-video-controls", {
                    "i-video-controls-hidden": state.controlHidden,
                }), onClick: (e) => e.stopPropagation(), children: [jsx(Button.Toggle, { className: 'i-video-btn', flat: true, square: true, after: jsx(Icon, { icon: jsx(PauseRound, {}) }), active: state.playing, onClick: handlePlay, children: jsx(Icon, { icon: jsx(PlayArrowRound, {}) }) }), jsx(Button, { className: 'i-video-btn', flat: true, square: true, onClick: handleStop, children: jsx(Icon, { icon: jsx(StopRound, {}) }) }), jsxs("span", { className: 'i-video-times font-sm', children: [jsx(Text.Time, { seconds: state.current }), " /", jsx(Text.Time, { seconds: state.duration })] }), jsx(Progress, { ...timeProgressProps, value: currentValue, onChange: handleUpdateTime, onDraggingChange: handleDraggingProgress }), jsxs("div", { className: 'i-video-control-volume', children: [jsx(Button.Toggle, { className: 'i-video-btn', flat: true, square: true, active: state.volume <= 0, after: jsx(Icon, { icon: jsx(VolumeOffRound, {}), style: { padding: ".125em" } }), onClick: handleMuted, children: jsx(Icon, { icon: jsx(VolumeDownRound, {}) }) }), jsx("div", { className: 'i-video-volume', children: jsx(Progress, { style: { height: 100 }, vertical: true, ...volumeProgressProps, value: state.volume, onChange: handleUpdateVolume }) })] }), jsx(Button.Toggle, { className: 'i-video-btn', flat: true, square: true, after: jsx(Icon, { icon: jsx(FullscreenExitRound, {}) }), active: state.isFullscreen, onClick: () => handleFullscreen(), children: jsx(Icon, { icon: jsx(FullscreenRound, {}) }) })] }))] }));
};

export { Video as default };
//# sourceMappingURL=video.js.map
