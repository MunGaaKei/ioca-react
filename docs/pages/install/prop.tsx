import { name } from "@/package.json";

export const PInstall = `npm install ${name}
`;

export const Cimport = `import '${name}/index.css'

import { Button } from '${name}'

const App = () => {
	return <Button>Hello 👋</Button>
};
`;
