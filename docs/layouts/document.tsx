import menu from "@d/config/menu";
import { Tree } from "@p";
import Area from "@p/components/area";
import { Outlet, useParams } from "react-router";
import Footer from "./footer";
import Sider from "./sider";

export default function Document() {
	const { name } = useParams<{ [key: string]: string }>();

	return (
		<Area>
			<Area.Item name='sider' style={{ width: 240 }}>
				<Tree
					data={menu}
					selected={`/docs/${name}`}
					nodeProps={{
						key: "href",
					}}
					className='pd-8'
				/>
			</Area.Item>

			<Area.Item>
				<div className='flex flex-1 pr-8'>
					<div
						className='px-12 pt-60 mx-auto g-content'
						style={{
							width: 1000,
							maxWidth: "calc(100% - 42px)",
						}}
					>
						<Outlet />

						<Footer />
					</div>

					<Sider />
				</div>
			</Area.Item>
		</Area>
	);
}
