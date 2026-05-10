# <h1 align="center">IOCA</h1>

<p align="center">
    <a href="https://www.npmjs.org/package/@ioca/react">
        <img src="https://img.shields.io/npm/v/@ioca/react.svg">
    </a>
    <a href="https://www.npmjs.org/package/@ioca/react">
        <img src="https://img.shields.io/npm/dt/@ioca/react.svg">
    </a>
</p>

### 安装

```node
npm install @ioca/react
```

### 使用

```js
import React from "react";
import { createRoot } from "react-dom/client";
import "@ioca/react/index.css";
import { Button } from "@ioca/react";

const App = () => <Button>Click Me</Button>;

const root = createRoot(document.querySelector("#app"));

root.render(<App />);
```

&nbsp;
