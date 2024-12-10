import menu from "@d/config/menu";
import { Loading, Tree } from "@p";
import Area from "@p/components/area";
import { Suspense, lazy, memo } from "react";
import { useParams } from "react-router-dom";
import Footer from "./footer";
import "./global.css";
import Sider from "./sider";

interface DProps {
	name?: string;
}

const DynamicPage = memo(
	(props: DProps) => {
		const { name } = props;
		const Page = lazy(() => import(`../pages/${name}`));

		return (
			<Suspense fallback={<Loading />}>
				<Page />
			</Suspense>
		);
	},
	(p, n) => p.name === n.name
);

export default function Document(): JSX.Element {
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
						className='px-12 pt-80 mx-auto'
						style={{
							width: 1000,
							maxWidth: "calc(100% - 42px)",
							minWidth: 500,
						}}
					>
						<DynamicPage name={name} />

						<Footer />
					</div>

					<Sider />
				</div>
			</Area.Item>
		</Area>
	);
}
