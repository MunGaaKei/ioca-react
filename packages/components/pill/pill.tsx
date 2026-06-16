import { AddRound } from "@ricons/material";
import classNames from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CreateTag from "./create";
import "./index.css";
import TagItem from "./item";
import type { IPill } from "./type";

function Pill(props: IPill) {
    const { value = [], tagProps, max, icon = <AddRound />, className, label, labelInline, readonly, editable, onChange, onUpdate, validator, format, renderItem, hideCreate, ...restProps } = props;

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [loadingSet, setLoadingSet] = useState<Set<number>>(new Set());

    const instRef = useRef({
        props,
        editingIndex,
        loadingSet,
        setEditingIndex,
        setLoadingSet,
    } as {
        props: IPill;
        editingIndex: number | null;
        loadingSet: Set<number>;
        setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
        setLoadingSet: React.Dispatch<React.SetStateAction<Set<number>>>;
    });
    instRef.current.props = props;
    instRef.current.editingIndex = editingIndex;
    instRef.current.loadingSet = loadingSet;
    instRef.current.setEditingIndex = setEditingIndex;
    instRef.current.setLoadingSet = setLoadingSet;

    useEffect(() => {
        if (editingIndex !== null) {
            const el = document.querySelector(".i-pill-editing");
            (el as HTMLElement)?.focus();
        }
    }, [editingIndex]);

    const cleanTagProps = useMemo(() => {
        if (!tagProps) return {};
        const { onClose, dot, dotClass, ...rest } = tagProps as any;
        return rest;
    }, [tagProps]);

    const handleClose = useCallback((index: number) => {
        const inst = instRef.current;
        if (inst.props.readonly) return;
        const hasAsync = !!inst.props.onUpdate;
        if (hasAsync) inst.setLoadingSet((prev) => new Set(prev).add(index));

        setTimeout(async () => {
            try {
                const { props } = instRef.current;
                const values = props.value ?? [];
                const item = values[index];
                if (item === undefined) return;

                const result = props.onUpdate?.(undefined, item, "delete");
                if (result instanceof Promise) {
                    const ok = await result;
                    if (ok === false) return;
                }

                const next = [...values];
                next.splice(index, 1);
                props.onChange?.(next);
            } finally {
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

    const handleItemClick = useCallback((e: React.MouseEvent, index: number) => {
        if ((e.target as HTMLElement).closest(".i-helpericon")) return;
        const inst = instRef.current;
        if (inst.props.readonly) return;
        if (index === -1 && inst.props.max !== undefined && (inst.props.value?.length ?? 0) >= inst.props.max) return;
        inst.setEditingIndex(index);
    }, []);

    const commitEdit = useCallback((index: number, text: string) => {
        const inst = instRef.current;
        const formatted = inst.props.format ? inst.props.format(text) : text;
        const hasAsync = !!(inst.props.validator || inst.props.onUpdate);
        if (hasAsync) inst.setLoadingSet((prev) => new Set(prev).add(index));

        setTimeout(async () => {
            try {
                const { props } = instRef.current;

                if (props.validator) {
                    const valid = await Promise.resolve(props.validator(formatted));
                    if (!valid) return;
                }

                const values = props.value ?? [];
                if (index === -1) {
                    if (values.includes(formatted)) return;
                    const result = props.onUpdate?.(formatted, undefined, "create");
                    if (result instanceof Promise) {
                        const ok = await result;
                        if (ok === false) return;
                    }
                    props.onChange?.([...values, formatted]);
                } else {
                    const oldValue = values[index];
                    if (oldValue === formatted) return;
                    const result = props.onUpdate?.(formatted, oldValue, "update");
                    if (result instanceof Promise) {
                        const ok = await result;
                        if (ok === false) return;
                    }
                    const next = [...values];
                    next[index] = formatted;
                    props.onChange?.(next);
                }
            } finally {
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

    const handleBlur = useCallback((index: number) => {
        const inst = instRef.current;
        if (inst.loadingSet.has(index)) return;

        const el = document.querySelector(".i-pill-editing");
        const text = el?.textContent?.trim();
        if (!text) {
            if (index !== -1) {
                handleClose(index);
            } else {
                inst.setEditingIndex(null);
            }
            return;
        }

        commitEdit(index, text);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLSpanElement>, index: number) => {
        const inst = instRef.current;
        if (inst.loadingSet.has(index)) return;

        if (e.key === "Enter") {
            e.preventDefault();
            const text = e.currentTarget.textContent?.trim();
            if (!text) {
                if (index !== -1) {
                    handleClose(index);
                } else {
                    inst.setEditingIndex(null);
                }
                return;
            }
            commitEdit(index, text);
        } else if (e.key === "Escape") {
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
        if (inst.props.readonly) return;
        if (inst.props.max !== undefined && (inst.props.value?.length ?? 0) >= inst.props.max) return;
        inst.setEditingIndex(-1);
    }, []);

    const canCreate = !hideCreate && !readonly && (max === undefined || value.length < max);

    return (
        <div className={classNames("i-pills i-input-label", { "i-input-inline": labelInline }, className)} {...restProps}>
            {label && <span className="i-input-label-text">{label}</span>}

            <div className="i-pill-list">
                {value.map((item, i) => (
                    <TagItem key={i} item={item} index={i} isEditing={editingIndex === i} isLoading={loadingSet.has(i)} tagProps={tagProps} editable={editable} readonly={readonly} renderItem={renderItem} onClose={handleClose} onClick={handleItemClick} onBlur={handleBlur} onKeyDown={handleKeyDown} />
                ))}

                {canCreate && <CreateTag isEditing={editingIndex === -1} isLoading={loadingSet.has(-1)} createTagProps={cleanTagProps} tagProps={tagProps} onBlur={handleBlur} onKeyDown={handleKeyDown} onStartCreate={handleStartCreate} />}
            </div>
        </div>
    );
}

export default Pill;
