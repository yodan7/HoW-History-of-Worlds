久しぶりに開いたら、REST Countriesの使い方がバージョン変更に伴って変わっていたのでメモ

2026/06/17

```javascript
fetch("https://api.restcountries.com/countries/v5?q=canada", {
  headers: { Authorization: "Bearer rc_live_xxxxxx" },
})
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });
```

一応、`.env.local`ファイルを作成してそこに `REST_COUNTRIES_API_KEY` という変数を定義してそこに置いておいた
