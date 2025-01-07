import { Button } from "@p";
import { useNavigate } from "react-router";

export default function page404() {
	const navigator = useNavigate();

	return (
		<div className='flex h-100vh'>
			<div className='mg-auto flex flex-column gap-12 text-center'>
				<h1>404</h1>
				<Button onClick={() => navigator(-1)}>BACK</Button>
			</div>
		</div>
	);
}
