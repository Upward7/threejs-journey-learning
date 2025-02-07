import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import React from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const root = createRoot(document.querySelector("#root"));

// 用于创建一个严格模式下的主题
const theme = createTheme({
    palette: {
        mode: "dark", // 深色
        primary: {
            main: "#3f51b5" // 主色
        },
        secondary: {
            main: "#f50057" // 次色
        }
    }
})

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            {/* 消除浏览器默认样式之间的差异，确保在不同浏览器中有一致的渲染结果 */}
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>
)