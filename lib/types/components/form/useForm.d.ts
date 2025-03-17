/// <reference types="react" />

import { IForm } from './type.js';

declare class IFormInstance {
    readonly id?: string;
    data: Record<string, any>;
    cacheData: Record<string, any>;
    rules?: Pick<IForm, "rules">;
    constructor();
    get(field?: string): any;
    set(field: any, value?: any): void;
    delete(field: any): void;
    clear(): void;
    validate(field?: string): Promise<boolean | Record<string, any>>;
}
declare function useForm(form?: IFormInstance): IFormInstance;

export { IFormInstance, useForm as default };
