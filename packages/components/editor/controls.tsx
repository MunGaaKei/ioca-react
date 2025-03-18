import {
	ClearAllRound,
	FormatBoldRound,
	FormatItalicRound,
	FormatUnderlinedRound,
	RedoRound,
	StrikethroughSRound,
	UndoRound,
} from "@ricons/material";
import { Fragment } from "react/jsx-runtime";
import { escapeAttrValue } from "xss";
import Button from "../button";
import Icon from "../icon";

export const exec = (a, b?, c?) => {
	if (typeof document === "undefined") return;
	return document.execCommand(a, b, c);
};

export const xssOptions = {
	onIgnoreTagAttr: function (tag, name, value) {
		if (["data-", "style"].includes(name.substr(0, 5))) {
			return name + '="' + escapeAttrValue(value) + '"';
		}
	},
};

const fnMap = {
	bold: {
		icon: <FormatBoldRound />,
		onClick: () => exec("bold"),
		tip: "粗体",
	},
	italic: {
		icon: <FormatItalicRound />,
		onClick: () => exec("italic"),
		tip: "斜体",
	},
	underline: {
		icon: <FormatUnderlinedRound />,
		onClick: () => exec("underline"),
		tip: "下划线",
	},
	strike: {
		icon: <StrikethroughSRound />,
		onClick: () => exec("strikeThrough"),
		tip: "删除线",
	},
	redo: {
		icon: <RedoRound />,
		onClick: () => exec("redo"),
		tip: "重做",
	},
	undo: {
		icon: <UndoRound />,
		onClick: () => exec("undo"),
		tip: "撤销",
	},
	// color: {
	// 	icon: <FormatColorTextRound />,
	// 	onClick: () => exec("foreColor", false, ""),
	// },
	// backColor: {
	// 	icon: <FormatColorFillRound />,
	// 	onClick: () => exec("backColor", false, ""),
	// },
	clear: {
		icon: <ClearAllRound />,
		onClick: () => exec("removeFormat"),
		tip: "清除格式",
	},
};

const aliasMap = {
	simple: ["undo", "redo", "bold", "italic", "underline", "strike", "clear"],
	all: Object.keys(fnMap),
};

export default function getControls(fns, options) {
	const { controlBtnProps } = options;
	const keys = typeof fns === "string" ? aliasMap[fns] : fns;

	return keys.map((k) => {
		if (fnMap[k]) {
			const { icon, render, tip, onClick } = fnMap[k];

			if (render) {
				return render(options);
			}

			return (
				<Button key={k} {...controlBtnProps} onClick={onClick}>
					<Icon icon={icon} />
					{tip && <span className='i-editor-control-tip'>{tip}</span>}
				</Button>
			);
		}
		return <Fragment key={k} />;
	});
}
