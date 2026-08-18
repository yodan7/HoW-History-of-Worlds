# null と undefined の使い分け

## 一言まとめ

`undefined` は「自然にまだ無い・見つからない」。  
`null` は「意図的に無いと入れた値」。

どちらでも動く場面は多いが、読み手に「なぜ無いのか」を伝えるために使い分ける。

---

## 基本の意味

```text
undefined
→ プロパティが存在しない
→ 引数が省略された
→ 辞書でキーが見つからなかった
→ JavaScriptが自然に返す「未定義」

null
→ 自分で明示的に「空」を入れた
→ APIが明示的に「値なし」と返した
→ 状態として「今は何も選ばれていない」を表したい
```

雑に言うと、

```text
undefined: まだ無い / 見つからない
null: 無いことを明示している
```

---

## undefined が自然な場面

存在しないプロパティを読むと `undefined` になる。

```ts
const country = { name: "Japan" };

console.log(country.capital);
// undefined
```

`capital` というプロパティが無いので、JavaScript が自然に `undefined` を返す。

辞書からキーを探して見つからない場合も `undefined`。

```ts
const countryNote = COUNTRY_NOTES[geoId];
```

`geoId` が `COUNTRY_NOTES` に無ければ、`countryNote` は `undefined` になる。

だから、次のように安全に読む。

```ts
countryNote?.jaName ?? "なし";
```

---

## null が自然な場面

React の state で「まだ選択されていない」を表すときは `null` が自然。

```tsx
const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(
  null,
);
```

これは、

```text
selectedCountry という状態は存在する
ただし、今は選択中の国が無い
```

という意味。

HoW の `selectedGeoId` も同じ考え方。

```tsx
const [selectedGeoId, setSelectedGeoId] = useState<string | null>(null);
```

まだ国をクリックしていないので、意図的に `null` を初期値にしている。

---

## なぜすぐ不具合にならないのか

`??` は、左側が `null` または `undefined` のときに右側を使う。

```ts
null ?? "NONE";
// "NONE"

undefined ?? "NONE";
// "NONE"
```

`?.` も、左側が `null` または `undefined` のときに処理を止めてくれる。

```ts
countryNote?.jaName;
```

だから `null` と `undefined` を少し雑に混ぜても、すぐには壊れないことがある。

ただし、型の意味としてはズレる。

```ts
const geoName = feature.properties.name as string | null;
```

`properties.name` が存在しないときに自然に起きるのは `undefined`。  
誰かが明示的に `null` を入れているわけではない。

だからこの場合は、次のほうが意味に合っている。

```ts
const geoName = feature.properties.name as string | undefined;
```

---

## HoW での使い分け

### state の初期値

```tsx
const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(
  null,
);
```

`null` が自然。

理由:

```text
まだ選択中の国は無い
```

という状態を、こちらが意図的に表しているから。

### GeoJSON のプロパティ

```tsx
const geoName = feature.properties.name as string | undefined;
```

`undefined` が自然。

理由:

```text
properties.name が存在しないかもしれない
```

という話だから。

### ローカル辞書の検索

```tsx
const countryNote = COUNTRY_NOTES[geoId];
```

見つからなければ `undefined`。

だから、

```tsx
countryNote?.jaName ?? "なし";
```

のように読む。

---

## 判断基準

```text
state の初期値として「まだ無い」を置きたい
→ null

プロパティや辞書に「存在しないかも」
→ undefined

APIが明示的に null を返す
→ null を受け入れる

値が省略されるかもしれない
→ undefined
```

---

## よく使う安全な書き方

### Optional Chaining

読み方: オプショナルチェイニング

日本語での呼び名: オプショナルチェーン / オプショナルチェイニング演算子

```ts
countryNote?.jaName;
```

`countryNote` が `null` / `undefined` なら、そこで止まる。

### Nullish Coalescing

読み方: ヌリッシュコアレッシング

日本語での呼び名: Null 合体演算子 / null 合体演算子

```ts
countryNote?.jaName ?? "なし";
```

左側が `null` / `undefined` なら `"なし"` を使う。

### Early Return

読み方: アーリーリターン

日本語での呼び名: 早期リターン / 早期 return

```ts
if (!containerRef.current) return;
```

`null` や `undefined` の可能性がある値を、先に弾いてから処理する。

---

## 覚え方

```text
undefined:
JavaScriptが自然に出す「まだ無い」

null:
自分で置く「今は空」
```

HoW ではこう覚える。

```text
selectedCountry / selectedGeoId
→ まだ選ばれていない状態なので null

COUNTRY_NOTES[geoId]
→ 辞書にキーが無ければ undefined

feature.properties.name
→ プロパティが無ければ undefined
```

---

## 関連トピック

- [ts-type-annotations-and-assertions.md](./ts-type-annotations-and-assertions.md) — 型指定・型アサション・null チェック
- [react-useRef-and-ref.md](./react-useRef-and-ref.md) — state と ref の違い
