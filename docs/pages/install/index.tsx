import { Button } from "@p";
import CodeView from "../components/code";
import Demo from "../components/demo";
import { Cimport } from "./prop";

export default function Page() {
    return (
        <>
            <h2 className="mb-40">Get Start</h2>
            <p className="mb-12">
                <a href="https://react.dev/blog/2024/12/05/react-19" target="_blank" style={{ color: "#58c4dc" }}>
                    <b>React 19</b>
                </a>{" "}
                开发，支持<b>按需加载</b>、<b>SSR</b>、<b>Typescript</b>。
            </p>

            <Demo defaultCollapse={false} source={{ demo: null, code: `npm add @ioca/react`, lang: "bash" }} />

            <h3 className="mt-40 mb-20">引入</h3>
            <Button className="mb-12">Hello 👋</Button>
            <CodeView lang="javascript">{Cimport}</CodeView>
        </>
    );
}
