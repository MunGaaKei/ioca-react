import 'react';
import { createRoot } from 'react-dom/client';

function getPosition($source, $popup, options = {}) {
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
    let { left: tl, top: tt, right: tr, bottom: tb, width: tw, height: th, } = rectT;
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
            }
            else {
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
            }
            else {
                const B = h > yb || yt < 0;
                y = B ? tb + offset : yt;
                arrowY = B ? 0 : ch;
                arrowPos = B ? "top" : "bottom";
            }
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
function getPointPosition(e, content) {
    const { width: w, height: h } = content.getBoundingClientRect();
    const parent = content.offsetParent;
    let pw, ph, pl = 0, pt = 0;
    if (parent) {
        const { width: ow, height: oh, left: ol, top: ot, } = parent.getBoundingClientRect();
        const st = parent.scrollTop ?? 0;
        pw = ow;
        ph = oh;
        pt = ot - st;
        pl = ol;
    }
    else {
        pw = window.innerWidth;
        ph = window.innerHeight;
    }
    const x = e.pageX - pl;
    const y = e.pageY - pt;
    const left = x + w >= pw ? (x - w > 0 ? x - w : x) : x;
    const top = y + h >= ph ? (y - h > 0 ? y - h : y) : y;
    return [left, top];
}
function computePosition({ containerSize, targetSize, targetOffset, contentSize, gap, align = "center", }) {
    const centerPoint = targetOffset + targetSize / 2;
    switch (align) {
        case "start":
            return targetOffset + contentSize > containerSize
                ? containerSize - contentSize - gap
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
function formatOption(options) {
    return options.map((option) => ["string", "number"].includes(typeof option)
        ? { label: option, value: option }
        : option);
}
function animate(from, to, duration = 1000, callback, easing = (t) => 1 - Math.pow(1 - t, 4)) {
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
function formatNumber(value, options = {}) {
    const { precision, thousand } = options;
    const result = value.toFixed(precision);
    if (!thousand)
        return result;
    const points = result.split(".");
    const integer = points[0].replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, `$&${thousand}`);
    if (points.length === 1)
        return integer;
    return `${integer}.${points[1]}`;
}
function renderNode(node, container = document.body) {
    const div = document.createElement("div");
    container.append(div);
    const root = createRoot(div);
    const sto = setTimeout(() => {
        root?.render(node);
    }, 0);
    return () => {
        div?.remove();
        root?.unmount();
        sto && clearTimeout(sto);
    };
}
function getSuffixByUrl(url) {
    return url.match(/\.([^\./\?]+)($|\?)/)?.[1];
}
function getFileType(suffix, type) {
    switch (true) {
        case ["jpg", "jpeg", "png", "webp", "svg"].includes(suffix) ||
            type?.startsWith("image/"):
            return "IMAGE";
        case ["mp4", "avi"].includes(suffix) || type?.startsWith("video/"):
            return "VIDEO";
        default:
            return "UNKNOWN";
    }
}
function fullScreen(el) {
    el.requestFullscreen?.();
}
function exitFullScreen() {
    document.exitFullscreen?.();
}
function formatTime(time, options) {
    const result = [];
    const { zero = true, units = ["", ":", ":"] } = options;
    const l = units.length;
    let i = 0;
    while (i < l) {
        if (time <= 0 && i > 1)
            break;
        const n = Math.round(time % 60);
        time = Math.floor(time / 60);
        result.unshift((zero && n < 10 ? `0${n}` : n) + units[i++]);
    }
    return result.join("");
}
function getNextSorter(prevSortBy, prevSortType, sortBy) {
    const types = ["desc", "asc"];
    if (prevSortBy === sortBy) {
        const i = types.findIndex((t) => t === prevSortType) + 1;
        const type = types[i] || "";
        const by = type === "" ? "" : sortBy;
        return [by, type];
    }
    return [sortBy, "desc"];
}
function formatBytes(bytes, decimals = 2) {
    if (!+bytes)
        return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
}
const arrayMove = (array, fromIndex, toIndex) => {
    if (toIndex >= array.length) {
        let k = toIndex - array.length + 1;
        while (k--) {
            array.push(undefined);
        }
    }
    array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
    return array;
};

export { animate, arrayMove, clamp, exitFullScreen, formatBytes, formatNumber, formatOption, formatTime, fullScreen, getFileType, getNextSorter, getPointPosition, getPosition, getSuffixByUrl, renderNode };
//# sourceMappingURL=utils.js.map
