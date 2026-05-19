'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var PubSub = require('pubsub-js');
var radash = require('radash');
var react = require('react');
var utils = require('./utils.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var PubSub__default = /*#__PURE__*/_interopDefaultCompat(PubSub);

class IFormInstance {
    id;
    data = {};
    cacheData = {};
    rules;
    constructor() {
        this.id = radash.uid(8);
        this.data = {};
    }
    get(field) {
        return field ? utils.getDeep(this.data, field) : this.data;
    }
    set(field, value) {
        const id = this.id;
        if (!this.data)
            return;
        if (typeof field === "string") {
            if (field.includes(".")) {
                const parts = field.split(".");
                for (let i = 1; i < parts.length; i++) {
                    const ancestor = parts.slice(0, i).join(".");
                    if (ancestor in this.data) {
                        console.warn(`[ioca-form] Field "${field}" conflicts with "${ancestor}". ` +
                            "Nested representation in form.get() may be inconsistent.");
                    }
                }
                utils.setDeep(this.data, field, value);
            }
            else {
                this.data[field] = value;
            }
            this.cacheData[field] = value;
            PubSub__default.publish(`${id}:set:${field}`, value);
            return;
        }
        Object.keys(field).forEach((name) => {
            if (name.includes("."))
                utils.setDeep(this.data, name, field[name]);
            else
                this.data[name] = field[name];
            this.cacheData[name] = field[name];
            PubSub__default.publish(`${id}:set:${name}`, field[name]);
        });
    }
    delete(field) {
        delete this.cacheData[field];
        if (field.includes("."))
            utils.deleteDeep(this.data, field);
        else
            delete this.data[field];
    }
    clear() {
        if (!this.data)
            return;
        const names = Object.keys(this.cacheData);
        this.cacheData = {};
        names.forEach((name) => {
            if (name.includes("."))
                utils.deleteDeep(this.data, name);
            else
                this.data[name] = undefined;
            PubSub__default.publish(`${this.id}:set:${name}`, undefined);
        });
    }
    async validate(field) {
        const { id, rules, data } = this;
        if (!rules)
            return data;
        const names = field ? [field] : Object.keys(this.cacheData);
        let isAllValid = true;
        names.forEach((name) => {
            const o = rules[name];
            if (!field && o === undefined)
                return;
            const rule = {
                validator: (v) => Array.isArray(v) ? v.length > 0 : ![undefined, null, ""].includes(v),
            };
            if (typeof o === "function")
                rule.validator = o;
            else if (o === true)
                rule.message = "required";
            else if (o)
                Object.assign(rule, o);
            const isValid = rule.validator?.(utils.getDeep(data, name), this);
            if (typeof isValid === "string")
                rule.message = isValid;
            if (isValid !== true) {
                PubSub__default.publish(`${id}:invalid:${name}`, {
                    message: rule.message,
                    status: "error",
                });
                isAllValid = false;
            }
            else {
                PubSub__default.publish(`${id}:invalid:${name}`, {
                    message: null,
                    status: "normal",
                });
            }
        });
        return field ? isAllValid : isAllValid ? data : false;
    }
}
function useForm(form) {
    const formRef = react.useRef(null);
    if (!formRef.current) {
        formRef.current = form ?? new IFormInstance();
    }
    return formRef.current;
}

exports.IFormInstance = IFormInstance;
exports.default = useForm;
//# sourceMappingURL=useForm.js.map
