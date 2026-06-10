import Api from "../components/api";
import Demo from "../components/demo";
import { DAsync, DEditable, PPill } from "./prop";

export default function Page() {
    return (
        <>
            <h2 className="mb-40">Pill</h2>
            <h3 className="mb-12">可编辑</h3>
            <Demo source={DEditable} />

            <h3 className="mt-80 mb-12">异步更新</h3>
            <Demo source={DAsync} />

            <h3 className="mt-80 mb-20">Api 参考</h3>
            <h4 className="mb-12 blue">IPill</h4>
            <Api apis={PPill} />
        </>
    );
}
