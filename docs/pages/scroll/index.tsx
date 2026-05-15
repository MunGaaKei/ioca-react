import Api from "../components/api";
import Demo from "../components/demo";
import { DBasic, DDraggable, PScroll } from "./prop";

export default function Page() {
    return (
        <>
            <h2 className="mb-40">Scroll</h2>
            <h3>示例</h3>
            <p className="color-5 my-12">
                竖向滚轮转换为横向滚动，常用于横向溢出列表
            </p>
            <Demo source={DBasic} />

            <h3 className="mt-48">拖拽滚动</h3>
            <p className="color-5 my-12">
                开启 <code className="code">draggable</code> 后支持鼠标拖拽滚动
            </p>
            <Demo source={DDraggable} />

            <h3 className="mt-80 mb-20">Api 参考</h3>
            <Api apis={PScroll} />
        </>
    );
}
