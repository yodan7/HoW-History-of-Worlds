import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// React 18以降の新しいルートAPIを使用して、アプリケーションをレンダリングする
// "root"というIDを持つHTML要素を取得して、そこにReactアプリをマウントする
// 確実に"root"はあるため、非nullアサーション演算子（!）を使用して型を明示的に指定している
// 確信がない場合は、nullチェックやオプショナルチェーン(?.)を使用することも検討する
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
