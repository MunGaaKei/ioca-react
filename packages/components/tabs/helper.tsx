import { MoreHorizRound } from "@ricons/material";
import { Children, ComponentType, ReactNode } from "react";
import Button from "../button";
import Icon from "../icon";
import { ITabItem, ITabs } from "./type";

type TLazyLoader = {
    load: () => Promise<{ default: ComponentType<any> }>;
};

export type TParsedTabs = {
    tabs: ITabItem[];
    contents: Map<string, ReactNode>;
    lazyLoaders: Map<string, TLazyLoader>;
    keys: Set<string>;
};

export const emptyBarStyle = {
    height: 0,
    width: 0,
};

export const defaultRenderMore = () => (
    <Button flat square size="small">
        <Icon icon={<MoreHorizRound />} />
    </Button>
);

export const isSameTabs = (prev: ITabItem[], next: ITabItem[]) =>
    prev.length === next.length &&
    prev.every((tab, index) => {
        const target = next[index];

        return (
            tab.key === target.key &&
            tab.title === target.title &&
            tab.keepDOM === target.keepDOM &&
            tab.closable === target.closable &&
            tab.intersecting === target.intersecting
        );
    });

export const getParsedTabs = (
    items: ITabs["tabs"],
    children: ITabs["children"],
): TParsedTabs => {
    const contents = new Map<string, ReactNode>();
    type TTabChildNode = {
        key?: string;
        props?: Pick<
            ITabItem,
            "title" | "content" | "keepDOM" | "closable" | "children"
        >;
    };

    if (!items) {
        const lazyLoaders = new Map<string, TLazyLoader>();
        const tabs =
            (Children.map(children, (node, i) => {
                const { key, props: nodeProps } = node as TTabChildNode;
                const {
                    title,
                    children: tabChildren,
                    content,
                    keepDOM,
                    closable,
                } = nodeProps;
                const tabKey = String(key ?? i);

                if (typeof content === "function") {
                    lazyLoaders.set(tabKey, { load: content });
                } else {
                    contents.set(tabKey, tabChildren ?? content);
                }

                return {
                    key: tabKey,
                    title,
                    keepDOM,
                    closable,
                };
            }) as ITabItem[]) ?? [];

        return {
            tabs,
            contents,
            lazyLoaders,
            keys: new Set(tabs.map((tab) => String(tab.key))),
        };
    }

    const lazyLoaders = new Map<string, TLazyLoader>();
    const tabs = items.map((item, i) => {
        if (["string", "number"].includes(typeof item)) {
            const key = String(item);
            return { key, title: item };
        }

        const key = String(item.key ?? i);

        if (typeof item.content === "function") {
            lazyLoaders.set(key, { load: item.content });
        } else {
            contents.set(key, item.content);
        }

        const { content, ...rest } = item;

        return {
            ...rest,
            key,
        };
    });

    return {
        tabs,
        contents,
        lazyLoaders,
        keys: new Set(tabs.map((tab) => String(tab.key))),
    };
};
