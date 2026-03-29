# useRef と ref（React）

## 一言まとめ

`ref` は「ReactがDOMを直接触らせてくれる抜け道」。`useRef` はその抜け道の入り口を作るフック。

---

## 背景：なぜ必要か

Reactの普通の仕組みでは、HTMLのDOM要素に直接触れない。

```
あなたのコード → React → DOM（実際のHTML要素）
```

Reactが間に入って管理しているので、外部ライブラリ（globe.gl など）に「この `<div>` を直接使って」と渡せない。それを可能にするのが `ref`。

---

## useRef とは

```jsx
const containerRef = useRef(null)
// containerRef = { current: null }  ← こういうオブジェクトが作られる
```

- `useRef` で「参照を入れる箱」を作る
- 最初は `null`（まだDOMが存在しないので）
- `useState` と違い、値が変わっても**再レンダリングされない**

---

## ref プロパティとは

- `ref` は HTML の属性ではなく、**React 専用の特別なプロパティ**
- 語源は **reference（参照）** の略

```jsx
<div ref={containerRef} id="globe-container" />
```

この一行が「**この div が実際のHTMLとして作られたら、その参照を `containerRef.current` に入れておいて**」という React への指示。

---

## 表示後に何が起きるか

```
1. App() が実行される
   → containerRef = { current: null }  （まだ null）

2. return の JSX が画面に表示される
   → React が DOM要素 <div> を作る

3. React が自動で containerRef.current に div を入れる
   → containerRef = { current: <div id="globe-container"> }

4. useEffect が実行される
   → containerRef.current が実際の <div> 要素になっている！
   → globe.gl に渡せる
```

---

## containerRef vs containerRef.current

| | 何者 | いつ使う |
|---|---|---|
| `containerRef` | 「箱」オブジェクト `{ current: ~ }` | JSXの `ref={}` に渡す時 |
| `containerRef.current` | 箱の中身（実際のDOM要素） | 処理の中でDOMを使いたい時 |

---

## たとえ話

図書館の本の予約システム：

- `useRef(null)` → 予約票を発行した（まだ本は手元にない）
- `ref={containerRef}` → 「この棚の本を予約して」という指示
- `containerRef.current` → 実際に受け取った本そのもの

---

## 実際のコード（このプロジェクトでの使い方）

```jsx
const containerRef = useRef(null)  // 箱を作る

useEffect(() => {
  // containerRef.current = 実際の <div> 要素
  const globe = Globe()(containerRef.current)  // globe.gl に渡す
}, [])

return (
  <div ref={containerRef} id="globe-container" />
  // ↑ React に「この div を containerRef に登録して」と指示
)
```

---

## 関連トピック

- `useState` との違い → 再レンダリングの有無
- `useEffect` → DOMが表示された「後」に実行されるから containerRef.current が使える
