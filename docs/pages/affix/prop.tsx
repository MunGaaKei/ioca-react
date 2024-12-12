import { Affix, Button, Icon } from "@p";
import { AdUnitsTwotone } from "@ricons/material";

export const DBasic = {
	demo: (
		<Affix
			bottom={20}
			right={20}
			offset={1}
			getContainer={() =>
				document.querySelector(".i-area-content > .i-area-scrollview")
			}
		>
			<Affix.ToTop className='bg-grey' />

			<Button square className='bg-green'>
				<Icon icon={<AdUnitsTwotone />} />
			</Button>
		</Affix>
	),
	code: `<Affix
    bottom={20}
    right={20}
    offset={1}
    getContainer={() =>
		document.querySelector(".i-area-content > .i-area-scrollview")
	}
>
    <Affix.ToTop className='bg-grey'/>

    <Button square className='bg-green'>
        <Icon icon={<AdUnitsTwotone />} />
    </Button>
</Affix>`,
	lang: "xml",
};

export const PAffix = [
	{
		name: "position",
		desc: "定位，参考CSS position属性",
		type: ["fixed", "absolute", "sticky", "static"],
		def: "'fixed'",
	},
	{
		name: "left | top | right | bottom",
		desc: "定位，参考CSS left属性",
		type: ["string", "number"],
	},
	{
		name: "offset",
		desc: "当容器滚动到一定位移值时，显示组件",
		type: ["string", "number"],
	},
	{
		name: "getContainer",
		desc: "指定容器DOM，组件将会在此渲染",
		type: ["() => HTMLElement"],
		def: "() => document.body",
	},
];
