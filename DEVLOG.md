# HoW 開発ログ

振り返りやすいように開発の流れをメモしていくファイル。

---

## 2026-03-26 〜 2026-03-29: セットアップフェーズ

### 決めたこと

- **アプリ概要**: GeoGuessr学習用のインタラクティブ3D地球儀Webアプリ
- **技術スタック**:
  - Vite + React (フロントエンドフレームワーク)
  - globe.gl (3D地球儀ライブラリ / Three.jsベース)
  - REST Countries API (国データの取得)
  - 静的サイト構成（バックエンドなし）

### やったこと

1. CONTEXT.md を作成（プロジェクトの引き継ぎ書）
2. `git init` でGitリポジトリ初期化
3. `npm create vite@latest . -- --template react` でVite + Reactプロジェクト作成
4. `npm install` で依存パッケージインストール
5. `npm install globe.gl` でglobe.glを追加
6. 最初のコミット: `Initial commit: Vite + React + globe.gl setup`

### 学んだこと・メモ

- `.gitignore` の `node_modules` はスラッシュあり/なしどちらでも同じ動作
- `npm create vite@latest . -- --template react` の `.` は「現在のフォルダに作る」という意味
- `git add .` → `git commit -m "..."` がコミットの基本手順

---

## 2026-03-29: globe.gl で3D地球儀表示

### やったこと

- `src/App.jsx` を書き換えて globe.gl の地球儀を表示
- Viteのデフォルトスタイル（App.css / index.css）をリセット

### 実装のポイント

- globe.gl は React の `useRef` + `useEffect` で使う
  - `useRef`: DOMの `<div>` 要素への参照を保持する
  - `useEffect`: コンポーネントが描画された後に一度だけ globe を初期化する
- ウィンドウリサイズに対応するため `resize` イベントリスナーを追加
- `useEffect` の返り値（クリーンアップ関数）でリスナーを解除する

---
