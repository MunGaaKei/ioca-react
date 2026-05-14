'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var reactDom = require('react-dom');
var server = require('react-dom/server');
var utils = require('../../js/utils.js');
var list = require('../list/list.js');

const MEMTION_TAG_CLASS_NAME = "i-memtion-tag";
const blockTags = new Set([
    "ADDRESS",
    "ARTICLE",
    "ASIDE",
    "BLOCKQUOTE",
    "DIV",
    "DL",
    "FIELDSET",
    "FIGCAPTION",
    "FIGURE",
    "FOOTER",
    "FORM",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "HEADER",
    "LI",
    "MAIN",
    "NAV",
    "OL",
    "P",
    "PRE",
    "SECTION",
    "TABLE",
    "TD",
    "TH",
    "TR",
    "UL",
]);
const escapeHtmlAttr = (value) => value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const getInsertNode = (memtion, option) => memtion?.insert?.(option) ?? option.value;
const getInsertText = (memtion, option) => {
    const nextNode = getInsertNode(memtion, option);
    if (typeof nextNode === "string" || typeof nextNode === "number") {
        return `${String(nextNode)} `;
    }
    return `${String(option.value)} `;
};
const getInsertHtml = (memtion, option, sanitizeValue) => {
    const nextNode = getInsertNode(memtion, option);
    if (nextNode === null || nextNode === undefined || nextNode === false) {
        return "";
    }
    const content = sanitizeValue(server.renderToStaticMarkup(jsxRuntime.jsx(jsxRuntime.Fragment, { children: nextNode })));
    return `<span class="${MEMTION_TAG_CLASS_NAME}" contenteditable="false" data-memtion-value="${escapeHtmlAttr(String(option.value))}">${content}</span>`;
};
const getSelectionRect = (range) => {
    if (!range)
        return null;
    const rect = range.getBoundingClientRect();
    if (rect.width || rect.height) {
        return rect;
    }
    return range.getClientRects()[0] ?? rect;
};
const insertMemtionOption = ({ editor, range, mode, memtion, option, sanitizeValue, }) => {
    if (!editor || !range)
        return null;
    const browserSelection = window.getSelection();
    if (!browserSelection)
        return null;
    const nextRange = range.cloneRange();
    browserSelection.removeAllRanges();
    browserSelection.addRange(nextRange);
    editor.focus();
    nextRange.deleteContents();
    if (mode === "plaintext") {
        const text = document.createTextNode(getInsertText(memtion, option));
        nextRange.insertNode(text);
        nextRange.setStartAfter(text);
    }
    else {
        const html = getInsertHtml(memtion, option, sanitizeValue);
        const fragment = nextRange.createContextualFragment(html);
        const lastNode = fragment.lastChild;
        nextRange.insertNode(fragment);
        if (lastNode) {
            nextRange.setStartAfter(lastNode);
            nextRange.collapse(true);
        }
    }
    nextRange.collapse(true);
    browserSelection.removeAllRanges();
    browserSelection.addRange(nextRange);
    return nextRange;
};
const getMemtionText = (triggerRange, selectionRange) => {
    if (!triggerRange || !selectionRange)
        return "";
    const range = triggerRange.cloneRange();
    range.setEnd(selectionRange.endContainer, selectionRange.endOffset);
    return range.toString();
};
const getMemtionReplaceRange = (triggerRange, selectionRange) => {
    if (!triggerRange || !selectionRange)
        return null;
    const range = triggerRange.cloneRange();
    range.setEnd(selectionRange.endContainer, selectionRange.endOffset);
    return range;
};
const filterMemtionOptions = (options, keyword) => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) {
        return options;
    }
    return options.filter((option) => String(option.value).toLowerCase().includes(normalizedKeyword));
};
const isMemtionTag = (node) => node instanceof HTMLElement &&
    node.classList.contains(MEMTION_TAG_CLASS_NAME);
