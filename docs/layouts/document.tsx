import menu from "@d/config/menu";
import { Loading, Tree } from "@p";
import { configResponsive, useResponsive } from "@p/js/hooks";
import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Footer from "./footer";
import Sider from "./sider";

configResponsive({
    sm: 800,
});

export default function Document() {
    const { pathname } = useLocation();
    const name = pathname.split("/").at(-1);
    const { sm: staticSider } = useResponsive();
    const menus = (
        <Tree
            data={menu}
            selected={`/docs/${name}`}
            nodeProps={{
                key: "href",
            }}
            className="pd-8"
        />
    );

    useEffect(() => {
        document.documentElement?.scrollTo?.({ top: 0, behavior: "smooth" });
    }, [name]);

    return (
        <div className="flex">
            {staticSider && <div className="g-menus">{menus}</div>}

            <div className="g-content">
                <Suspense key={pathname} fallback={<Loading className="my-40" />}>
                    <Outlet />
                </Suspense>

                <Footer />
            </div>

            <Sider useDrawer={!staticSider} menus={menus} />
        </div>
    );
}
