import { Tabs } from "@p";
import Area from "@p/components/area";
import { useState } from "react";

export const DBasic = {
	demo: () => {
		const [layout, setLayout] = useState<any>("naruto");

		return (
			<>
				<Tabs active={layout} onTabChange={setLayout}>
					<Tabs.Item key='naruto' title='naruto'></Tabs.Item>
					<Tabs.Item key='goku' title='goku'></Tabs.Item>
				</Tabs>
				<div
					className='relative mt-4'
					style={{ height: 240, border: "1px solid var(--color-8)" }}
				>
					<Area>
						<Area.Item name='header' className='pd-8 bg-opacity'>
							Header
						</Area.Item>
						<Area.Item name={layout}>
							<Area.Item name='sider' className='pd-8 bg-blue-0'>
								<div style={{ height: "200%" }}>Sider</div>
							</Area.Item>
							<Area.Item className='pd-8 bg-green-0'>
								<div style={{ width: "200%", height: "200%" }}>
									Content
								</div>
							</Area.Item>
						</Area.Item>
					</Area>
				</div>
			</>
		);
	},
	code: `<Area layout='naruto'>
	<Area.Item name='header' className='pd-8 bg-opacity'>
		Header
	</Area.Item>
	<Area.Item name='sider' className='pd-8 bg-8'>
		Sider
	</Area.Item>
	<Area.Item className='pd-8 bg-9'>Content</Area.Item>
	<Area.Item name='footer' className='pd-8 bg-opacity'>
		Footer
	</Area.Item>
</Area>`,
	lang: "xml",
};

export const PArea = [
	{
		name: "layout",
		desc: "布局预设",
		type: ["naruto", "sasuke"],
		def: "'naruto'",
	},
];
