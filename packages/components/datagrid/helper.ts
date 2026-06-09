import type { IColumn } from "./type";

const lengthRe =
	/^-?\d+(\.\d+)?(px|em|rem|%|vw|vh|vmin|vmax|ch|ex|cm|mm|in|pt|pc)$/;

const isLength = (v: string) => {
	if (v === "0") return true;
	if (v.startsWith("var(") || v.startsWith("calc(")) return true;
	return lengthRe.test(v);
};

const sumLengths = (parts: string[]) => {
	let out: string[] | null = null;
	for (let i = 0; i < parts.length; i++) {
		const v = parts[i];
		if (!v || !isLength(v)) continue;
		if (out == null) out = [v];
		else out.push(v);
	}
	if (out == null || out.length < 1) return "0";
	if (out.length === 1) return out[0];
	return `calc(${out.join(" + ")})`;
};

const toCssWidth = (w: number | string) =>
	typeof w === "number" ? `${w}px` : w;

export const buildGridTemplateColumns = (
	widths: (number | string)[],
	overrideIndex?: number,
	overrideWidth?: number,
) => buildCssWidths(widths, overrideIndex, overrideWidth).join(" ");

export const hasArrayChanged = (
	a: (number | string)[],
	b: (number | string)[],
): boolean => a.length !== b.length || a.some((v, i) => v !== b[i]);

export const buildCssWidths = (
	widths: (number | string)[],
	overrideIndex?: number,
	overrideWidth?: number,
) => {
	const out = new Array<string>(widths.length);
	for (let i = 0; i < widths.length; i++) {
		const w =
			i === overrideIndex && overrideWidth != null
				? overrideWidth
				: widths[i];
		out[i] = toCssWidth(w);
	}
	return out;
};

export const applyFixedInsets = (
	setVar: (name: string, value: string) => void,
	columns: IColumn[],
	cssWidths: string[],
) => {
	for (let i = 0; i < columns.length; i++) {
		const fixed = columns[i]?.fixed;
		if (!fixed) continue;

		if (fixed === "left" && i === 0) {
			setVar(`--datagrid-cell-inset-0`, "0");
			continue;
		}

		if (fixed === "right" && i === columns.length - 1) {
			setVar(`--datagrid-cell-inset-${columns.length - 1}`, "auto 0");
			continue;
		}

		if (fixed === "left") {
			const parts: string[] = [];
			for (let j = 0; j < i; j++) {
				if (columns[j]?.fixed === "left") parts.push(cssWidths[j]);
			}
			setVar(`--datagrid-cell-inset-${i}`, `${sumLengths(parts)} auto`);
			continue;
		}

		const parts: string[] = [];
		for (let j = i + 1; j < columns.length; j++) {
			if (columns[j]?.fixed === "right") parts.push(cssWidths[j]);
		}
		setVar(`--datagrid-cell-inset-${i}`, `auto ${sumLengths(parts)}`);
	}
};
