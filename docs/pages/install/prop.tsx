import { name } from "@/package.json";

export const PInstall = `npm install ${name}
// or yarn add ${name}
`;

export const Cimport = `import { Button } from ${name}
import '${name}/index.css'

const App = () => {
	return <Button>Click Me</Button>
};
`;
