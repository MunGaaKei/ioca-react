import { List } from "@p";
import Demo from "../components/demo";
const Item = List.Item;

const STDIO_CONFIG = `{
  "mcpServers": {
    "@ioca/react": {
      "command": "node",
      "args": ["path/to/mcp-server/dist/index.js"]
    }
  }
}`;

const REMOTE_CONFIG = `{
  "mcpServers": {
    "@ioca/react": {
      "url": "https://ioca-react-mcp.vercel.app/api/mcp"
    }
  }
}`;

export default function Page() {
    return (
        <>
            <h2 className="mb-40">MCP</h2>

            <p className="mb-12">
                <a
                    href="https://modelcontextprotocol.io"
                    target="_blank"
                    className="blue"
                >
                    Model Context Protocol
                </a>{" "}
                是一种开放协议，允许 AI 模型安全地访问外部工具和数据源。
                <b>@ioca/react</b> 提供了内置的 MCP 服务，让 AI
                能直接了解组件库的 API 并生成准确的代码。
            </p>

            <h3 className="mt-80 mb-12">能力</h3>

            <p className="mb-8 bold">
                <span className="blue">Tools</span>
                <span className="ml-8 font-sm">在对话中使用</span>
            </p>
            <List>
                <Item label={<code className="code">get_component</code>}>
                    查看组件的 Props、子组件和代码示例
                </Item>
                <Item label={<code className="code">search_components</code>}>
                    按名称或属性搜索组件
                </Item>
                <Item label={<code className="code">list_components</code>}>
                    列出所有可用组件
                </Item>
                <Item label={<code className="code">get_demo</code>}>
                    获取组件的使用示例代码
                </Item>
            </List>

            <p className="mt-20 mb-8 bold">
                <span className="blue">Resources</span>
                <span className="ml-8 font-sm">通过 URI 读取</span>
            </p>
            <List>
                <Item label={<code className="code">ioca-react://components</code>}>
                    组件列表
                </Item>
                <Item label={<code className="code">ioca-react://components/{"{name}"}</code>}>
                    组件详情
                </Item>
                <Item label={<code className="code">ioca-react://components/{"{name}"}/props</code>}>
                    Props API 表格
                </Item>
                <Item label={<code className="code">ioca-react://components/{"{name}"}/demos</code>}>
                    代码示例
                </Item>
            </List>

            <h3 className="mt-80 mb-12">安装</h3>

            <p className="mb-12">在支持 MCP 的客户端中配置以下内容即可使用：</p>

            <h4 className="mt-24 mb-12">本地模式</h4>
            <p>
                克隆项目后，通过 <code className="code">node</code>{" "}
                直接启动服务：
            </p>
            <Demo
                defaultCollapse={false}
                source={{
                    demo: null,
                    code: `node /path/to/mcp-server/dist/index.js`,
                    lang: "bash",
                }}
            />
            <p className="mt-12">配置文件添加：</p>
            <Demo
                defaultCollapse={false}
                source={{ demo: null, code: STDIO_CONFIG, lang: "json" }}
            />

            <h4 className="mt-24 mb-12">远程模式</h4>
            <p>通过 Vercel 部署后，使用 URL 连接：</p>
            <Demo
                defaultCollapse={false}
                source={{ demo: null, code: REMOTE_CONFIG, lang: "json" }}
            />

            <h3 className="mt-80 mb-12">使用示例</h3>

            <p className="mb-12">
                配置完成后，AI 会自动调用 MCP 工具查询组件 API。也可以手动触发：
            </p>
            <Demo
                defaultCollapse={false}
                source={{
                    demo: null,
                    code: `# 查看 Button 组件的所有 Props
get_component Button

# 搜索包含"input"的组件
search_components input

# 获取 Modal 的代码示例
get_demo Modal`,
                    lang: "bash",
                }}
            />
        </>
    );
}
