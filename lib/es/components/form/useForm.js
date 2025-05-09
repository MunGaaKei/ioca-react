import PubSub from 'pubsub-js';
import { uid } from 'radash';
import { useRef } from 'react';

class IFormInstance {
    id;
    data = {};
    cacheData = {};
    rules = {};
    constructor() {
        this.id = uid(8);
        this.data = {};
    }
    get(field) {
        return field ? this.data[field] : this.data;
    }
    set(field, value) {
        const id = this.id;
        if (!this.data)
            return;
        if (typeof field === "string") {
            this.data[field] = value;
            this.cacheData[field] = value;
            PubSub.publish(`${id}:set:${field}`, value);
            return;
        }
        Object.keys(field).map((name) => {
            this.data[name] = field[name];
            this.cacheData[name] = field[name];
            PubSub.publish(`${id}:set:${name}`, field[name]);
        });
    }
    delete(field) {
        delete this.data[field];
    }
    clear() {
        if (!this.data)
            return;
        this.cacheData = {};
        Object.keys(this.data).map((name) => {
            PubSub.publish(`${this.id}:set:${name}`, undefined);
            this.data[name] = undefined;
        });
    }
    async validate(field) {
        const { id, rules, data } = this;
        if (!rules)
            return data;
        if (field) {
            const o = rules[field];
            const rule = {
                validator: (v) => Array.isArray(v)
                    ? v.length > 0
                    : ![undefined, null, ""].includes(v),
                message: undefined,
            };
            if (typeof o === "function") {
                rule.validator = o;
            }
            else if (o === true) {
                rule.validator = (v) => ![undefined, null, ""].includes(v);
                rule.message = "required";
            }
            else {
                Object.assign(rule, o);
            }
            const isValid = rule.validator?.(data[field], this);
            if (typeof isValid === "string") {
                rule.message = isValid;
            }
            if (isValid !== true) {
                PubSub.publish(`${id}:invalid:${field}`, {
                    message: rule.message,
                    status: "error",
                });
                return false;
            }
            PubSub.publish(`${id}:invalid:${name}`, {
                message: null,
                status: "normal",
            });
            return true;
        }
        let isAllValid = true;
        Object.keys(data).map((name) => {
            const o = rules[name];
            if (o === undefined)
                return;
            const rule = {
                validator: (v) => (Array.isArray(v) ? v.length > 0 : !!v),
                message: undefined,
            };
            if (typeof o === "function") {
                rule.validator = o;
            }
            else if (o === true) {
                rule.validator = (v) => ![undefined, null, ""].includes(v);
                rule.message = "required";
            }
            else {
                Object.assign(rule, o);
            }
            const isValid = rule.validator?.(data[name], this);
            if (typeof isValid === "string") {
                rule.message = isValid;
            }
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
        return isAllValid ? Promise.resolve(data) : false;
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
//# sourceMappingURL=useForm.js.map
