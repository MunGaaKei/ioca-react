import { Button } from "@p";
import CodeView from "../components/code";
import { Cimport, PInstall } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Get Start</h2>
			<p className='mb-12'>
				基于{" "}
				<a
					href='https://react.dev/blog/2024/12/05/react-19'
					target='_blank'
					style={{ color: "#58c4dc" }}
				>
					React / <b>19</b>
				</a>{" "}
				开发
			</p>
			<CodeView lang='bash'>{PInstall}</CodeView>

			<h3 className='mt-40 mb-20'>引入</h3>
			<Button className='mb-12'>Hello 👋</Button>
			<CodeView lang='javascript'>{Cimport}</CodeView>
		</>
	);
}
