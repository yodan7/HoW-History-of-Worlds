# JavaScript → TypeScript 移行（Vite + React）

## 一言まとめ

最初から `react-ts` テンプレートを使うのがベスト。後から移行する場合は tsconfig を3ファイル構成で作り直す必要がある。

---

## 最初から TypeScript で始める場合（推奨）

```bash
npm create vite@latest . -- --template react-ts
#                                         ↑ react-ts を指定
```

これで tsconfig / tsconfig.app.json / tsconfig.node.json が自動生成される。

---

## 後から移行した場合（今回やったこと）

### 1. パッケージのインストール

```bash
npm install -D typescript @types/react @types/react-dom
# -D は devDependencies（開発時のみ使う）に追加する意味
```

### 2. tsconfig を3ファイル構成で作成

`tsc --init` で自動生成されるものは Node.js 用で Vite には合わない。以下の3ファイルを手動で作る。

**tsconfig.json**（親ファイル・中身は参照だけ）
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

**tsconfig.app.json**（src/ のコード用）
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

**tsconfig.node.json**（vite.config.ts 用）
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

### 3. ファイルのリネーム

```bash
mv src/App.jsx src/App.tsx
mv src/main.jsx src/main.tsx
mv vite.config.js vite.config.ts
```

TypeScript は JavaScript の上位互換なので、中身はそのまま動く。TS のエラーは後から対応。

---

## tsconfig の主要オプション解説

| オプション | 意味 |
|---|---|
| `"jsx": "react-jsx"` | JSX を React の新しい変換方式で処理する |
| `"strict": true` | 厳格な型チェックをまとめて有効化（推奨） |
| `"moduleResolution": "bundler"` | Vite などのバンドラー向けのモジュール解決方式 |
| `"noEmit": true` | TS は型チェックだけ行い、JS ファイルの出力は Vite に任せる |
| `"skipLibCheck": true` | node_modules 内の型定義エラーを無視する |

---

## JavaScript と TypeScript の対応表（React）

| JS | TS | 補足 |
|---|---|---|
| `useRef(null)` | `useRef<HTMLDivElement>(null)` | ref が指す要素の型を指定 |
| 型なし変数 | `const x: string = ""` | 明示的に型注釈 |
| 型なしオブジェクト | `type Foo = { ... }` で定義 | 自作型 |
| 何でも代入 | `unknown` / `Record<string, unknown>` | 型安全な「なんでも」 |

---

## 関連トピック

- TypeScript の型指定・型アサション → `ts-type-annotations-and-assertions.md`
- useRef と型 → `react-useRef-and-ref.md`
