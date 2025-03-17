import { jsx } from 'react/jsx-runtime';
import { useMemo } from 'react';
import usePreview from '../../js/usePreview/index.js';
import { getSuffixByUrl, getFileType } from '../../js/utils.js';
import Flex from '../flex/flex.js';
import Image from './image.js';

function List(props) {
    const { items = [], gap = 8, columns, wrap, direction, usePreview: previewable, onClick, ...restProps } = props;
    const preview = usePreview();
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
    const handleClick = (e, i) => {
        onClick?.(e);
        previewable &&
            preview({
                items: files,
                initial: i,
            });
    };
    if (!files.length)
        return "";
    return (jsx(Flex, { className: 'i-image-list', gap: gap, columns: columns, wrap: wrap, direction: direction, children: files.map((img, i) => {
            return (jsx(Image, { src: img.src, size: 60, usePreview: false, onClick: (e) => handleClick(e, i), ...restProps }, i));
        }) }));
}

export { List as default };
//# sourceMappingURL=list.js.map
