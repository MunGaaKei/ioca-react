'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var highlight = require('./highlight.js');
var number = require('./number.js');
var text = require('./text.js');
var time = require('./time.js');

text.default.Number = number.default;
text.default.Time = time.default;
text.default.HighLight = highlight.default;

exports.default = text.default;
//# sourceMappingURL=index.js.map
