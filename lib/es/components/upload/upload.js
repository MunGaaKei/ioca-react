import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { DriveFolderUploadOutlined } from '@ricons/material';
import classNames from 'classnames';
import { uid } from 'radash';
import { useState, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { SortableItem } from 'react-easy-sort';
import usePreview from '../../js/usePreview/index.js';
import { arrayMove } from '../../js/utils.js';
import Button from '../button/button.js';
import Icon from '../icon/icon.js';
import InputContainer from '../input/container.js';
import Dropbox from './dropbox.js';
import FileListItem, { ListContainer } from './renderFile.js';

const normalizeFiles = (files) => (files ?? []).map((item) => {
    const file = item;
    if (item instanceof File) {
        const src = file.src ?? URL.createObjectURL(item);
        Object.assign(item, {
            id: file.id ?? uid(7),
            src,
            url: file.url ?? src,
        });
        return item;
    }
    const src = file.src ?? file.name;
    return {
        ...file,
        id: file.id ?? uid(7),
        src,
        url: file.url ?? src,
    };
});
const Upload = (props) => {
    const { label, labelInline, value, files, placeholder, status = "normal", message, icon = jsx(Icon, { icon: jsx(DriveFolderUploadOutlined, {}) }), className, style, children, droppable, dropbox, getDropboxContainer, defaultButtonProps, mode = "default", cardSize = "3.2em", disabled, sortable, limit = props.multiple ? Infinity : 1, multiple, renderItem, shouldUpload = () => true, uploader, onChange, onFilesChange, onUpload, onRemove, ...restProps } = props;
    const [internalFileList, setInternalFileList] = useState([]);
    const isControlled = useMemo(() => value !== undefined || files !== undefined, [value, files]);
    const fileList = isControlled
        ? normalizeFiles(value ?? files ?? [])
        : internalFileList;
    const uploadMessage = message;
    const inputRef = useRef(null);
    const preview = usePreview();
    const defBtnProps = useMemo(() => ({
        children: jsxs(Fragment, { children: [icon, " \u4E0A\u4F20"] }),
        ...defaultButtonProps,
    }), [defaultButtonProps]);
    const trigger = useMemo(() => {
        if (children)
            return children;
        switch (mode) {
            case "card":
                return (jsx(Button, { className: "i-upload-card-btn color-5", square: true, flat: true, outline: true, disabled: disabled, children: icon }));
            default:
                return (jsx(Button, { ...defBtnProps, className: classNames("i-upload-btn", defBtnProps.className), disabled: disabled }));
        }
    }, [mode, children, disabled, defBtnProps, icon]);
    const handleUpload = useCallback(async (files) => {
        if (!uploader)
            return;
        const shouldUploadFiles = files.filter(shouldUpload);
        const result = await Promise.all(shouldUploadFiles.map(uploader));
        return onUpload?.(result);
    }, [uploader, shouldUpload, onUpload]);
    const processFiles = useCallback((inputFiles) => {
        const before = fileList;
        const changed = [];
        inputFiles.forEach((file) => {
            const { id, name, size, type } = file;
            const same = before.some((pf) => pf.name === name &&
                pf.size === size &&
                pf.type === type);
            const src = URL.createObjectURL(file);
            Object.assign(file, {
                id: id ?? uid(7),
                src: src ?? file.name,
                url: src ?? file.name,
            });
            if (!same)
                changed.push(file);
        });
        const after = [...before, ...changed];
        const last = after.at(-1);
        const nextFiles = multiple
            ? after.slice(0, limit)
            : last
                ? [last]
                : [];
        return { nextFiles, changed };
    }, [fileList, multiple, limit]);
    const applyFiles = useCallback((nextFiles, changed, e) => {
        if (!isControlled)
            setInternalFileList(nextFiles);
        onFilesChange?.(nextFiles, changed, e);
        onChange?.(nextFiles, e);
        handleUpload(changed);
    }, [isControlled, onFilesChange, onChange, handleUpload]);
    const handleChange = useCallback((e) => {
        const inputFiles = Array.from(e.target.files || []);
        const { nextFiles, changed } = processFiles(inputFiles);
        applyFiles(nextFiles, changed, e);
        if (inputRef.current)
            inputRef.current.value = "";
    }, [processFiles, applyFiles]);
    const handleDropFiles = useCallback((files) => {
        const { nextFiles, changed } = processFiles(files);
        applyFiles(nextFiles, changed);
    }, [processFiles, applyFiles]);
    const handleRemove = useCallback((i) => {
        const files = [...fileList];
        const changed = files.splice(i, 1);
        URL.revokeObjectURL(changed[0]?.src || "");
        if (!isControlled)
            setInternalFileList(files);
        onFilesChange?.(files, changed);
        onChange?.(files);
        onRemove?.(changed[0]);
        if (inputRef.current)
            inputRef.current.value = "";
    }, [fileList, isControlled, onFilesChange, onChange, onRemove]);
    const handlePreview = useCallback((i) => {
        preview({
            items: fileList,
            initial: i,
        });
    }, [fileList, preview]);
    const handleSortEnd = useCallback((before, after) => {
        const files = [...fileList];
        const nextFiles = arrayMove(files, before, after);
        if (!isControlled)
            setInternalFileList(nextFiles);
        onFilesChange?.(nextFiles, []);
        onChange?.(nextFiles);
    }, [fileList, isControlled, onFilesChange, onChange]);
    return (jsx(InputContainer, { as: "div", label: label, labelInline: labelInline, className: classNames("i-input-label-file", className), style: style, children: jsxs("div", { className: classNames("i-upload-inner", {
                [`i-upload-${mode}`]: mode !== "default",
            }), style: { ["--upload-card-size"]: cardSize }, children: [jsx(ListContainer, { sortable: sortable, onSortEnd: handleSortEnd, children: fileList.map((file, i) => {
                        const f = file;
                        const key = f.id ?? i;
                        const node = (jsx(FileListItem, { index: i, file: f, mode: mode, renderItem: renderItem, onRemove: handleRemove, onPreview: handlePreview }, key));
                        if (!sortable)
                            return node;
                        return jsx(SortableItem, { children: node }, key);
                    }) }), uploadMessage && (jsx("span", { className: "i-upload-message", children: uploadMessage })), fileList.length < limit &&
                    (droppable ? ((() => {
                        const node = (jsx(Dropbox, { multiple: multiple, accept: restProps.accept, disabled: disabled, onChange: handleChange, onDropFiles: handleDropFiles, children: dropbox }));
                        return getDropboxContainer
                            ? createPortal(node, getDropboxContainer())
                            : node;
                    })()) : (jsxs("label", { children: [jsx("input", { ...restProps, disabled: disabled, ref: inputRef, type: "file", className: "i-input-file-hidden", multiple: multiple, onChange: handleChange }), trigger] })))] }) }));
};

export { Upload as default };
