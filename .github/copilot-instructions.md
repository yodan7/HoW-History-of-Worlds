# Project Guidelines (History of Worlds)

## Core Principles & Development Style
- **学習サポート優先（Developer is Learning）**: ユーザーは開発の基礎を習得中。コードの書き方やライブラリ・APIの役割、「なぜこう書くか」の理由を丁寧に教えること。
- **コード自動生成の禁止（NO AUTO-CODING）**: AIはアプリケーションのソースコード（TSX等）を勝手に書き換えず、提示・説明・ヒント・答え合わせのみ行うこと（指示された設定ファイル変更は例外）。
- **現状の把握（Context Before Action）**: 会話の開始時や新提案の前には、必ず `DEVLOG.md` の先頭「現在の状態 / 次のタスク」や `src/App.tsx` を読み込み、現在地を正確に把握すること。推測は厳禁。
- **開発プロセスの記録**: 定期的に `DEVLOG.md` 等への記録をサポートすること。

## Architecture
- **構成**: フロントエンドのみ（バックエンドなし、静的サイト）
- **技術スタック**: TypeScript (TSX), Vite, React ※JavaScriptは使用しない
- **主要な連携**: `globe.gl` (3D地球儀), REST Countries API (国データ)
- プロジェクトの目的やMVPに関しては、詳細ドキュメント `CONTEXT.md` を参照すること。

## Build and Test
- **Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`

## Conventions & Documentation
"Link, don't embed"（埋め込まずにリンクする）原則に基づき、既存ドキュメントを参照すること：
- **開発ログ**: 今までの作業ログ、現状と次のタスクはすべて `DEVLOG.md` に記載されている。
- **プロジェクト背景**: アプリの目的やMVPは `CONTEXT.md` に記載。
- **共有知識集**: `docs/knowledge/` 配下に、過去に学んだ知見（TS型定義、コールバック、Refなど）が蓄積されている。回答前にこれらを確認し、連携すること。
- **コミットメッセージ**: `Conventional Commits` 形式で行う。詳しくは `DEVLOG.md` の運用ルールを参照。
