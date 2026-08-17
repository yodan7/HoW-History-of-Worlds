# HoW — 常時参照サマリ

短く日常的に参照するためのサマリです。必要ならこのままリポジトリに残してください。

## 目的 / MVP

- 目的: GeoGuessr学習向けインタラクティブ3D地球儀
- MVP: 3D地球儀、国クリックでパネル（国旗・国名・首都・ドメイン・地域）、GeoGuessrヒント欄

## 技術スタック

- TypeScript + React (Vite)
- globe.gl（3D地球儀）
- Tailwind CSS (v4)
- REST Countries API (v5)

## 主要コマンド

- 開発: `npm run dev`
- ビルド: `npm run build`
- Lint: `npm run lint`
- 型チェック: `npx tsc --noEmit`

## 環境変数

- Vite は `VITE_` プレフィックス必須（例: `VITE_REST_COUNTRIES_API_KEY`）
- 変更後は dev server を再起動すること（`npm run dev` を再実行）

## API / CORS（注意）

- REST Countries v5 は Bearer API key 必須およびダッシュボードで Allowed Origins 登録が必要。
- ローカルでエラーが出る場合、`vite.config.ts` の proxy を開発用ワークアラウンドとして使える（詳細は `docs/knowledge/cors-and-proxy.md` を参照）。

## 運用ルール（重要）

- 会話開始時に必ず [DEVLOG.md](../DEVLOG.md#L1) の先頭「現在の状態 / 次のタスク」を読むこと。
- `DEVLOG.md` の先頭のみ上書き、日次ログは末尾へ追記する運用。
- `.md` 系ドキュメントは参照・編集が許可される場合がある（詳しくは `.github/copilot-instructions.md`）。
- コミットメッセージは Conventional Commits を推奨（例: `feat(ui): ...`）。

---

## 現在の優先作業（短縮）

1. 情報オーバーレイの幅固定・レスポンシブ化・画像の崩れ対策
2. REST Countries v5 に合わせた型整備（または optional chaining で安全化）
3. 型チェック（`npx tsc --noEmit`）→ 動作確認（`npm run dev`）

_作成日: 2026-07-30_
