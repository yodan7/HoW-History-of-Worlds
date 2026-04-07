# コールバック関数と引数の仕組み（JavaScript）

## 一言まとめ

コールバック関数の引数名は自由につけてOK。**「何番目か」で何が入るかが決まる**。

---

## コールバック関数とは

「後で呼んでもらうために渡す関数」のこと。

```js
.onPolygonClick((polygon) => {
  console.log(polygon.properties)
})
```

ここで `onPolygonClick()` に渡しているアロー関数 `(polygon) => { ... }` が「コールバック関数」。
globe.gl が国をクリックされたタイミングで、この関数を呼び出してくれる。

---

## 引数名は自由につけていい

`polygon` は globe.gl が決めた名前ではなく、**自分でつけた変数名**。

```js
// 全部同じ動作
.onPolygonClick((polygon) => { console.log(polygon.properties) })
.onPolygonClick((country) => { console.log(country.properties) })
.onPolygonClick((abc)     => { console.log(abc.properties) })
```

---

## 「何番目か」で中身が決まる

ドキュメントに `onPolygonClick(polygon, event, { lat, lng, altitude })` と書いてある場合：

| 順番 | 中身 |
|---|---|
| 1番目 | クリックした国のデータ（GeoJSONのfeature） |
| 2番目 | マウスイベント（クリックの座標など） |
| 3番目 | 地球上の緯度・経度・高度 |

```js
// 1番目だけ受け取る（よく使う）
.onPolygonClick((polygon) => { ... })

// 1番目と2番目を受け取る
.onPolygonClick((polygon, event) => { ... })

// 全部受け取る
.onPolygonClick((polygon, event, { lat, lng, altitude }) => { ... })
```

---

## globe.gl の内部イメージ

```js
// globe.gl はこんなふうに動いている（イメージ）
function onPolygonClick(callback) {
  // ユーザーがクリックしたとき...
  const clickedCountry = { properties: { name: "Japan" }, ... }
  const mouseEvent = { x: 100, y: 200 }
  const coords = { lat: 35, lng: 139, altitude: 0 }

  callback(clickedCountry, mouseEvent, coords)
  // ↑ あなたが渡した関数をここで呼ぶ
  // ↑ 1番目に国データ、2番目にイベント、3番目に座標
}
```

---

## JavaScript は引数を無視してもエラーにならない

```js
// globe.gl が3つ渡してきても...
callback(clickedCountry, mouseEvent, coords)

// 1つしか受け取らなくてもOK（残りは無視される）
(polygon) => { console.log(polygon) }
```

これは JavaScript の仕様。使わない引数は受け取らなくていい。

---

## 関連トピック

- アロー関数 `() => {}` の書き方
- Promise / `.then()` の非同期処理
