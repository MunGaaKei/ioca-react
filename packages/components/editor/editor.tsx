import classNames from "classnames";
import { useImperativeHandle, useRef } from "react";
import xss from "xss";
import { IButton } from "../button/type";
import getControls, { exec, xssOptions } from "./controls";
import "./index.css";
import { IEditor } from "./type";

const Editor = (props: IEditor) => {
	const {
		ref,
		width,
		height = "10em",
		placeholder,
		autosize,
		border = true,
		richPaste,
		controls = "simple",
		onInput,
	} = props;
	const editorRef = useRef<HTMLDivElement>(null);
	const controlBtnProps: IButton = {
		square: true,
		flat: true,
		size: "small",
	};

	const handlePaste = async (e) => {
		if (richPaste) return;
		e.preventDefault();
		const text = e.clipboardData.getData("text/plain");
		exec("insertText", false, text);
	};

	const handleKeyDown = (e) => {
		switch (e.key) {
			case "Tab":
				e.preventDefault();
				exec("insertHTML", false, "&#09;");
				break;
			case "Enter":
				e.preventDefault();
				exec("insertLineBreak");

				if (!editorRef.current) return;
				editorRef.current.scrollBy({
					top: 20,
					left: -1000,
					behavior: "smooth",
				});

				if (!autosize) return;
				editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;

				break;
			default:
				break;
		}
	};

	useImperativeHandle(ref, () => {
		return {
			setValue(html) {
				if (!editorRef.current) return;
				const safeHtml = xss(html, xssOptions);

				editorRef.current.innerHTML = safeHtml;
			},
			getSafeValue() {
				const html = editorRef.current?.innerHTML ?? "";

				return xss(html, xssOptions);
			},
		};
	});

	const handleInput = (e) => {
		let html = editorRef.current?.innerHTML ?? "";

		if (["<br>", "\n"].includes(html) && editorRef.current) {
			html = "";
			editorRef.current.innerHTML = html;
		}

		onInput?.(html, e);
	};

	return (
		<div
			className={classNames("i-editor", {
				"i-editor-borderless": !border,
			})}
			style={{ [autosize ? "minHeight" : "height"]: height, width }}
		>
			{controls !== "none" && (
				<div className='i-editor-controls'>
					{getControls(controls, {
						controlBtnProps,
					})}
				</div>
			)}

			<div
				ref={editorRef}
				className='i-editor-content'
				data-placeholder={placeholder}
				contentEditable
				onPaste={handlePaste}
				onInput={handleInput}
				onKeyDown={handleKeyDown}
			/>
		</div>
	);
};

export default Editor;
