import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import Button from '../../components/button/button.js';
import Icon from '../../components/icon/icon.js';
import { CloseRound, AspectRatioRound, OpenInNewRound, FileDownloadOutlined, RotateRightRound, RotateLeftRound, KeyboardArrowLeftRound, KeyboardArrowRightRound } from '@ricons/material';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { throttle } from 'radash';
import { useRef, useMemo } from 'react';
import { useMouseMove, useMouseUp } from '../hooks.js';
import { getSuffixByUrl, getFileType } from '../utils.js';
import renderFile from './renderFile.js';
import { TFileType } from './type.js';

function Content(props) {
    const { items = [], initial = 0, renderFile: renderFile$1 = renderFile, onRotate, onChange, onClose, onZoom, } = props;
    const state = useReactive({
        current: initial,
        rotate: 0,
        scale: 1,
        translate: [0, 0],
        start: [0, 0],
        dragging: false,
        controlHidden: true,
    });
    const box = useRef(null);
    const translate = useRef([0, 0]);
    const hiddenTO = useRef(null);
    const files = useMemo(() => {
        return items.map((item) => {
            const o = {
                src: "",
            };
            if (typeof item === "string") {
                o.src = item;
            }
            else {
                Object.assign(o, item);
            }
            o.suffix = getSuffixByUrl(o.src) || "";
            o.type = getFileType(o.suffix, item["type"]);
            return o;
        });
    }, [items]);
    const { file, content } = useMemo(() => {
        const file = files[state.current];
        const content = renderFile$1(file);
        return {
            file,
            content,
        };
    }, [state.current, items]);
    const isImage = file.type === TFileType.IMAGE;
    const handleSwitch = (next) => {
        const l = files.length;
        const { current: before } = state;
        if (next >= l) {
            state.current = 0;
        }
        else if (next < 0) {
            state.current = l - 1;
        }
        else {
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
    const handleRotate = (deg) => {
        state.rotate += deg;
        onRotate?.(state.rotate);
    };
    const handleMouseWheel = throttle({ interval: 60 }, (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!isImage)
            return;
        let after = state.scale + (e.deltaY < 0 ? 0.05 : -0.05);
        if (after > 2)
            after = 2;
        if (after < 0.25)
            after = 0.25;
        onZoom?.(after);
        state.scale = after;
    });
    const handleMouseDown = (e) => {
        if (!isImage)
            return;
        e.preventDefault();
        state.dragging = true;
        state.start = [e.pageX, e.pageY];
    };
    const clearHiddenTO = () => {
        if (!hiddenTO.current || state.controlHidden)
            return;
        clearTimeout(hiddenTO.current);
        hiddenTO.current = null;
    };
    const setHiddenFalse = () => {
        if (!state.controlHidden)
            return;
        state.controlHidden = false;
        clearHiddenTO();
        hiddenTO.current = setTimeout(() => {
            state.controlHidden = true;
        }, 1000);
    };
    const throttleMouseMove = throttle({ interval: 300 }, setHiddenFalse);
    const handleMouseMove = (e) => {
        throttleMouseMove();
        if (!state.dragging)
            return;
        e.preventDefault();
        const [x, y] = translate.current;
        const [ox, oy] = state.start;
        const offsetX = e.pageX - ox;
        const offsetY = e.pageY - oy;
        state.translate = [x + offsetX, y + offsetY];
    };
    const handleMouseUp = () => {
        if (!state.dragging)
            return;
        state.dragging = false;
        translate.current = state.translate;
    };
    useMouseMove(handleMouseMove);
    useMouseUp(handleMouseUp);
    return (jsxs(Fragment, { children: [jsx("div", { ref: box, className: classNames("i-preview-content", {
                    "no-transition": state.dragging,
                }), style: {
                    transform: `translate(${state.translate
                        .map((n) => `${n}px`)
                        .join(",")}) rotate(${state.rotate}deg) scale(${state.scale})`,
                }, onWheel: handleMouseWheel, onMouseDown: handleMouseDown, onClick: (e) => e.stopPropagation(), children: content }), jsxs("div", { className: classNames("i-preview-controls", {
                    "i-preview-controls-hidden": state.controlHidden,
                }), children: [jsx(Button, { square: true, flat: true, onClick: onClose, children: jsx(Icon, { icon: jsx(CloseRound, {}) }) }), files.length > 1 && (jsxs("span", { className: 'px-8', children: [state.current + 1, " / ", files.length] })), state.scale !== 1 && (jsxs(Button, { flat: true, onClick: () => (state.scale = 1), children: [jsx(Icon, { icon: jsx(AspectRatioRound, {}) }), jsxs("span", { className: 'mt-2', children: [(state.scale * 100).toFixed(0), "%"] })] })), jsx(Button, { square: true, flat: true, href: file.src, target: '_blank', children: jsx(Icon, { icon: jsx(OpenInNewRound, {}) }) }), jsx(Button, { square: true, flat: true, href: file.src, download: true, target: '_blank', children: jsx(Icon, { icon: jsx(FileDownloadOutlined, {}) }) }), jsx(Button, { square: true, flat: true, onClick: () => handleRotate(90), children: jsx(Icon, { icon: jsx(RotateRightRound, {}) }) }), jsx(Button, { square: true, flat: true, onClick: () => handleRotate(-90), children: jsx(Icon, { icon: jsx(RotateLeftRound, {}) }) }), files.length > 1 && (jsxs(Fragment, { children: [jsx(Button, { square: true, flat: true, onClick: () => handleSwitch(state.current - 1), children: jsx(Icon, { icon: jsx(KeyboardArrowLeftRound, {}) }) }), jsx(Button, { square: true, flat: true, onClick: () => handleSwitch(state.current + 1), children: jsx(Icon, { icon: jsx(KeyboardArrowRightRound, {}) }) })] }))] })] }));
}

export { Content as default };
//# sourceMappingURL=content.js.map
