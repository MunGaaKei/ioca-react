import classNames from "classnames";
import type { CSSProperties, KeyboardEvent, ReactNode, RefObject } from "react";
import { memo } from "react";
import Popup from "../popup";
import Helpericon from "../utils/helpericon";
import { ITabItem } from "./type";

interface ITabsNavsProps {
    tabs: ITabItem[];
    moreTabs: ITabItem[];
    activeKey?: string;
    vertical?: boolean;
    overflow?: boolean;
    hideMore?: boolean;
    navsJustify?: "start" | "center" | "end";
    bar?: boolean;
    barClass?: string;
    barStyle?: CSSProperties;
    navsRef: RefObject<HTMLDivElement | null>;
    renderMore: (moreTabs: ITabItem[]) => ReactNode;
    setNavRef: (index: number, node: HTMLAnchorElement | null) => void;
    onOpen: (key: string) => void;
    onClose: (key: string) => void;
    onMoreTabClick: (key: string) => void;
    onKeyAction: (e: KeyboardEvent<HTMLElement>, action: () => void) => void;
}

const TabsNavs = (props: ITabsNavsProps) => {
    const {
        tabs,
        moreTabs,
        activeKey,
        vertical,
        overflow,
        hideMore,
        navsJustify = "start",
        bar,
        barClass,
        barStyle,
        navsRef,
        renderMore,
        setNavRef,
        onOpen,
        onClose,
        onMoreTabClick,
        onKeyAction,
    } = props;

    return (
        <>
            <div
                ref={navsRef}
                className={classNames("i-tab-navs", `justify-${navsJustify}`)}
                role="tablist"
                aria-orientation={vertical ? "vertical" : "horizontal"}
            >
                {tabs.map((tab, i) => {
                    const { title, key = `${i}`, closable } = tab;
                    const isActive = activeKey === key;

                    return (
                        <a
                            key={key}
                            ref={(node) => setNavRef(i, node)}
                            className={classNames("i-tab-nav", {
                                "i-tab-active": isActive,
                            })}
                            role="tab"
                            tabIndex={isActive ? 0 : -1}
                            aria-selected={isActive}
                            onClick={() => onOpen(key)}
                            onKeyDown={(e) => onKeyAction(e, () => onOpen(key))}
                        >
                            {title}

                            {closable && (
                                <Helpericon
                                    as="i"
                                    active
                                    className="i-tab-nav-close"
                                    role="button"
                                    tabIndex={0}
                                    aria-label="关闭标签页"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onClose(key);
                                    }}
                                    onKeyDown={(e) =>
                                        onKeyAction(e, () => onClose(key))
                                    }
                                />
                            )}
                        </a>
                    );
                })}

                {bar && (
                    <span
                        className={classNames("i-tab-navs-bar", barClass)}
                        style={barStyle}
                    />
                )}
            </div>

            {!hideMore && overflow && moreTabs.length > 0 && (
                <Popup
                    arrow={false}
                    position={vertical ? "right" : "bottom"}
                    align="end"
                    touchable
                    hideDelay={500}
                    content={
                        <div className="i-tabs-morelist pd-4">
                            {moreTabs.map((tab, i) => {
                                const { key = `${i}`, title } = tab;
                                const isActive = activeKey === key;

                                return (
                                    <a
                                        key={key}
                                        className={classNames("i-tab-nav", {
                                            "i-tab-active": isActive,
                                        })}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => onMoreTabClick(key)}
                                        onKeyDown={(e) =>
                                            onKeyAction(e, () =>
                                                onMoreTabClick(key),
                                            )
                                        }
                                    >
                                        {title}
                                    </a>
                                );
                            })}
                        </div>
                    }
                >
                    {renderMore(moreTabs)}
                </Popup>
            )}
        </>
    );
};

export default memo(TabsNavs);
