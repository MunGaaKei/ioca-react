import { useGlobalValues } from "@d/config/context";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
	atomOneDark,
	atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./index.css";

// https://www.npmjs.com/package/react-syntax-highlighter

export default function CodeView(props) {
	const { lang = "Javascript", children } = props;
	const global = useGlobalValues();

	return (
		<SyntaxHighlighter
			language={lang}
			style={global.theme === "theme-dark" ? atomOneDark : atomOneLight}
			children={children}
			className='demo-codes'
		/>
	);
}
