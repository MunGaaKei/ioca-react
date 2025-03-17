import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { ListAltRound } from '@ricons/material';
import { title } from 'radash';
import SortableContainer from 'react-easy-sort';
import { TFileType } from '../../js/usePreview/type.js';
import { getFileType, formatBytes } from '../../js/utils.js';
import Icon from '../icon/icon.js';
import '../image/index.js';
import Helpericon from '../utils/helpericon/helpericon.js';
import Image from '../image/image.js';

const ListContainer = (props) => {
    const { sortable, onSortEnd, itemProps, ...restProps } = props;
    const customProps = {
        className: "i-upload-list",
        onClick: (e) => {
            e.stopPropagation();
            e.preventDefault();
        },
    };
    if (!sortable) {
        return jsx("div", { ...customProps, ...restProps });
    }
    return (jsx(SortableContainer, { draggedItemClassName: 'i-upload-item-dragged', onSortEnd: onSortEnd, ...customProps, ...restProps }));
};
const FileListItem = (props) => {
    const { ref, mode, index, file, renderItem, onRemove, onPreview } = props;
    if (!file)
        return "";
    const { id, name, size, url, src } = file;
    const type = getFileType(name, file.type);
    if (renderItem) {
        return renderItem(file, index);
    }
    const CloseBtn = (jsx(Helpericon, { active: true, className: 'i-upload-delete', onClick: (e) => {
            e.stopPropagation();
            e.preventDefault();
            onRemove(index);
        } }));
    switch (mode) {
        case "card":
            let node = jsx(Fragment, {});
            switch (type) {
                case TFileType.IMAGE:
                    node = (jsx(Image, { lazyload: true, src: url || src, fit: 'cover', onMouseDown: (e) => e.preventDefault() }));
                    break;
                case TFileType.VIDEO:
                    node = jsx("video", { src: url || src, preload: 'none' });
                    break;
                default:
                    node = (jsxs(Fragment, { children: [jsx(Icon, { icon: jsx(ListAltRound, {}) }), jsx("span", { className: 'i-upload-file-name', children: title(name) })] }));
                    break;
            }
            return (jsxs("div", { ref: ref, title: name, className: 'i-upload-item-card', onClick: () => onPreview?.(index), children: [node, CloseBtn] }));
        default:
            return (jsxs("div", { ref: ref, className: 'i-upload-item', onClick: () => onPreview?.(index), children: [jsx("span", { children: name }), jsx("i", { className: 'i-upload-size', children: formatBytes(size ?? 0) }), CloseBtn] }, id));
    }
};

export { ListContainer, FileListItem as default };
//# sourceMappingURL=renderFile.js.map
