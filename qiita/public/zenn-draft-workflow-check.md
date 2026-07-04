---
title: 【動作確認用・下書き】Qiita・Zenn記事管理環境
private: true
tags:
  - Zenn
  - GitHub
  - Markdown
updated_at: '2026-07-04T14:44:19+09:00'
id: 91fa23c5aa08a697b419
organization_url_name: null
slide: false
ignorePublish: false
posting_campaign_uuid: null
agreed_posting_campaign_term: false
---

この記事は、Qiita・Zennの記事一元管理リポジトリの動作確認用です。

Zennでは下書き、Qiitaでは限定共有記事として登録されます。

## 確認項目

- Zennで下書きとして登録されていること
- Qiitaで限定共有記事として登録されていること
- 見出し・リスト・メッセージが表示されること
- 通常画像と幅指定画像が表示されること
- 画像のAltテキストが設定されていること

:::note
Zennのメッセージ記法です。QiitaではNote記法へ自動変換されます。
:::

## 通常画像

Altテキストを指定した画像です。

![権限付与画面の例](https://raw.githubusercontent.com/yuhara-4113-ai/tech-blog/main/images/used-copilot-to-review-pull-request/important-point.png)

## 幅指定画像

Zennでは`=320x`、Qiitaでは`width="320"`を持つ`img`タグへ自動変換されます。

<img src="https://raw.githubusercontent.com/yuhara-4113-ai/tech-blog/main/images/used-copilot-to-review-pull-request/Copilot-code-review-1.png" alt="Copilotレビュー画面の例" width="320">

## 確認後について

動作確認が完了したら、Zenn・Qiita上の記事とリポジトリ内の確認用Markdownを削除して問題ありません。
