# 国情報レベル分け早見表

GeoGuessr 学習向けに、国データの表示優先度を3段階に分けた設計メモ。
UI は **Level 1 = コンパクトパネル**、**Level 2 = 詳細ポップアップ**、**Level 3 = 将来の独自ヒント欄** として使う。

> データ取得: REST Countries API v5（1回の fetch で全フィールド取得 → アプリ側で表示を分ける）

---

## レベル一覧（サマリ）

| レベル | 表示場所 | 目的 | データ源 |
|---|---|---|---|
| **Level 1** | 国クリック直後のコンパクトパネル | 一瞬で国を認識する | REST Countries API |
| **Level 2** | パネルクリック後の詳細ポップアップ | GeoGuessr 実戦に効く詳細情報 | REST Countries API |
| **Level 3** | 詳細ポップアップ内のヒント欄（将来） | ゲーム内の視覚的手がかり | **自作データ**（API 外） |

---

## Level 1 — コンパクトパネル（最重要）

国をクリックした直後に表示する。地球儀を見ながら素早く確認できる量に絞る。

| 表示項目 | REST Countries v5 フィールド | GeoGuessr での意味 | 備考 |
|---|---|---|---|
| 国旗 | `flag.url_svg` / `flag.emoji` | メタ学習・国旗クイズ | SVG が取れない国はダミー画像を検討 |
| 国名（英語） | `names.common` | 基本の国名当て | 将来は日本語名も追加検討 |
| 首都 | `capitals[0].name` | 地理的位置の把握 | 首都なしの国は「なし」表示 |
| 地域 | `region` / `subregion` | 絞り込み（北欧、東南アジアなど） | subregion を優先表示 |
| TLD（ドメイン） | `tld` | **超重要**。Google 検索バーに `.jp` 等が出る | Level 1 に含める（首都より出番が多い） |

### Level 1 表示イメージ

```
┌─────────────────────────┐
│ 🇯🇵  Japan              │
│ 首都: Tokyo             │
│ 地域: Eastern Asia      │
│ ドメイン: .jp           │
│              [国旗画像] │
│         クリックで詳細 → │
└─────────────────────────┘
```

---

## Level 2 — 詳細ポップアップ

コンパクトパネルをクリックしたときに大きく表示。GeoGuessr 実戦で使う補助情報。

| 表示項目 | REST Countries v5 フィールド | GeoGuessr での意味 | 重要度 |
|---|---|---|---|
| 言語 | `languages` | 標識の言語・文字と照合 | ★★★ |
| 左/右通行 | `cars.driving_side` | 道路・車の配置判断 | ★★★ |
| 電話コード | `calling_codes` | 看板の +81 など | ★★☆ |
| 通貨 | `currencies` | 価格表示・看板 | ★★☆ |
| 車の国コード | `cars.signs` | EU ナンバー青帯（D, F, NL 等） | ★★☆ |
| 正式国名 | `names.official` | 学習・雑学 | ★☆☆ |
| 国境国 | `borders` | 位置推定の補助 | ★☆☆ |
| 内陸国か | `landlocked` | 海が見えない理由の説明 | ★☆☆ |
| 人口 | `population` | 学習・雑学 | ★☆☆ |
| 面積 | `area.kilometers` | 学習・雑学 | ★☆☆ |
| タイムゾーン | `timezones` | 太陽の位置との照合 | ★☆☆ |
| 国コード | `codes.alpha_2` / `codes.alpha_3` | ISO コード（参考） | ★☆☆ |

### Level 2 に含めない（優先度低）

| 項目 | フィールド | 理由 |
|---|---|---|
| 指導者 | `leaders` | GeoGuessr 直結度が低い |
| 国際機構 | `memberships` | 雑学向け。必要なら後から追加 |
| ネイティブ名 | `names.native` | 言語欄で足りる |

---

## Level 3 — GeoGuessr ヒント（将来・API 外）

REST Countries では取得できない、**ゲーム画面に実際に映る視覚的手がかり**。
国ごとに自作データとして管理する予定。

| ヒントカテゴリ | 例 | データ管理案 |
|---|---|---|
| 道路標識 | ひらがな、キリル文字、独特の形 | 国コードをキーにした JSON |
| ボラード | 白赤、黄黒、独特の形状 | 同上 |
| ナンバープレート | 黄地黒字、EU 青帯、白地 | 同上 |
| カメラ世代 | Gen 1〜4 の出やすさ | 同上 |
| 道路の特徴 | 中央線の色、ガードレールの有無 | 同上 |
| 電柱・インフラ | 日本の複雑な配線、北欧の木柱 | 同上 |

> CONTEXT.md MVP に「GeoGuessrヒント欄」として記載済み。Level 2 ポップアップ内の専用セクションとして追加予定。

---

## フィールド → レベル対応表（実装用）

`App.tsx` の `CountryInfo` 型と REST Countries v5 の対応。

| フィールド | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| `names.common` | ✅ | | |
| `names.official` | | ✅ | |
| `names.native` | | （任意） | |
| `flag.url_svg` | ✅ | | |
| `capitals` | ✅ | | |
| `region` / `subregion` | ✅ | | |
| `tld` | ✅ | | |
| `languages` | | ✅ | |
| `cars.driving_side` | | ✅ | |
| `cars.signs` | | ✅ | |
| `calling_codes` | | ✅ | |
| `currencies` | | ✅ | |
| `borders` | | ✅ | |
| `landlocked` | | ✅ | |
| `population` | | ✅ | |
| `area` | | ✅ | |
| `timezones` | | ✅ | |
| `codes` | | ✅ | |
| GeoGuessr ヒント各種 | | | ✅（自作） |

---

## API 最適化メモ（後回しで OK）

必要なフィールドだけ取得する場合は `response_fields` クエリパラメータを使う。

```
?response_fields=names.common,capitals,flag.url_svg,region,subregion,tld,languages,cars,calling_codes,currencies
```

現段階では **全フィールド取得 → アプリ側で表示を分ける** で問題なし。

---

## 関連ドキュメント

- [CONTEXT.md](../CONTEXT.md) — MVP 要件・GeoGuessr ヒント欄の構想
- [rest-countries-tips.md](./rest-countries-tips.md) — REST Countries v5 の API キー・fetch 例
- [docs/knowledge/cors-and-proxy.md](./knowledge/cors-and-proxy.md) — CORS 回避

---

_作成日: 2026-08-02 / 採用決定: Level 1〜3 構成_
