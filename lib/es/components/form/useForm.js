import PubSub from 'pubsub-js';
import { uid } from 'radash';
import { useRef } from 'react';
import { getDeep, setDeep, deleteDeep } from './utils.js';

class IFormInstance {
    id;
    data = {};
    cacheData = {};
    rules;
    constructor() {
        this.id = uid(8);
        this.data = {};
    }
    get(field) {
        return field ? getDeep(this.data, field) : this.data;
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
                        console.warn(`[ioca-form] Field "${field}" conflicts with "${ancestor}". ` + "Nested representation in form.get() may be inconsistent.");
                    }
                }
                setDeep(this.data, field, value);
            }
            else {
                this.data[field] = value;
            }
            this.cacheData[field] = value;
            PubSub.publish(`${id}:set:${field}`, value);
            return;
        }
        Object.keys(field).forEach((name) => {
            if (name.includes("."))
                setDeep(this.data, name, field[name]);
            else
                this.data[name] = field[name];
            this.cacheData[name] = field[name];
            PubSub.publish(`${id}:set:${name}`, field[name]);
        });
    }
    delete(field) {
        delete this.cacheData[field];
        if (field.includes("."))
            deleteDeep(this.data, field);
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
                deleteDeep(this.data, name);
            else
                this.data[name] = undefined;
            PubSub.publish(`${this.id}:set:${name}`, undefined);
        });
    }
    async validate(field) {
        const { id, rules, data } = this;
        if (!rules)
            return data;
        const names = field ? [field] : [...new Set([...Object.keys(this.cacheData), ...Object.keys(rules)])];
        let isAllValid = true;
        names.forEach((name) => {
            const o = rules[name];
            if (!field && o === undefined)
                return;
            const rule = {
                validator: (v) => (Array.isArray(v) ? v.length > 0 : ![undefined, null, ""].includes(v)),
            };
            if (typeof o === "function")
                rule.validator = o;
            else if (o === true)
                rule.message = "required";
            else if (o)
                Object.assign(rule, o);
            const isValid = rule.validator?.(getDeep(data, name), this);
            if (typeof isValid === "string")
                rule.message = isValid;
            if (isValid !== true) {
                PubSub.publish(`${id}:invalid:${name}`, {
                    message: rule.message,
                    status: "error",
                });
                isAllValid = false;
            }
            else {
                PubSub.publish(`${id}:invalid:${name}`, {
                    message: null,
                    status: "normal",
                });
            }
        });
        return isAllValid ? data : false;
    }
}
function useForm(form) {
    const formRef = useRef(null);
    if (!formRef.current) {
        formRef.current = form ?? new IFormInstance();
    }
    return formRef.current;
}

export { IFormInstance, useForm as default };
