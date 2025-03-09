---
title: "GitHub Copilotのプルリクレビューを試してみた"
emoji: "😊"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [GitHub,Copilot,PullRequest,レビュー]
published: true
---

# はじめに
本記事はGitHubでプルリクを作成した際にCopilotがレビューしてくれるようになったので、とりあえず試してみた感想を記載した記事です

また、初歩的ですが躓いた箇所がありましたので、その備忘と共有も兼ねたいと思います

# 前提
現在(2025/03/08)、「GitHub Copilotのプルリクレビュー」は以下の状態です
- パブリック プレビュー
- 日本語未対応
- freeプランは対象外

その他の前提事項は下記の公式アナウンスを参照してください
https://docs.github.com/ja/copilot/using-github-copilot/code-review/using-copilot-code-review

> organization の所有者が organization のポリシーで [Copilot in GitHub.com] > [Opt in to preview features] を有効にしている場合のみです。

などもあります

# 躓いた箇所
## プルリクを作成してもReviewersにCopilotが表示されない
単純に下記を見落としており、「プレビューに参加していないだけ」でした
※「個人プラン」は対象外なのかと勘違いし、調査で数時間無駄にしました
![](/images/used-copilot-to-review-pull-request/important-point.png)

### 対策
下記の「Join the preview」をクリックで、GitHubから「権限付与メール」が届けばOKです
※私の場合は数分で届きました
https://github.com/github-copilot/code-review-preview

権限付与メール
![](/images/used-copilot-to-review-pull-request/granted-access-GitHub-Copilot-code-review.png)

# プルリク作成時に自動でレビューしてもらう方法
デフォルトでは手動でReviewersに「Copilot」をアサインする必要があります
ただしリポジトリの設定でプルリク作成時に自動でレビューしてもらうことができます
※たかが数秒の違いですが、最初に設定してしまえば自動でやってくれるので、自動化をオススメします

私は下記の記事を参考にして設定しました
https://zenn.dev/ncdc/articles/7807f5b6e3ee88


# Copilotのコードレビュー結果
![](/images/used-copilot-to-review-pull-request/Copilot-code-review-1.png)
![](/images/used-copilot-to-review-pull-request/Copilot-code-review-2.png)
上記のような結果でした
基本的に下記構成でコメントしてくれるようです
- PR Overview
  - プルリクの概要
- Reviewed Changes
  - 「レビューした差分ファイル」と「差分の内容」のマトリクス
- 指摘があればコメントがある

# 使ってみた感想
設定してしまえば、プルリクを作成したらレビューしてくれるのは大変よろしいです

ただし、現状は「日本語に未対応」なところが難点です
翻訳すれば済む話ですが、それがただただめんどくさい...

でも今まではリポジトリごとに「ChatGPT CodeReview」を導入してたので、それよりかはマシかなと思いました

こちらはプロンプトで指摘内容を日本語にできますが、「コード差分をChatGPTのAPIに投げてる」ので「料金が発生」します
軽量モデルであれば「1回のプルリクでも数円〜数十円」で済みますが、無料であればそれに越したことはないです

## ChatGPT CodeReviewの導入
私は下記参照してやってました
https://qiita.com/sauna1137/items/b0890684d45d30777072

# 最後に
日本語対応していないものの、設定は簡単ですし、嬉しい機能が開放されました
多分2ヶ月後くらいには対応してくれるのではないでしょうか？
それだけしてもらえれば、私は大満足です!!
