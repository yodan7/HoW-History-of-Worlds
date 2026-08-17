# Tailwind CSS 学習メモ

HoWのUI実装で使用するTailwind CSSの参考資料と、学んだことをまとめる。

## 参考資料

- [Tailwind CSS 日本語チートシートv4.3](https://telehakke.github.io/tailwindcss-japanese-cheat-sheet-v4/)
  - Tailwind CSSのクラスを目的別に調べるときに使う
  - 正しくない情報もある（justify-items-centerではなくitems-centerなど）
- [公式ドキュメント](https://tailwindcss.com/docs/installation/using-vite)
  - 見づらいかもだけど公式ドキュメント

## このプロジェクトでよく使うクラス

今後、実際に使用して理解したものを追記する。

- justyfiy-center
  - 水平方向の中央揃え

- items-center
  - 垂直方向の中央揃え

- min-h-xxx
  - xxxよりも小さくならないように指定。20vhだったら画面の20%よりも小さくしない
  - h-xxxと違い、中身に応じてサイズを変える、h-autoが基本的に働く。
- max-h-xxx
- orverflow-y-auto
  - maxでサイズの上限を設定する。基本は中身に応じて変わる
  - 超過した分は、スクロールすれば見えるようになる

| ブレークポイントのプレフィックス | 最小幅          | CSS                               |
| -------------------------------- | --------------- | --------------------------------- |
| `sm`                             | 40rem*(640px)*  | `@media (width >= 40rem) { ... }` |
| `md`                             | 48rem*(768px)*  | `@media (width >= 48rem) { ... }` |
| `lg`                             | 64rem*(1024px)* | `@media (width >= 64rem) { ... }` |
| `xl`                             | 80rem*(1280px)* | `@media (width >= 80rem) { ... }` |
| `2xl`                            | 96rem*(1536px)* | `@media (width >= 96rem) { ... }` |
