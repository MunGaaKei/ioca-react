import {
    Button,
    Checkbox,
    DatePicker,
    Flex,
    Form,
    Input,
    Message,
    Radio,
    Select,
    Upload,
} from "@p";

export const DBasic = {
    demo: () => {
        const { Field, useForm } = Form;
        const form = useForm();
        const rules = {
            name: true,
            password: {
                validator: (v) => v === "123",
                message: "密码错误",
            },
            age: {
                validator: (v) => v > 17,
                message: "不能小于17岁",
            },
            gender: true,
        };

        const handleSubmit = () => {
            Message("可以打开控制台查看数据");
            console.log(form.get());
        };

        const handleSetValues = () => {
            form.set("name", "scott");
        };

        const handleClear = () => {
            form.clear();
        };

        const handleValidate = async () => {
            const data = await form.validate();

            Message({
                content: data ? "✌️ 校验成功" : "😣 校验失败",
                className: data ? "bg-blue" : "bg-pink",
            });
        };

        return (
            <Form form={form} rules={rules} width={420} onEnter={handleSubmit}>
                <Field name="name" required>
                    <Input labelInline label="名字" maxLength={4} />
                </Field>
                <Field name="password" required>
                    <Input
                        type="password"
                        label="密码"
                        tip="3位数字"
                        maxLength={12}
                        append={
                            <Button
                                className="bg-blue"
                                onClick={() => {
                                    form.validate("password");
                                }}
                            >
                                校验
                            </Button>
                        }
                    />
                </Field>

                <Field name="age">
                    <Input.Number label="年龄" max={150} min={1} />
                </Field>
                <Field name="weight">
                    <Input.Range label="体重范围" min={0} />
                </Field>

                <Field name="gender" required>
                    <Radio
                        label="性别"
                        options={["男", "女", "无"]}
                        labelInline
                    />
                </Field>
                <Field name="birth">
                    <DatePicker label="生日" labelInline />
                </Field>
                <Field name="hobby">
                    <Checkbox
                        label="兴趣"
                        options={["足球", "篮球", "棒球", "排球", "橄榄球"]}
                        type="switch"
                        labelInline
                    />
                </Field>
                <Field name="files">
                    <Upload label="文件" mode="card" multiple />
                </Field>
                <Field name="country">
                    <Select
                        label="国家"
                        options={[
                            "中国",
                            "新加坡",
                            "俄罗斯",
                            "日本",
                            "泰国",
                            {
                                label: "美国",
                                value: "美国",
                                disabled: true,
                            },
                        ]}
                        placeholder="国家"
                        multiple
                    />
                </Field>
                <Field name="desc">
                    <Input.Textarea
                        label="说明"
                        rows={3}
                        autoSize
                        resize={false}
                    />
                </Field>

                <Flex className="gap-12 colspan-full">
                    <Button onClick={handleSubmit}>获取表单值</Button>
                    <Button onClick={handleValidate} className="bg-pink">
                        校验表单
                    </Button>
                    <Button onClick={handleSetValues} className="bg-blue">
                        填写表单
                    </Button>
                    <Button onClick={handleClear} className="bg-yellow">
                        清空
                    </Button>
                </Flex>
            </Form>
        );
    },
    code: `const { Field, useForm } = Form;
const form = useForm();
const rules = {
	name: true,
	password: {
		validator: (v) => v === "123",
		message: "密码错误",
	},
	age: {
		validator: (v) => v > 17,
		message: "不能小于17岁",
	},
	gender: true,
};

const handleSubmit = () => {
	Message("可以打开控制台查看数据");
	console.log(form.get());
};

const handleSetValues = () => {
	form.set("name", "scott");
};

const handleClear = () => {
	form.clear();
};

const handleValidate = async () => {
	const data = await form.validate();

	Message({
		content: data ? "✌️ 校验成功" : "😣 校验失败",
		className: data ? "bg-blue" : "bg-pink",
	});
};

return (
	<Form form={form} rules={rules} width={420} onEnter={handleSubmit}>
		<Field name='name' required>
			<Input labelInline label='名字' />
		</Field>
		<Field name='password' required>
			<Input
				type='password'
				label='密码'
				tip='3位数字'
				append={
					<Button
						className='bg-blue'
						onClick={() => {
							form.validate("password");
						}}
					>
						校验
					</Button>
				}
			/>
		</Field>
		<Flex>
			<Field name='age'>
				<Input.Number label='年龄' max={150} min={1} />
			</Field>
			<Field name='weight'>
				<Input.Range label='体重范围' min={0} />
			</Field>
		</Flex>
		<Field name='gender' required>
			<Radio
				label='性别'
				options={["男", "女", "无"]}
				labelInline
			/>
		</Field>
		<Field name='birth'>
			<Datepicker label='生日' labelInline />
		</Field>
		<Field name='interest'>
			<Checkbox
				label='兴趣'
				options={["足球", "篮球", "棒球", "排球", "橄榄球"]}
				type='switch'
				labelInline
			/>
		</Field>
		<Field name='files'>
			<Upload label='文件' mode='card' multiple />
		</Field>
		<Field name='country'>
			<Select
				label='国家'
				options={[
					"中国",
					"新加坡",
					"俄罗斯",
					"日本",
					"泰国",
					{
						label: "美国",
						value: "美国",
						disabled: true,
					},
				]}
				placeholder='国家'
				multiple
			/>
		</Field>
		<Field name='desc'>
			<Input.Textarea label='说明' rows={2} autoSize />
		</Field>

		<Flex className='gap-12'>
			<Button onClick={handleSubmit}>获取表单值</Button>
			<Button onClick={handleValidate} className='bg-pink'>
				校验表单
			</Button>
			<Button onClick={handleSetValues} className='bg-blue'>
				填写表单
			</Button>
			<Button onClick={handleClear} className='bg-yellow'>
				清空
			</Button>
		</Flex>
	</Form>
);`,
    lang: "javascript",
};

