import * as react_jsx_runtime from 'react/jsx-runtime';
import { IFormInstance } from './useForm.js';
import { IFormItem, IForm } from './type.js';

declare function useConfig(configs: IFormItem[], formProps?: IForm): {
    form: IFormInstance;
    node: react_jsx_runtime.JSX.Element;
};

export { useConfig as default };
