import { jsx, jsxs } from 'react/jsx-runtime';
import { AddRound } from '@ricons/material';
import classNames from 'classnames';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import CreateTag from './create.js';
import TagItem from './item.js';

function Pill(props) {
    const { value = [], tagProps, max, icon = jsx(AddRound, {}), className, label, labelInline, readonly, editable, onChange, onUpdate, validator, format, renderItem, ...restProps } = props;
    const [editingIndex, setEditingIndex] = useState(null);
    const [loadingSet, setLoadingSet] = useState(new Set());
    const instRef = useRef({
        props,
        editingIndex,
        loadingSet,
        setEditingIndex,
        setLoadingSet,
    });
    instRef.current.props = props;
    instRef.current.editingIndex = editingIndex;
    instRef.current.loadingSet = loadingSet;
    instRef.current.setEditingIndex = setEditingIndex;
    instRef.current.setLoadingSet = setLoadingSet;
    useEffect(() => {
        if (editingIndex !== null) {
            const el = document.querySelector(".i-pill-editing");
            el?.focus();
        }
    }, [editingIndex]);
    const cleanTagProps = useMemo(() => {
        if (!tagProps)
            return {};
        const { onClose, dot, dotClass, ...rest } = tagProps;
        return rest;
    }, [tagProps]);
    const handleClose = useCallback((index) => {
        const inst = instRef.current;
        if (inst.props.readonly)
            return;
        const hasAsync = !!inst.props.onUpdate;
        if (hasAsync)
            inst.setLoadingSet((prev) => new Set(prev).add(index));
        setTimeout(async () => {
            try {
                const { props } = instRef.current;
                const values = props.value ?? [];
                const item = values[index];
                if (item === undefined)
                    return;
                const result = props.onUpdate?.(undefined, item, "delete");
                if (result instanceof Promise) {
                    const ok = await result;
                    if (ok === false)
                        return;
                }
                const next = [...values];
                next.splice(index, 1);
                props.onChange?.(next);
            }
            finally {
                if (hasAsync) {
                    instRef.current.setLoadingSet((prev) => {
                        const s = new Set(prev);
                        s.delete(index);
                        return s;
                    });
                }
            }
        }, 0);
    }, []);
    const handleItemClick = useCallback((e, index) => {
        if (e.target.closest(".i-helpericon"))
            return;
        const inst = instRef.current;
        if (inst.props.readonly)
            return;
        if (index === -1 && inst.props.max !== undefined && (inst.props.value?.length ?? 0) >= inst.props.max)
            return;
        inst.setEditingIndex(index);
    }, []);
    const commitEdit = useCallback((index, text) => {
        const inst = instRef.current;
        const formatted = inst.props.format ? inst.props.format(text) : text;
        const hasAsync = !!(inst.props.validator || inst.props.onUpdate);
        if (hasAsync)
            inst.setLoadingSet((prev) => new Set(prev).add(index));
        setTimeout(async () => {
            try {
                const { props } = instRef.current;
                if (props.validator) {
                    const valid = await Promise.resolve(props.validator(formatted));
                    if (!valid)
                        return;
                }
                const values = props.value ?? [];
                if (index === -1) {
                    if (values.includes(formatted))
                        return;
                    const result = props.onUpdate?.(formatted, undefined, "create");
                    if (result instanceof Promise) {
                        const ok = await result;
                        if (ok === false)
                            return;
                    }
                    props.onChange?.([...values, formatted]);
                }
                else {
                    const oldValue = values[index];
                    if (oldValue === formatted)
                        return;
                    const result = props.onUpdate?.(formatted, oldValue, "update");
                    if (result instanceof Promise) {
                        const ok = await result;
                        if (ok === false)
                            return;
                    }
                    const next = [...values];
                    next[index] = formatted;
                    props.onChange?.(next);
                }
            }
            finally {
                if (hasAsync) {
                    instRef.current.setLoadingSet((prev) => {
                        const s = new Set(prev);
                        s.delete(index);
                        return s;
                    });
                }
                instRef.current.setEditingIndex(null);
            }
        }, 0);
    }, []);
    const handleBlur = useCallback((index) => {
        const inst = instRef.current;
        if (inst.loadingSet.has(index))
            return;
        const el = document.querySelector(".i-pill-editing");
        const text = el?.textContent?.trim();
        if (!text) {
            if (index !== -1) {
                handleClose(index);
            }
            else {
                inst.setEditingIndex(null);
            }
            return;
        }
        commitEdit(index, text);
    }, []);
    const handleKeyDown = useCallback((e, index) => {
        const inst = instRef.current;
        if (inst.loadingSet.has(index))
            return;
        if (e.key === "Enter") {
            e.preventDefault();
            const text = e.currentTarget.textContent?.trim();
            if (!text) {
                if (index !== -1) {
                    handleClose(index);
                }
                else {
                    inst.setEditingIndex(null);
                }
                return;
            }
            commitEdit(index, text);
        }
        else if (e.key === "Escape") {
            e.preventDefault();
            if (index !== -1) {
                const original = inst.props.value?.[index];
                if (original !== undefined) {
                    e.currentTarget.textContent = original;
                }
            }
            inst.setEditingIndex(null);
        }
    }, []);
    const handleStartCreate = useCallback(() => {
        const inst = instRef.current;
        if (inst.props.readonly)
            return;
        if (inst.props.max !== undefined && (inst.props.value?.length ?? 0) >= inst.props.max)
            return;
        inst.setEditingIndex(-1);
    }, []);
    const canCreate = !readonly && (max === undefined || value.length < max);
    return (jsxs("div", { className: classNames("i-pills i-input-label", { "i-input-inline": labelInline }, className), ...restProps, children: [label && jsx("span", { className: "i-input-label-text", children: label }), jsxs("div", { className: "i-pill-list", children: [value.map((item, i) => (jsx(TagItem, { item: item, index: i, isEditing: editingIndex === i, isLoading: loadingSet.has(i), tagProps: tagProps, editable: editable, readonly: readonly, renderItem: renderItem, onClose: handleClose, onClick: handleItemClick, onBlur: handleBlur, onKeyDown: handleKeyDown }, i))), canCreate && jsx(CreateTag, { isEditing: editingIndex === -1, isLoading: loadingSet.has(-1), createTagProps: cleanTagProps, tagProps: tagProps, onBlur: handleBlur, onKeyDown: handleKeyDown, onStartCreate: handleStartCreate })] })] }));
}

export { Pill as default };
