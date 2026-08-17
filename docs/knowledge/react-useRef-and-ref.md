# useRef と ref（React）

## 一言まとめ

`useRef` は「再レンダリングをまたいで値を覚えておけるが、値を変えてもReactに再描画を知らせない箱」を作るフック。

DOM要素に触るためによく使うが、DOM専用ではない。

---

## useRef の本質

```tsx
const someRef = useRef(initialValue);
```

これは、おおまかに次のような箱を作る。

```tsx
const someRef = {
  current: initialValue,
};
```

`useRef` の重要な特徴は次の2つ。

- `current` に値を入れておける
- `current` を変えても、Reactの再レンダリングは起きない

つまり、`useRef` は「Reactに知らせずに、コンポーネント内で覚えておくメモ」のように使える。

---

## state と ref の違い

`useState` と `useRef` の一番大きな違いは、値を変えたときにReactへ再描画を知らせるかどうか。

| 種類 | 値の変更 | 再レンダリング | 向いているもの |
| --- | --- | --- | --- |
| `useState` | `setState(...)` で変更する | 起きる | JSXの表示に関係する値 |
| `useRef` | `ref.current = ...` で変更する | 起きない | DOM、外部ライブラリのインスタンス、タイマーID、前回値など |

判断基準はこれ。

```text
その値が変わった瞬間、ReactにJSXを作り直してほしい？
→ はい: state
→ いいえ: ref
```

---

## 「表示に関係する」とは

「表示に関係する」とは、その値が変わったときに JSX の結果が変わるということ。

例えば HoW の `selectedCountry` は JSX で使っている。

```tsx
{selectedCountry && (
  <div>{selectedCountry.names.common}</div>
)}
```

`selectedCountry` が `null` ならパネルは出ない。  
`selectedCountry` が `Japan` なら Japan の情報が出る。

だから `selectedCountry` は state にする。

```tsx
const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
```

`isPanelExpanded` も同じ。

```tsx
{isPanelExpanded && (
  <div>詳細情報</div>
)}
```

`true` / `false` で詳細欄の表示が変わるので、state が向いている。

---

## JSXで ref を読んでも、自動更新はされない

ref は JSX の中で読むこと自体はできる。

```tsx
const countRef = useRef(0);

return <div>{countRef.current}</div>;
```

しかし、次のように `current` を変えても、それだけでは画面は更新されない。

```tsx
countRef.current += 1;
```

理由は、ref の変更は React に「もう一回描画して」と知らせないから。

ただし、別の state 更新などで再レンダリングが起きた場合、そのついでに最新の `countRef.current` が表示されることはある。

```text
ref が再描画を起こした
→ ちがう

別の理由で再描画が起き、そこで最新の ref が読まれた
→ こっち
```

---

## DOM に触るための ref

Reactの普通の仕組みでは、HTMLのDOM要素を直接触ることは少ない。

```text
あなたのコード → React → DOM（実際のHTML要素）
```

ただし、外部ライブラリに「この `<div>` の中に描画して」と渡したい場合がある。HoW では `globe.gl` がそれに当たる。

そこで DOM 要素への参照を入れるために `ref` を使う。

```tsx
const containerRef = useRef<HTMLDivElement>(null);

return <div ref={containerRef} id="globe-container" />;
```

この `ref={containerRef}` は、Reactへの指示。

```text
この div が実際のDOMとして作られたら、
そのDOM要素を containerRef.current に入れておいて
```

という意味。

---

## DOM ref が使えるようになるタイミング

```text
1. App() が実行される
   → containerRef.current は null

2. JSX がReactによってDOMに変換される
   → <div id="globe-container"> が作られる

3. React が containerRef.current に実際の div を入れる

4. useEffect が実行される
   → containerRef.current を globe.gl に渡せる
```

だから DOM を使う処理は `useEffect` の中で行うことが多い。

```tsx
useEffect(() => {
  if (!containerRef.current) return;

  const globe = new Globe(containerRef.current);
}, []);
```

---

## containerRef vs containerRef.current

| 書き方 | 何者 | いつ使う |
| --- | --- | --- |
| `containerRef` | `{ current: ... }` という箱 | JSX の `ref={}` に渡すとき |
| `containerRef.current` | 箱の中身 | 処理の中でDOM要素や保存した値を使うとき |

---

## DOM以外にも使える ref

`useRef` は DOM 専用ではない。

例えば次のような値にも使える。

```tsx
const timerIdRef = useRef<number | null>(null);
const previousValueRef = useRef<string | null>(null);
const globeRef = useRef<Globe | null>(null);
```

共通点はこれ。

```text
再レンダリングをまたいで覚えておきたい
でも、値が変わってもJSXを作り直す必要はない
```

---

## HoW での globeRef

HoW の `globe` インスタンスは、ReactがJSXとして表示するデータではない。

Reactが表示するのはこの div。

```tsx
<div ref={containerRef} id="globe-container"></div>
```

その div の中に3D地球儀を描くのは `globe.gl` の担当。

```tsx
const globe = new Globe(containerRef.current);
```

ただし、`globe` を `useEffect` の中のローカル変数にすると、別の `useEffect` やイベント処理から触りにくい。

そこで `globeRef` に保存する。

```tsx
const globeRef = useRef<Globe | null>(null);

useEffect(() => {
  if (!containerRef.current) return;

  const globe = new Globe(containerRef.current)
    .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
    .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")
    .width(window.innerWidth)
    .height(window.innerHeight);

  globeRef.current = globe;
}, []);
```

これで、別の場所から既存の地球儀へ命令できる。

```tsx
useEffect(() => {
  if (!globeRef.current) return;

  globeRef.current.polygonCapColor((d) => {
    const feature = d as GeoFeature;

    return feature.id === selectedCountryCode
      ? "red"
      : "rgba(0, 200, 255, 0.1)";
  });
}, [selectedCountryCode]);
```

ここでの役割分担はこう。

```text
selectedCountryCode
→ どの国が選択中かを表すアプリの状態なので state

globeRef
→ globe.gl インスタンスを後で操作するための保持箱なので ref
```

---

## よくある使い分け

### state が向いているもの

- 入力フォームの値
- 選択中の国
- パネルの開閉状態
- 表示モード
- ローディング中かどうか
- エラー表示

### ref が向いているもの

- DOM要素
- `globe.gl` など外部ライブラリのインスタンス
- `setTimeout` / `setInterval` のID
- 前回の値
- ログや計測用のカウンタ
- 頻繁に変わるが、画面更新のきっかけにはしたくない値

---

## 使いすぎ注意

ref は便利だが、使いすぎるとReactの状態の流れが見えにくくなる。

state は「表の状態」。Reactが変化を知って、画面を更新できる。

ref は「裏の保持箱」。Reactに知らせず値を持てるが、画面更新は起こさない。

初心者のうちは、まず state で考えると React の流れを理解しやすい。  
ただし、DOMや外部ライブラリのインスタンスを扱うときは ref が自然。

---

## 覚え方

```text
state:
変わったらReactに知らせるメモ

ref:
Reactには知らせず、自分だけが覚えておくメモ
```

HoW ではこう覚える。

```text
Reactが描画判断に使うもの
→ state

Reactの外側にあるものを後で操作するための持ち手
→ ref
```

---

## 関連トピック

- `useState`: JSXの表示に関係する状態を管理する
- `useEffect`: DOMが表示された後、外部ライブラリの初期化や副作用を実行する
- `globe.gl`: React外部で3D地球儀を描画するライブラリ
