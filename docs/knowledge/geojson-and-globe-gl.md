# GeoJSON と globe.gl の違い

## 結論

GeoJSON と globe.gl は別物で、担当する役割が違う。

- **GeoJSON**: 国境などの地理情報を表すためのデータ形式
- **globe.gl**: データを読み取り、ブラウザ上に3D地球儀を描画するライブラリ

たとえると、GeoJSON は「国境の形が書かれた設計図」、globe.gl は「設計図を使って地球儀を描く道具」。

## このプロジェクトでのデータの流れ

```text
world.geojson
  国ごとの名前・国境の座標
        ↓ fetch() で取得
data.features
  国ごとの Feature の配列
        ↓ polygonsData() に渡す
globe.gl
  3D地球儀上に国のポリゴンを描画
```

`src/App.tsx` では、おおまかに次の流れになっている。

```typescript
fetch(GeoJSONのURL)
  .then((response) => response.json())
  .then((data) => {
    globe.polygonsData(data.features);
  });
```

### GeoJSON が持つもの

GeoJSON の各 `Feature` には、主に次の情報が入る。

- `geometry`: 国境を形作る座標
- `properties`: 国名など、その図形に付随する情報
- `id`: データ内で図形を識別する値（データによっては存在しない）

GeoJSON 自体が3D地球儀を描画するわけではない。あくまで、地理情報をほかのプログラムへ渡すための共通フォーマット。

### globe.gl が担当するもの

globe.gl は Three.js / WebGL を利用して、次のような描画と操作を担当する。

- 球体や背景の表示
- GeoJSON の国境をポリゴンとして表示
- 色・高さ・透明度などの見た目
- 回転・ズーム・クリックなどの操作

## 色を変えるときに見る場所

国の形ではなく見た目を変えたい場合、基本的には GeoJSON ではなく globe.gl の設定を変更する。

| 変えたい箇所 | globe.gl のメソッド |
| --- | --- |
| 国の上面 | `polygonCapColor()` |
| 国ポリゴンの側面 | `polygonSideColor()` |
| 国境線 | `polygonStrokeColor()` |
| 地球表面の画像 | `globeImageUrl()` |
| 宇宙などの背景画像 | `backgroundImageUrl()` |
| 背景色（背景画像を使わない場合） | `backgroundColor()` |
| 大気の光 | `atmosphereColor()` |

このプロジェクトでは、次のように関数から色文字列を返している。

```typescript
.polygonCapColor(() => "rgba(0, 200, 255, 0.1)")
.polygonSideColor(() => "rgba(0, 200, 255, 0.15)")
.polygonStrokeColor(() => "#00c8ff")
```

`rgba()` の最後の数値は透明度で、`0` は完全な透明、`1` は完全な不透明。

## 公式ドキュメント

- [globe.gl — Polygons Layer](https://globe.gl/#polygons-layer): 国ポリゴンの色や高さなど
- [globe.gl — Globe Layer](https://globe.gl/#globe-layer): 地球表面、大気など
- [globe.gl — Container Layout](https://globe.gl/#container-layout): 背景色や背景画像など
- [GeoJSON 仕様（RFC 7946）](https://datatracker.ietf.org/doc/html/rfc7946): GeoJSON の正式な仕様

## 覚え方

```text
形や位置のデータを変える → GeoJSON
画面上の見た目や動きを変える → globe.gl
```

ただし、国ごとに色を分ける場合は、globe.gl の色設定関数の中で GeoJSON の `properties` を読み取るため、両者を組み合わせて使う。