const configs = [
    {
        name: "name",
        label: "名字",
        required: true,
        component: Input,
    },
    {
        name: "age",
        label: "年龄",
        component: Input.Number,
    },
    {
        name: "bio",
        label: "简介",
        component: Input.Textarea,
        colspan: 2,
        shouldRender: (values) => !!values.name,
    },
];

export const DUseConfig = {
    demo: () => {
        const { form, node } = Form.useConfig(configs, {
            columns: 2,
            width: 420,
            rules: {
                name: true,
            },
        });

        const handleSubmit = async () => {
            const data = await form.validate();
            Message("可以打开控制台查看数据");
            console.log(data);
        };

        return (
            <>
                {node}
                <Flex className="mt-12">
                    <Button onClick={handleSubmit}>获取表单值</Button>
                </Flex>
            </>
        );
    },
    lang: "javascript",
    code: `const configs = [
	{
		name: "name",
		label: "名字",
		required: true,
		component: Input,
	},
	{
		name: "age",
		label: "年龄",
		component: Input.Number,
	},
	{
		name: "bio",
		label: "简介",
		component: Input.Textarea,
		colspan: 2,
		shouldRender: (values) => !!values.name,
	},
];

const { form, node } = Form.useConfig(configs, {
	columns: 2,
	width: 420,
	rules: {
		name: true,
	},
});

const handleSubmit = async () => {
	const data = await form.validate();
	Message("可以打开控制台查看数据");
	console.log(data);
};

return (
	<>
		{node}
		<Flex className='mt-12'>
			<Button onClick={handleSubmit}>获取表单值</Button>
		</Flex>
	</>
);`,
};

export const PForm = [
    {
        name: "form",
        desc: "表单实例，通过 Form.useForm() 返回",
        type: [
            <a href="#formInstance" className="blue">
                FormInstance
            </a>,
        ],
    },
    {
        name: "rules",
        desc: "校验规则",
        type: [
            <>
                ([fieldName: string]: (value: any, form:
                <a href="#formInstance" className="blue">
                    FormInstance
                </a>
                ) =&gt; string | boolean)[]
            </>,
        ],
    },
    {
        name: "initialValues",
        desc: "初始表单值",
        type: ["Record<string, any>"],
    },
    {
        name: "width",
        desc: "表单宽度",
        type: ["string", "number"],
    },
    {
        name: "gap",
        desc: "控件间隔",
        type: ["string", "number"],
        def: "'1em'",
    },
    {
        name: "labelInline",
        desc: "标签与输入框同一行",
        type: ["boolean"],
        def: "false",
    },
    {
        name: "labelWidth",
        desc: "标签宽度",
        type: ["string"],
    },
    {
        name: "labelRight",
        desc: "标签文本右对齐",
        type: ["boolean"],
        def: "false",
    },
    {
        name: "columns",
        desc: "表单分列",
        type: ["string", "number"],
        def: "1",
        exp: true,
    },
    {
        name: "itemMaxWidth",
        desc: "表单项最大宽度，设置后会自动计算列数",
        type: ["string"],
        exp: true,
    },
    {
        name: "onEnter",
        desc: "回车键按下调用",
        type: [
            <>
                (values: Record&lt;string, any&gt;, form:
                <a href="#formInstance" className="blue">
                    FormInstance
                </a>
                ) =&gt; void
            </>,
        ],
        event: true,
    },
    {
        name: "onChange",
        desc: "表单值修改时触发",
        type: ["(name: string, value: any) => void"],
        event: true,
    },
];

export const PField = [
    {
        name: "name",
        desc: "表单字段名",
        type: ["string"],
    },
];

export const PFormInstance = `interface IFormInstance {
	data: Record<string, any>

	get: (field: string) => any

	set: (field: string, value: any) => void | (data: Record<string, any>) => void

	validate: (field?: string) => isValid ? data: false

	delete: (field: string) => void

	clear: () => void
}
`;
