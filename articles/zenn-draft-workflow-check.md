---
title: "【動作確認用・下書き】Qiita・Zenn記事管理環境"
emoji: "🧪"
type: "tech"
topics: [Zenn, GitHub, Markdown]
published: false
---

この記事は、Qiita・Zennの記事一元管理リポジトリの動作確認用です。

Zennでは下書き、Qiitaでは限定共有記事として登録されます。

## 確認項目

- Zennで下書きとして登録されていること
- Qiitaで限定共有記事として登録されていること
- 見出し・リスト・メッセージが表示されること
- 通常画像と幅指定画像が表示されること
- 画像のAltテキストが設定されていること

:::message
Zennのメッセージ記法です。QiitaではNote記法へ自動変換されます。
:::

## 通常画像

Altテキストを指定した画像です。

![権限付与画面の例](/images/used-copilot-to-review-pull-request/important-point.png)

## 幅指定画像

Zennでは`=320x`、Qiitaでは`width="320"`を持つ`img`タグへ自動変換されます。

![Copilotレビュー画面の例](/images/used-copilot-to-review-pull-request/Copilot-code-review-1.png =320x)

## 確認後について

動作確認が完了したら、Zenn・Qiita上の記事とリポジトリ内の確認用Markdownを削除して問題ありません。
