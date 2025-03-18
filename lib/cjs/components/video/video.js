'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var ahooks = require('ahooks');
var classNames = require('classnames');
var radash = require('radash');
var react = require('react');
var utils = require('../../js/utils.js');
require('../button/index.js');
var icon = require('../icon/icon.js');
var progress = require('../progress/progress.js');
require('../text/index.js');
var button = require('../button/button.js');
var text = require('../text/text.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Video = (props) => {
    const { ref, style, hideControls, autoplay, muted, volume = 50, height, width, useOriginControls, timeProgressProps = {
        barClass: "bg-blue",
    }, volumeProgressProps = {
        barClass: "bg-blue",
    }, className, onFullScreenChange, ...restProps } = props;
    const state = ahooks.useReactive({
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
    const videoRef = react.useRef(null);
    const hiddenTO = react.useRef(null);
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
        state.isFullscreen ? utils.exitFullScreen() : utils.fullScreen(tar);
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
    const handleMouseMove = radash.throttle({ interval: 900 }, setHiddenFalse);
    react.useImperativeHandle(ref, () => ({
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
    react.useEffect(() => {
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
    return (jsxRuntime.jsxs("div", { className: classNames__default("i-video", className), style: { height, width, ...style }, onClick: handlePlay, onDoubleClick: () => handleFullscreen(), onMouseMove: handleMouseMove, children: [jsxRuntime.jsx("video", { ref: videoRef, onCanPlay: handleReady, ...restProps, controls: useOriginControls }), showControls && (jsxRuntime.jsxs("div", { className: classNames__default("i-video-controls", {
                    "i-video-controls-hidden": state.controlHidden,
                }), onClick: (e) => e.stopPropagation(), children: [jsxRuntime.jsx(button.default.Toggle, { className: 'i-video-btn', flat: true, square: true, after: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.PauseRound, {}) }), active: state.playing, onClick: handlePlay, children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.PlayArrowRound, {}) }) }), jsxRuntime.jsx(button.default, { className: 'i-video-btn', flat: true, square: true, onClick: handleStop, children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.StopRound, {}) }) }), jsxRuntime.jsxs("span", { className: 'i-video-times font-sm', children: [jsxRuntime.jsx(text.default.Time, { seconds: state.current }), " /", jsxRuntime.jsx(text.default.Time, { seconds: state.duration })] }), jsxRuntime.jsx(progress.default, { ...timeProgressProps, value: currentValue, onChange: handleUpdateTime, onDraggingChange: handleDraggingProgress }), jsxRuntime.jsxs("div", { className: 'i-video-control-volume', children: [jsxRuntime.jsx(button.default.Toggle, { className: 'i-video-btn', flat: true, square: true, active: state.volume <= 0, after: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.VolumeOffRound, {}), style: { padding: ".125em" } }), onClick: handleMuted, children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.VolumeDownRound, {}) }) }), jsxRuntime.jsx("div", { className: 'i-video-volume', children: jsxRuntime.jsx(progress.default, { style: { height: 100 }, vertical: true, ...volumeProgressProps, value: state.volume, onChange: handleUpdateVolume }) })] }), jsxRuntime.jsx(button.default.Toggle, { className: 'i-video-btn', flat: true, square: true, after: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.FullscreenExitRound, {}) }), active: state.isFullscreen, onClick: () => handleFullscreen(), children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.FullscreenRound, {}) }) })] }))] }));
};

exports.default = Video;
//# sourceMappingURL=video.js.map
