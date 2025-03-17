import { jsx } from 'react/jsx-runtime';
import { findAll } from 'highlight-words-core';
import { useMemo, Fragment } from 'react';
import Text from './text.js';

function HighLight(props) {
    const { keyword, text, escape, caseSensitive, renderWord = (word) => jsx("mark", { children: word }), ...restProps } = props;
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
            return highlight ? (jsx(Fragment, { children: renderWord(word) }, i)) : (word);
        });
        return result;
    }, [keyword, text, escape, caseSensitive]);
    return jsx(Text, { ...restProps, children: content });
}

export { HighLight as default };
//# sourceMappingURL=highlight.js.map
