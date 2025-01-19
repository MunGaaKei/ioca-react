import {
	FormatBoldRound,
	FormatClearRound,
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

export const exec = (a, b?, c?) => document.execCommand(a, b, c);

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
	},
	italic: {
		icon: <FormatItalicRound />,
		onClick: () => exec("italic"),
	},
	underline: {
		icon: <FormatUnderlinedRound />,
		onClick: () => exec("underline"),
	},
	strike: {
		icon: <StrikethroughSRound />,
		onClick: () => exec("strikeThrough"),
	},
	redo: {
		icon: <RedoRound />,
		onClick: () => exec("redo"),
	},
	undo: {
		icon: <UndoRound />,
		onClick: () => exec("undo"),
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
		icon: <FormatClearRound />,
		onClick: () => exec("removeFormat"),
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
			const { icon, render, onClick } = fnMap[k];

			if (render) {
				return render(options);
			}

			return (
				<Button key={k} {...controlBtnProps} onClick={onClick}>
					<Icon icon={icon} />
				</Button>
			);
		}
		return <Fragment key={k} />;
	});
}
