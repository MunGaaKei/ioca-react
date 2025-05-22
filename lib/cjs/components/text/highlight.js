'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var highlightWordsCore = require('highlight-words-core');
var react = require('react');
var text = require('./text.js');

function HighLight(props) {
    const { keyword, text: text$1, escape, caseSensitive, renderWord = (word) => jsxRuntime.jsx("mark", { children: word }), ...restProps } = props;
    const content = react.useMemo(() => {
        const source = text$1;
        const searchWords = typeof keyword === "string" ? [keyword] : keyword;
        const chunks = highlightWordsCore.findAll({
            searchWords,
            textToHighlight: text$1,
            caseSensitive,
            autoEscape: escape,
        });
        const result = chunks.map((chunk, i) => {
            const { end, highlight, start } = chunk;
            const word = source.slice(start, end);
            return highlight ? (jsxRuntime.jsx(react.Fragment, { children: renderWord(word) }, i)) : (word);
        });
        return result;
    }, [keyword, text$1, escape, caseSensitive]);
    return jsxRuntime.jsx(text.default, { ...restProps, children: content });
}

exports.default = HighLight;
//# sourceMappingURL=highlight.js.map
