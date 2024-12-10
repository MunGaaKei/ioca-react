# <h1 align="center">IOCA</h1>

<p align="center">
    <a href="https://www.npmjs.org/package/@ioca/react">
        <img src="https://img.shields.io/npm/v/@ioca/react.svg">
    </a>
</p>

### Install

```node
npm install @ioca/react
```

### Usage

```js
import React from "react";
import { createRoot } from "react-dom/client";
import { Button } from "@ioca/react";
import "@ioca/react/css/index.css";

const App = () => <Button>Click Me</Button>;

const root = createRoot(document.querySelector("#app"));

root.render(<App />);
```

&nbsp;
