# HoW 開発ログ

振り返りやすいように開発の流れをメモしていくファイル。

---

## 📍 現在の状態 / 次のタスク (Current State / Next Action)

**【AIへの指示】会話の開始時に必ずここを読んで現在地を把握すること**

- **現在の状態**:
  - `globe.gl` を使って3D地球儀の描画が完了している。
  - REST Countries APIのデータ取得処理を `fetch().then()` から最新の `async/await` 構文にリファクタリング完了。
  - 取得した国データ（`selectedCountry`）を画面にオーバーレイ表示するUIの実装が完了（Reactの条件付きレンダリングを活用）。
  - Tailwind CSS (v4) を導入し、CSSファイルを行ったり来たりせずに直接JSX内でスタイリング可能になった。
  - 情報パネルの余白・幅・高さ・詳細欄スクロールの調整を行い、クリックした国情報を見やすく表示できる状態になった。
  - `h-*` / `min-h-*` / `max-h-*` / `overflow-y-auto` の違いを確認し、詳細情報部分だけスクロールさせる形を試した。
  - クリックした国ポリゴンの色と高さを変え、選択中の国が地球儀上で分かるようになった。
  - `globe.gl` インスタンスを `useRef` で保持し、初期化処理と選択状態に応じたホバー処理を分けた。
  - エディタ保存時の自動フォーマット・Lint設定が機能している。
- **次のタスク (Next Action)**:
  - 選択・ホバー時の色や高さの見た目を微調整する。
  - その後、地域ごとのハイライト表示や検索ボタン、UIアニメーションを検討する。

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

## 2026-03-29: GitHubリモートリポジトリ連携

### やったこと

1. GitHub上で空のリポジトリ `HoW-History-of-Worlds` を作成
2. ローカルリポジトリにリモートを登録
3. mainブランチにpush

### 使ったコマンド

