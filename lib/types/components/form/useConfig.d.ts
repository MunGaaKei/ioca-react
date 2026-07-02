import * as react from 'react';
import { IFormInstance } from './useForm.js';
import { IFormItem, IForm } from './type.js';

declare function useConfig(configs: IFormItem[], formProps?: IForm): {
    form: IFormInstance;
    node: react.JSX.Element;
};

export { useConfig as default };
