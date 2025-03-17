import { jsx, jsxs } from 'react/jsx-runtime';
import { PlusSharp } from '@ricons/material';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { uid } from 'radash';
import { useRef, useMemo, useEffect, useImperativeHandle } from 'react';
import { SortableItem } from 'react-easy-sort';
import usePreview from '../../js/usePreview/index.js';
import { arrayMove } from '../../js/utils.js';
import '../button/index.js';
import Icon from '../icon/icon.js';
import InputContainer from '../input/container.js';
import FileListItem, { ListContainer } from './renderFile.js';
import Button from '../button/button.js';

const Upload = (props) => {
    const { ref, label, labelInline, value, files = [], initialFiles, placeholder, status = "normal", message, className, style, children, defaultText = "Upload", mode = "default", cardSize = "4em", disabled, sortable, limit = props.multiple ? Infinity : 1, multiple, renderItem, shouldUpload = () => true, uploader, onChange, onFilesChange, onUpload, ...restProps } = props;
    const state = useReactive({
        files,
        value,
        status,
        message,
    });
    const inputRef = useRef(null);
    const preview = usePreview();
    const trigger = useMemo(() => {
        if (children)
            return children;
        switch (mode) {
            case "card":
                return (jsx(Button, { className: 'i-upload-card-btn color-5', square: true, flat: true, outline: true, disabled: disabled, children: jsx(Icon, { icon: jsx(PlusSharp, {}) }) }));
            default:
                return (jsx(Button, { className: 'i-upload-btn', disabled: disabled, children: defaultText }));
        }
    }, [mode, children]);
    const handleChange = (e) => {
        const files = Array.from(e.target.files || []);
        const { files: before } = state;
        const changed = [];
        files.map((f) => {
            const { id, name, size, type } = f;
            const same = before.find((pf) => {
                const { name: n, size: s, type: t } = pf;
                return n === name && s === size && t === type;
            });
            const src = URL.createObjectURL(f);
            Object.assign(f, {
                id: id ?? uid(7),
                src: src ?? f.name,
                url: src ?? f.name,
            });
            !same && changed.push(f);
        });
        const after = [...before, ...changed];
        Object.assign(state, {
            files: multiple ? after.slice(0, limit) : [after.at(-1)],
            status,
            message,
        });
        onFilesChange?.(state.files, changed, e);
        onChange?.(state.files, e);
        handleUpload(changed);
        inputRef.current && (inputRef.current.value = "");
    };
    const handleRemove = (i) => {
        const [...files] = state.files;
        const changed = files.splice(i, 1);
        URL.revokeObjectURL(changed[0]?.src || "");
        state.files = files;
        onFilesChange?.(files, changed);
        onChange?.(files);
        inputRef.current && (inputRef.current.value = "");
    };
    const handleUpload = async (files) => {
        if (!uploader)
            return;
        const shouldUploadFiles = files.filter(shouldUpload);
        const result = Promise.all(shouldUploadFiles.map(uploader));
        return onUpload?.(result);
    };
    const handlePreview = (i) => {
        preview({ items: state.files, initial: i });
    };
    const setFileList = (files) => {
        if (!files)
            return;
        state.files = files.map((f) => {
            return { ...f, id: f.id ?? uid(7) };
        });
    };
    const handleSortEnd = (before, after) => {
        const [...files] = state.files;
        state.files = arrayMove(files, before, after);
        onChange?.(state.files);
    };
    useEffect(() => {
        Object.assign(state, {
            status,
            message,
        });
    }, [status, message]);
    useEffect(() => {
        state.files = value?.filter?.((file) => !!file.id) ?? [];
    }, [value]);
    useEffect(() => {
        setFileList(initialFiles);
    }, []);
    useImperativeHandle(ref, () => ({
        getFileList: () => state.files,
        setFileList,
    }), []);
    return (jsx(InputContainer, { as: 'div', label: label, labelInline: labelInline, className: classNames("i-input-label-file", className), style: style, children: jsxs("div", { className: classNames("i-upload-inner", {
                [`i-upload-${mode}`]: mode !== "default",
            }), style: { ["--upload-card-size"]: cardSize }, children: [jsx(ListContainer, { sortable: sortable, onSortEnd: handleSortEnd, children: state.files.map((file, i) => {
                        const node = (jsx(FileListItem, { index: i, file: file, mode: mode, renderItem: renderItem, onRemove: handleRemove, onPreview: handlePreview }, i));
                        if (!sortable)
                            return node;
                        return jsx(SortableItem, { children: node }, i);
                    }) }), state.message && (jsx("span", { className: 'i-upload-message', children: state.message })), state.files.length < limit && (jsxs("label", { children: [jsx("input", { ...restProps, disabled: disabled, ref: inputRef, type: 'file', className: 'i-input-file-hidden', multiple: multiple, onChange: handleChange }), trigger] }))] }) }));
};

export { Upload as default };
//# sourceMappingURL=upload.js.map
