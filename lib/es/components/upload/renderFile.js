import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { FilePresentOutlined } from '@ricons/material';
import { memo, useCallback, useMemo } from 'react';
import SortableContainer from 'react-easy-sort';
import { TFileType } from '../../js/usePreview/type.js';
import { getFileType, formatBytes } from '../../js/utils.js';
import Icon from '../icon/icon.js';
import MemoImage from '../image/image.js';
import Helpericon from '../utils/helpericon/helpericon.js';

const ListContainer = memo((props) => {
    const { sortable, onSortEnd, children, ...restProps } = props;
    if (!sortable) {
        return (jsx("div", { className: "i-upload-list", onClick: (e) => {
                e.stopPropagation();
                e.preventDefault();
            }, ...restProps, children: children }));
    }
    return (jsx(SortableContainer, { draggedItemClassName: "i-upload-item-dragged", onSortEnd: onSortEnd, className: "i-upload-list", ...restProps, children: children }));
});
const CloseBtn = memo(({ index, onRemove }) => (jsx(Helpericon, { active: true, className: "i-upload-delete", onClick: (e) => {
        e.stopPropagation();
        e.preventDefault();
        onRemove(index);
    } })));
const FileListItem = memo((props) => {
    const { ref, mode, index, file, renderItem, onRemove, onPreview } = props;
    if (!file)
        return null;
    const { name, size, url, src } = file;
    const type = getFileType(name, file.type);
    const handleClick = useCallback(() => {
        onPreview?.(index);
    }, [onPreview, index]);
    if (renderItem) {
        return renderItem(file, index);
    }
    const node = useMemo(() => {
        switch (type) {
            case TFileType.IMAGE:
                return (jsx(MemoImage, { lazyload: true, src: url || src, fit: "cover", onMouseDown: (e) => e.preventDefault() }));
            case TFileType.VIDEO:
                return jsx("video", { src: url || src, preload: "none" });
            default:
                return (jsxs(Fragment, { children: [jsx(Icon, { icon: jsx(FilePresentOutlined, {}), size: "1.5em" }), jsx("span", { className: "i-upload-file-name", children: name })] }));
        }
    }, [type, url, src, name]);
    switch (mode) {
        case "card":
            return (jsxs("div", { ref: ref, className: "i-upload-item-card", onClick: handleClick, children: [node, jsx(CloseBtn, { index: index, onRemove: onRemove }), name && (jsx("span", { className: "px-12 py-8 i-upload-tip", children: name }))] }));
        default:
            return (jsxs("div", { ref: ref, className: "i-upload-item", onClick: handleClick, children: [jsx("span", { children: name }), jsx("i", { className: "i-upload-size", children: formatBytes(size ?? 0) }), jsx(CloseBtn, { index: index, onRemove: onRemove })] }));
    }
});

export { ListContainer, FileListItem as default };
//# sourceMappingURL=renderFile.js.map