\`\`\`bash
git remote add origin git@github.com:yodan7/HoW-History-of-Worlds.git
# 「origin」という名前でリモートURLを登録する（SSH接続）

git branch -M main
# 現在のブランチ名を「main」に変更（デフォルトがmasterの場合の対策）

git push -u origin main
# ローカルのmainをoriginのmainへpush
# -u は「この組み合わせを次回からのデフォルトにする」という意味
# 次回からは git push だけでOK
\`\`\`

---

## Git運用ルール

### Conventional Commits（コミットメッセージの規則）

フォーマット: `<type>: <内容>`

| type       | 使うタイミング           | 例                                          |
| ---------- | ------------------------ | ------------------------------------------- |
| `feat`     | 新機能を追加             | `feat: globe.glで3D地球儀を表示`            |
| `fix`      | バグ修正                 | `fix: リサイズ時に地球儀が崩れる問題を修正` |
| `docs`     | ドキュメントのみの変更   | `docs: CONTEXT.mdに開発スタイルを追記`      |
| `style`    | CSSなど見た目の変更      | `style: 地球儀の背景色を黒に変更`           |
| `refactor` | 動作を変えないコード整理 | `refactor: App.jsxのuseEffect分割`          |
| `chore`    | 設定ファイルなど雑務     | `chore: vite.config.jsにエイリアスを追加`   |

### ブランチ運用（個人開発シンプル版）

\`\`\`bash
# 機能開発時
git checkout -b feature/機能名   # 作業ブランチを作る
# ...作業...
git checkout main                 # mainに戻る
git merge feature/機能名          # マージ

# 小さい修正はmainに直接コミットでもOK
\`\`\`

---

## useRef とは（→ knowledge参照）

`useState` と違い、値が変わっても再レンダリングを引き起こさない。
詳細は `docs/knowledge/react-useRef-and-ref.md` 参照。

---

## Globe.gl の初期化（TypeScript正式版）

\`\`\`typescript
// TypeScript の型定義に基づく正しい書き方
// new Globe(element, configOptions?) で初期化
const globe = new Globe(containerRef.current)
  .globeImageUrl(myImageUrl)
  .pointsData(myData);
\`\`\`

- JS のドキュメントには `Globe()(element)` とあるが、内部の TypeScript 型定義では `new Globe(element)` が正しい
- メソッドチェーン（`.xxx().yyy()`）で設定を連続して書ける
- 公式サイト: https://globe.gl/

---

## 2026-04-02: 国ポリゴン追加・クリックイベント実装

### やったこと

- GeoJSON データを fetch で取得して地球儀に国ポリゴンを重ねた
- `onPolygonClick` で国クリック時に `console.log` でデータ確認
- GeoJSON URL: `https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson`
  - 最初に使った URL（vasturiano の GitHub）は 404 → D3 graph gallery に変更

### fetch の流れ

\`\`\`typescript
fetch(url)
  .then((res) => res.json()) // レスポンスを JSON に変換（非同期）
  .then((data) => {
    // 変換後のデータを使う
    globe.polygonsData(data.features);
  });
\`\`\`

---

## 2026-04-02〜07: JavaScript → TypeScript 移行

### なぜ移行したか

- 開発中に JSX（JavaScript）で書いていることに気づいた
- TypeScript のほうが型安全で学習にも良い → 移行を決定

### やったこと

1. `npm install -D typescript @types/react @types/react-dom` でTS関連パッケージ追加
2. `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` を作成（Vite react-ts テンプレートと同等の構成）
3. `src/App.jsx` → `src/App.tsx`、`src/main.jsx` → `src/main.tsx` にリネーム
4. `vite.config.js` → `vite.config.ts` にリネーム

### TypeScript に準拠させるために修正した箇所

- `src/main.tsx`: `getElementById("root")` が null の可能性を考慮し `!` でアサーション
- `src/App.tsx`: `useRef<HTMLDivElement>(null)` 型を明示
- globe.gl の `onPolygonClick` の引数 `polygon` が `object` 型になるため、`GeoFeature` を自作して対応

---

## 2026-04-09: UIパネルの実装とTailwind CSS (v4) 導入

### やったこと

- API通信の記述を `async/await` と `try/catch` を使ったモダンな構文へ移行。
- Reactの JSX 内で `{selectedCountry && ...}` を用いた条件付きレンダリングを実装。
- 最新の **Tailwind CSS v4** を導入 (`@tailwindcss/vite` プラグインと `src/index.css` への `@import "tailwindcss";` 追記のみで完了)。
- 画面右上に `absolute` を用いて、地球儀の上に国情報パネル（背景半透明など）を重ねて表示。

### 学んだこと・メモ

- **\`<img>\`タグの注意点**: React(JSX)において \`<img>\` は空要素。\`<img>なんか文字</img>\` と書くとエラーでReact全体がクラッシュし、画面が真っ白（地球儀が消えた状態）になる。正しくは \`<img src="..." alt="..." />\` である。
- **絶対配置 (absolute)**: `position: absolute` を指定しないと、地球儀のキャンバスの上にUIが乗らず、ページ全体が縦に伸びて大きくレイアウトが崩れる。
- **Tailwindのコンテナサイズ幅の罠**: 幅（`width`）を指定しないコンテナは中身（画像など）の大きさに引っ張られて伸び縮みする。画像のアスペクト比が変わるとパネル全体のサイズまで変わるので、親に固定幅（`w-80`など）や制御クラスが必須。
- **Tailwind v4の簡略化**: `tailwind.config.js` を生成するコマンドは使われなくなり、新しいViteプラグインの仕組みでより簡単に導入できるよう進化した。

---

## 2026-08-16: 情報パネルのレスポンシブ調整と次機能の検討

### やったこと

- 国情報パネルが画面端に寄りすぎないように、`top-5` / `right-5` / `left-5` などの絶対配置と余白の考え方を確認した。
- 画面幅に応じて、スマホ寄りでは左右に余白を取って広く表示し、`sm` 以上では右上の固定幅パネルとして表示する形に調整した。
- `max-w-[calc(100vw-2.5rem)]` のような `calc()` と `vw` / `rem` の考え方を確認した。
- `h-[20vh]` と `min-h-[20vh]` の違いを試し、固定高さでは中身がはみ出しやすく、`min-h` は中身を優先しながら最低高さを確保する指定だと理解した。
- 詳細情報部分に `max-h-[20vh] sm:max-h-[40vh] overflow-y-auto` を付け、パネル全体ではなく詳細欄だけスクロールする形を試した。
- 一部の `console.log` をコメントアウトし、表示データの optional chaining を少し増やして、未定義データに対する表示を堅くした。

### 学んだこと・メモ

- `min-h-*` は「その高さより小さくしない」指定であり、実際の高さは中身の量にも影響される。
- `h-*` は固定高さなので、中身が多い場合ははみ出すことがある。スクロールさせたい場合は `overflow-y-auto` などを組み合わせる。
- `max-h-*` は「ここまでしか大きくしない」指定で、スクロールを起こすには対象要素に `overflow-y-auto` が必要。
- Tailwind の `sm:` / `xl:` / `2xl:` はブラウザの横幅を基準にしたブレークポイントであり、縦幅の条件ではない。
- すでにある state から確実に作れる値は、基本的には別 state にしない。重複した state はズレる可能性がある。
- 一方で、`selectedCountry` は API から取得した国詳細データ、GeoJSON の `feature.id` は地球儀上のポリゴン識別用データなので、用途が違う場合は `selectedCountryCode` のように別 state として持つ選択肢もある。

### 次にやる候補

- クリックした国だけ地球儀上で色を変える。
- 選択中の国コードを state で管理するか、`selectedCountry` から派生できるかを確認する。
- その後、地域ごとのハイライト、検索ボタン、パネル開閉アニメーションなどを検討する。

---

## 2026-08-17: 選択国ハイライトと useRef の理解

### やったこと

- `selectedCountryCode` state を使い、クリックした国の GeoJSON 側 alpha-3 ID を保持するようにした。
- クリックした国ポリゴンだけ、色を変えて高さを少し上げる処理を追加した。
- `polygonCapColor((d) => ...)` や `polygonAltitude((d) => ...)` の `d` は、`polygonsData(data.features)` に渡した GeoJSON Feature の1要素だと確認した。
- `d === polygon` で「いま色や高さを決めようとしている国が、クリックされた国そのものか」を判定できることを確認した。
- `d.id` を直接読めない理由は、TypeScript 上で `d` が `object` 扱いになっているためであり、`const feature = d as GeoFeature` のように型を教える必要があると理解した。
- `globe.gl` のインスタンスを `globeRef` に保存し、初期化用の `useEffect` と、`selectedCountryCode` に応じてホバー処理を更新する `useEffect` を分けた。
- 色や高さの固定値を `POLYGON_STYLE` オブジェクトにまとめ、`POLYGON_STYLE.defaultCapColor` のようにプロパティアクセスで参照する形にした。
- `.vscode/settings.json` で定数の色分けを試したが、`variable.readonly` は全ての `const` 変数に効きやすいと分かった。最終的にはテーマ変更とコード構造で見分けやすくする方針にした。
- `docs/knowledge/react-useRef-and-ref.md` を更新し、DOM用途だけでなく、`useRef` の本質や `state` との使い分けを見返せるようにした。

### 学んだこと・メモ

- `polygonCapColor` は「直接その場で1つの国を塗る命令」というより、各国ごとの色の決め方を `globe.gl` に渡す設定。
- アロー関数は `d => value` の短い形だけでなく、`d => { ...; return value; }` のように複数行でも書ける。これはアロー関数で書いた無名のコールバック関数。
- `useEffect` の依存配列に state を入れると、その state が変わるたびに effect が再実行される。ただし、地球儀の初期化 effect に `selectedCountryCode` を入れると、globe の再初期化や再 fetch につながるため適さない。
- `useRef` は DOM 専用ではなく、「再レンダリングをまたいで値を保持するが、値を変えてもReactに再描画を知らせない箱」。
- JSXの表示に関係する値は基本的に state、React外部のオブジェクトや後で命令を送るための持ち手は ref が向いている。
- `globeRef` は React が描画するデータではなく、`globe.gl` に後から命令を送るための保持箱なので ref が自然。
- 関連する固定値は、ばらばらの定数より `POLYGON_STYLE` のような意味のある設定オブジェクトにまとめると読みやすい。

### 次にやる候補

- 選択色・ホバー色・高さの見た目を調整する。
- ホバー中と選択中が重なったときの優先順位を整理する。
- `POLYGON_STYLE` の色名や値を、GeoGuessr学習ツールとして見やすい配色にする。
- 地域ごとのハイライト表示や検索ボタンに進む。
