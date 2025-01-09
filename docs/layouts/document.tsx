import menu from "@d/config/menu";
import { Tree } from "@p";
import Area from "@p/components/area";
import { configResponsive, useResponsive } from "ahooks";
import { Outlet, useLocation } from "react-router";
import Footer from "./footer";
import Sider from "./sider";

configResponsive({
	sm: 800,
});

export default function Document() {
	const name = useLocation().pathname.split("/").at(-1);
	const { sm: staticSider } = useResponsive();
	const menus = (
		<Tree
			data={menu}
			selected={`/docs/${name}`}
			nodeProps={{
				key: "href",
			}}
			className='pd-8'
		/>
	);

	return (
		<Area>
			{staticSider && (
				<Area.Item name='sider' style={{ width: 240 }}>
					{menus}
				</Area.Item>
			)}

			<Area.Item>
				<div className='flex flex-1'>
					<div
						className='px-12 pt-60 mx-auto g-content'
						style={{
							width: 1000,
							maxWidth: staticSider
								? "calc(100% - 42px)"
								: "100%",
						}}
					>
						<Outlet />

						<Footer />
					</div>

					<Sider useDrawer={!staticSider} menus={menus} />
				</div>
			</Area.Item>
		</Area>
	);
}
