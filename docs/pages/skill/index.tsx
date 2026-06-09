import Demo from "../components/demo";

export default function Page() {
    return (
        <>
            <h2 className="mb-40">Skill</h2>
            <p className="mb-12">
                可以安装 <code className="code">skill</code> 更好辅助 <b>AI</b> 开发
            </p>
            <Demo defaultCollapse={false} source={{ demo: null, code: `npx skills add mungaakei/skills --skill ioca-components`, lang: "bash" }} />
        </>
    );
}
