import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { DriveFolderUploadOutlined, PlusSharp } from '@ricons/material';
import classNames from 'classnames';
import { uid } from 'radash';
import { useState, useRef, useMemo, useEffect, useImperativeHandle } from 'react';
import { SortableItem } from 'react-easy-sort';
import usePreview from '../../js/usePreview/index.js';
import { arrayMove } from '../../js/utils.js';
import Button from '../button/button.js';
import Icon from '../icon/icon.js';
import InputContainer from '../input/container.js';
import FileListItem, { ListContainer } from './renderFile.js';

const Upload = (props) => {
    const { ref, label, labelInline, value, files = [], initialFiles, placeholder, status = "normal", message, className, style, children, defaultButtonProps, mode = "default", cardSize = "4em", disabled, sortable, limit = props.multiple ? Infinity : 1, multiple, renderItem, shouldUpload = () => true, uploader, onChange, onFilesChange, onUpload, ...restProps } = props;
    const [fileList, setFileListState] = useState(files);
    const [uploadMessage, setUploadMessage] = useState(message);
    const inputRef = useRef(null);
    const preview = usePreview();
    const defBtnProps = Object.assign({
        children: (jsxs(Fragment, { children: [jsx(Icon, { icon: jsx(DriveFolderUploadOutlined, {}) }), " \u4E0A\u4F20"] })),
    }, defaultButtonProps);
    const trigger = useMemo(() => {
        if (children)
            return children;
        switch (mode) {
            case "card":
                return (jsx(Button, { className: 'i-upload-card-btn color-5', square: true, flat: true, outline: true, disabled: disabled, children: jsx(Icon, { icon: jsx(PlusSharp, {}) }) }));
            default:
                return (jsx(Button, { ...defBtnProps, className: classNames("i-upload-btn", defBtnProps.className), disabled: disabled }));
        }
    }, [mode, children]);
    const handleChange = (e) => {
        const files = Array.from(e.target.files || []);
        const before = fileList;
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
        const last = after.at(-1);
        const nextFiles = multiple ? after.slice(0, limit) : last ? [last] : [];
        setFileListState(nextFiles);
        setUploadMessage(message);
        onFilesChange?.(nextFiles, changed, e);
        onChange?.(nextFiles, e);
        handleUpload(changed);
        inputRef.current && (inputRef.current.value = "");
    };
    const handleRemove = (i) => {
        const [...files] = fileList;
        const changed = files.splice(i, 1);
        URL.revokeObjectURL(changed[0]?.src || "");
        setFileListState(files);
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
        preview({ items: fileList, initial: i });
    };
    const setFileList = (files) => {
        if (!files)
            return;
        setFileListState(files.map((f) => {
            const file = f;
            return { ...file, id: file.id ?? uid(7) };
        }));
    };
    const handleSortEnd = (before, after) => {
        const [...files] = fileList;
        const nextFiles = arrayMove(files, before, after);
        setFileListState(nextFiles);
        onChange?.(nextFiles);
    };
    useEffect(() => {
        setUploadMessage(message);
    }, [status, message]);
    useEffect(() => {
        setFileListState(value?.filter?.((file) => !!file.id) ?? []);
    }, [value]);
    useEffect(() => {
        setFileList(initialFiles);
    }, []);
    useImperativeHandle(ref, () => ({
        getFileList: () => fileList,
        setFileList,
    }), [fileList]);
    return (jsx(InputContainer, { as: 'div', label: label, labelInline: labelInline, className: classNames("i-input-label-file", className), style: style, children: jsxs("div", { className: classNames("i-upload-inner", {
                [`i-upload-${mode}`]: mode !== "default",
            }), style: { ["--upload-card-size"]: cardSize }, children: [jsx(ListContainer, { sortable: sortable, onSortEnd: handleSortEnd, children: fileList.map((file, i) => {
                        const node = (jsx(FileListItem, { index: i, file: file, mode: mode, renderItem: renderItem, onRemove: handleRemove, onPreview: handlePreview }, i));
                        if (!sortable)
                            return node;
                        return jsx(SortableItem, { children: node }, i);
                    }) }), uploadMessage && (jsx("span", { className: 'i-upload-message', children: uploadMessage })), fileList.length < limit && (jsxs("label", { children: [jsx("input", { ...restProps, disabled: disabled, ref: inputRef, type: 'file', className: 'i-input-file-hidden', multiple: multiple, onChange: handleChange }), trigger] }))] }) }));
};

export { Upload as default };
//# sourceMappingURL=upload.js.map
