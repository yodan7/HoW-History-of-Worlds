# TypeScript の型指定・型アサション

## 一言まとめ

TypeScript は「変数の型を明示する」ことでバグを事前に防ぐ。ライブラリの型が不十分な場合は自分で型を定義してキャストする。

---

## useRef に型を指定する

```tsx
// ❌ JavaScript風（型が null のまま固定される）
const containerRef = useRef(null);

// ✅ TypeScript（HTMLDivElement か null が入ると明示）
const containerRef = useRef<HTMLDivElement>(null);
//                          ↑ ジェネリクス：「この箱に入る型」を指定
```

`useRef<HTMLDivElement>(null)` の意味：
- 初期値は `null`
- 後で `HTMLDivElement`（div 要素）が入る、という型情報

---

## null チェック（Type Narrowing）

```tsx
const containerRef = useRef<HTMLDivElement>(null);
// current の型 → HTMLDivElement | null

// TS は「null かもしれない」と警告する
new Globe(containerRef.current) // ❌ null の可能性あり

// → if で null を除外することで型が絞り込まれる（Type Narrowing）
if (!containerRef.current) return;
new Globe(containerRef.current) // ✅ ここでは必ず HTMLDivElement
```

`if (!x) return;` パターンを **Early Return（早期リターン）** と呼ぶ。  
null/undefined の場合は即座に関数を抜けることで安全性を保つ。

---

## 型アサション（as）

ライブラリが `object` など曖昧な型しか提供していない場合に使う。

```tsx
// globe.gl の onPolygonClick の型定義
onPolygonClick(callback: (polygon: object, ...) => void)
//                                  ↑ object 型 = プロパティにアクセスできない

// ❌ object 型のままでは .properties にアクセス不可
console.log(polygon.properties) // TypeScript エラー

// ✅ as でより具体的な型として扱うと宣言する
const feature = polygon as GeoFeature;
console.log(feature.properties) // OK
```

### `as` の注意点

型アサションは「TypeScript に信じ込ませる」もの。実際のデータと合っていないと実行時エラーになる。  
「このデータの形は自分がわかっている」という確信があるときだけ使う。

---

## 自分で型を定義する（type）

```tsx
// GeoJSON の Feature オブジェクトの形を定義
type GeoFeature = {
  properties: Record<string, unknown>;
};
```

### `Record<string, unknown>` とは

```tsx
Record<string, unknown>
// = { [キー: string]: unknown }
// = 「文字列キーで unknown な値が入った辞書」
```

| 書き方 | 意味 |
|---|---|
| `Record<string, string>` | 文字列 → 文字列の辞書 |
| `Record<string, number>` | 文字列 → 数値の辞書 |
| `Record<string, unknown>` | 文字列 → 何でもOKな辞書（最も緩い） |

GeoJSON の `properties` は国によって中身が違う（name, iso_code など）ため `unknown` を使う。

---

## このプロジェクトでの使い方まとめ

```tsx
// 型定義（コンポーネントの外に書く）
type GeoFeature = {
  properties: Record<string, unknown>;
};

function App() {
  // useRef の型指定
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // null チェック（Early Return）
    if (!containerRef.current) return;

    const globe = new Globe(containerRef.current)
      .onPolygonClick((polygon) => {
        // 型アサション（as）でキャスト
        const feature = polygon as GeoFeature;
        console.log(feature.properties);
      });
  }, []);
}
```

---

## 関連トピック

- `useRef` と `ref` の仕組み → `react-useRef-and-ref.md`
- TypeScript への移行手順 → `ts-migration-from-js.md`