const appendBreak = (container) => {
    if (!container.lastChild || container.lastChild.nodeName === "BR") {
        return;
    }
    container.appendChild(document.createElement("br"));
};
const appendPlaintextOnMemtionNode = (container, node) => {
    if (!node)
        return;
    if (node.nodeType === Node.TEXT_NODE) {
        container.appendChild(document.createTextNode((node.textContent ?? "").replaceAll("\r", "")));
        return;
    }
    if (!(node instanceof HTMLElement)) {
        return;
    }
    if (isMemtionTag(node)) {
        const tag = document.createElement("span");
        const memtionValue = node.getAttribute("data-memtion-value");
        tag.className = MEMTION_TAG_CLASS_NAME;
        tag.setAttribute("contenteditable", "false");
        if (memtionValue !== null) {
            tag.setAttribute("data-memtion-value", memtionValue);
        }
        tag.innerHTML = node.innerHTML;
        container.appendChild(tag);
        return;
    }
    if (node.tagName === "BR") {
        appendBreak(container);
        return;
    }
    Array.from(node.childNodes).forEach((child) => {
        appendPlaintextOnMemtionNode(container, child);
    });
    if (blockTags.has(node.tagName)) {
        appendBreak(container);
    }
};
const sanitizePlaintextOnMemtionHtml = (value) => {
    if (typeof document === "undefined") {
        return value;
    }
    const source = document.createElement("div");
    const result = document.createElement("div");
    source.innerHTML = value;
    Array.from(source.childNodes).forEach((child) => {
        appendPlaintextOnMemtionNode(result, child);
    });
    while (result.lastChild?.nodeName === "BR") {
        result.lastChild.remove();
    }
    return result.innerHTML;
};
const getAdjacentMemtionTag = (range, direction) => {
    const { startContainer, startOffset } = range;
    if (startContainer.nodeType === Node.TEXT_NODE) {
        const textNode = startContainer;
        if (direction === "backward" && startOffset === 0) {
            return isMemtionTag(textNode.previousSibling)
                ? textNode.previousSibling
                : null;
        }
        if (direction === "forward" && startOffset === textNode.data.length) {
            return isMemtionTag(textNode.nextSibling)
                ? textNode.nextSibling
                : null;
        }
        return null;
    }
    const element = startContainer;
    const targetIndex = direction === "backward" ? startOffset - 1 : startOffset;
    const targetNode = element.childNodes.item(targetIndex);
    return isMemtionTag(targetNode) ? targetNode : null;
};
const removeAdjacentMemtionTag = (editor, key) => {
    if (!editor)
        return false;
    const selection = window.getSelection();
    if (!selection?.rangeCount || !selection.isCollapsed)
        return false;
    const activeRange = selection.getRangeAt(0);
    const tag = getAdjacentMemtionTag(activeRange, key === "Backspace" ? "backward" : "forward");
    if (!tag || !tag.parentNode)
        return false;
    const parent = tag.parentNode;
    const nextSibling = tag.nextSibling;
    const index = Array.prototype.indexOf.call(parent.childNodes, tag);
    if (nextSibling?.nodeType === Node.TEXT_NODE) {
        const textNode = nextSibling;
        if (textNode.data.startsWith(" ")) {
            textNode.deleteData(0, 1);
            if (!textNode.data.length) {
                nextSibling.remove();
            }
        }
    }
    tag.remove();
    const range = document.createRange();
    range.setStart(parent, Math.min(index, parent.childNodes.length));
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    editor.focus();
    return true;
};
const makeRectSource = (rect) => {
    const { left, top, width, height } = rect;
    return {
        offsetParent: null,
        offsetLeft: left,
        offsetTop: top,
        getBoundingClientRect: () => ({
            left,
            top,
            right: left + width,
            bottom: top + height,
            width,
            height,
            x: left,
            y: top,
            toJSON: () => ({}),
        }),
    };
};
const Memtion$1 = (props) => {
    const { visible, rect, options, activeIndex, onActiveChange, onSelect } = props;
    const containerRef = react.useRef(null);
    const [pos, setPos] = react.useState({ left: 0, top: 0 });
    const [ready, setReady] = react.useState(false);
    react.useLayoutEffect(() => {
        if (!visible || !rect || !options?.length) {
            setReady(false);
            return;
        }
        const el = containerRef.current;
        if (!el)
            return;
        const [left, top] = utils.getPosition(makeRectSource(rect), el, {
            position: "bottom",
            gap: 4,
            offset: 0,
            align: "start",
            refWindow: true,
        });
        setPos({ left, top });
        setReady(true);
    }, [visible, rect, options]);
    if (!visible || !rect || !options?.length) {
        return null;
    }
    const content = (jsxRuntime.jsx(list.default, { ref: containerRef, className: "i-editor-memtion", type: "option", style: {
            position: "fixed",
            left: pos.left,
            top: pos.top,
            opacity: ready ? 1 : 0,
        }, children: options.map((option, i) => (jsxRuntime.jsx(list.default.Item, { type: "option", active: i === activeIndex, onMouseDown: (e) => e.preventDefault(), onMouseEnter: () => onActiveChange?.(i), onClick: () => onSelect?.(option), children: option.label }, `${option.value}-${i}`))) }));
    if (typeof document === "undefined") {
        return content;
    }
    return reactDom.createPortal(content, document.body);
};
var Memtion = react.memo(Memtion$1);

exports.MEMTION_TAG_CLASS_NAME = MEMTION_TAG_CLASS_NAME;
exports.default = Memtion;
exports.filterMemtionOptions = filterMemtionOptions;
exports.getMemtionReplaceRange = getMemtionReplaceRange;
exports.getMemtionText = getMemtionText;
exports.getSelectionRect = getSelectionRect;
exports.insertMemtionOption = insertMemtionOption;
exports.removeAdjacentMemtionTag = removeAdjacentMemtionTag;
exports.sanitizePlaintextOnMemtionHtml = sanitizePlaintextOnMemtionHtml;
//# sourceMappingURL=memtion.js.map
