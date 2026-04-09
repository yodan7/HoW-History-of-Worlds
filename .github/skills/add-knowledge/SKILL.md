---
name: add-knowledge
description: "Use when: The user has learned a new concept, tool, or syntax in the current chat and wants to save it to the knowledge base (e.g. 'まとめを追加して', '知識集に保存して')."
---

# 学んだ知識のドキュメント化ワークフロー

ユーザーから「今の学びをまとめて」「知識に追加して」と依頼されたら、以下のステップで自律的に作業を行います。

1. **会話の文脈を分析する**:
   直前のチャットのやり取りを振り返り、ユーザーが新しく学んだ「核となる概念」を抽出する。
2. **Markdownコンテンツを作成する**:
   以下の構成で分かりやすいノートを作成する。
   - タイトル: 学んだ概念（例: `useEffect`の依存配列について、TSの型アサーションとは）
   - 問題の背景: どんなエラーや疑問からスタートしたか
   - 解決策・学んだこと: 図解やコード例を含む解説
   - 例え話: 日常の比喩
3. **ファイルを保存する**:
   `docs/knowledge/[concept-name].md` という名前（小文字のケバブケース）でファイルを作成する。
4. **報告する**:
   保存したファイルへのリンク（例: `docs/knowledge/example.md`）と、要約をユーザーに提示して作業完了を報告する。
