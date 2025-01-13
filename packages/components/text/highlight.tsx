import { findAll } from "highlight-words-core";
import { Fragment, useMemo } from "react";
import Text from "./text";
import { ITextHighLight } from "./type";

export default function HighLight(props: ITextHighLight) {
	const {
		keyword,
		text,
		escape,
		caseSensitive,
		renderWord = (word) => <mark>{word}</mark>,
		...restProps
	} = props;

	const content = useMemo(() => {
		const source = text;
		const searchWords = typeof keyword === "string" ? [keyword] : keyword;

		const chunks = findAll({
			searchWords,
			textToHighlight: text,
			caseSensitive,
			autoEscape: escape,
		});

		const result = chunks.map((chunk, i) => {
			const { end, highlight, start } = chunk;
			const word = source.slice(start, end);

			return highlight ? (
				<Fragment key={i}>{renderWord(word)}</Fragment>
			) : (
				word
			);
		});

		return result;
	}, [keyword, text, escape, caseSensitive]);

	return <Text {...restProps}>{content}</Text>;
}
