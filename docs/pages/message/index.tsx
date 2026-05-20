import Api from "../components/api";
import Demo from "../components/demo";
import { DBasic, DFast, DTypes, PMessage, PMessageContainer } from "./prop";

export default function Page() {
    return (
        <>
            <h2 className="mb-40">Message</h2>
            <p className="mb-32">
                可以手动在根容器添加
                <code className="code">&lt;Message.Container /&gt;</code>
                挂载，设置统一配置
            </p>
            <h3 className="mb-12">示例</h3>
            <Demo source={DBasic} />

            <h3 className="mt-80 mb-12">更多属性</h3>
            <Demo source={DTypes} />

            <h3 className="mt-80 mb-12">快捷状态</h3>
            <Demo source={DFast} />

            <h3 id="i-message" className="mt-80 mb-20">
                Api 参考
            </h3>
            <h4 className="mt-40 mb-20 blue">Message()</h4>
            <Api apis={PMessage} />

            <h4 className="mt-40 mb-20 blue">Message.Container</h4>
            <Api apis={PMessageContainer} />
        </>
    );
}
