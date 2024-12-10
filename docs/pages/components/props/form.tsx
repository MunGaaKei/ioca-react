import {
	Button,
	Checkbox,
	Datepicker,
	Flex,
	Form,
	Input,
	Message,
	Radio,
	Select,
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
			<Form form={form} rules={rules} width={420} className='gap-12'>
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
					<Input.Textarea label='说明' rows={3} autoSize />
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
	<Form form={form} rules={rules} width={420} className='gap-12'>
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

export const PForm = [
	{
		name: "form",
		desc: "表单实例，通过 Form.useForm() 返回",
		type: [
			<a href='#formInstance' className='blue'>
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
				<a href='#formInstance' className='blue'>
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

	clear: () => void
}
`;
