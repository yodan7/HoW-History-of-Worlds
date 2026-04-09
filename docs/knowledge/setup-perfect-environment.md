# 最強の開発環境（React+TS+自動フォーマット）構築まとめ

## 概要
Vite(JavaScript)で立ち上げたプロジェクトをTypeScript環境へ移行しつつ、保存時に「Prettierによる見た目整形」と「ESLintによるルール修正」が同時に・無言で働く**最高の開発体験(DX)**を実現するための手順。

## 1. 必要なツールのインストール
TypeScript用にESLintを動かすためのプラグインを入れる。（※最初からViteのTSテンプレートを選んだ場合は不要なことが多い）
```bash
npm install -D typescript-eslint
```

## 2. Vite + TS特有の不足要素を補う
「手動でJSからTSに書き換えた場合」に起こる弊害を2つ潰す。

*   **型チェックの追加**: `package.json` のビルドコマンドを強化。
    ```json
    "scripts": {
      "build": "tsc -b && vite build" // 先に型チェック(tsc)をしてからビルド
    }
    ```
*   **Vite独自の型定義**: `src/vite-env.d.ts` を作成し、以下を記述（`import.meta` や画像の型エラーを防ぐ）。
    ```typescript
    /// <reference types="vite/client" />
    ```

## 3. ESLintの設定 (`eslint.config.js`)
最新のFlat Config形式で、TS対応と独自のコメントルールを設定。

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: { ecmaVersion: 2020, globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      
      // オリジナル設定：コメントの後に必ず半角スペースを入れる
      'spaced-comment': ['error', 'always'],
      
      // 未使用変数の警告を「_（アンダースコア）始まり」なら無視する
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^[A-Z_]' }],
    },
  },
)
```

## 4. VS Codeの最強連携設定 (`.vscode/settings.json`)
「保存した瞬間にPrettierで整え、ESLintでコメントのスペース等を自動挿入。ただし入力中に赤波線で怒らない」という魔法の設定。

```json
{
  "editor.formatOnSave": true, // 保存時にPrettier実行
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit" // 保存時にESLintの修復実行
  },
  "eslint.experimental.useFlatConfig": true, // 新しいeslint.config.jsを読み込ませる
  "eslint.rules.customizations": [
    // spaced-commentは保存時に自動で直すので、編集中は波線で怒らない（無言化）
    { "rule": "spaced-comment", "severity": "off" }
  ]
}
```

## 教訓
*   最初から `npm create vite@latest . -- --template react-ts` を選んでいれば環境構築の8割はスキップできたが、手動で直したことで「どこに何の設定が必要なのか」を深く理解できた。
*   ルール（ESLint）はただ怒るだけでなく、VS Codeと組み合わせることで「自動修正してくれる優秀な秘書」になる。
