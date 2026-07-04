# Zenn・Qiita記事管理

Zenn形式のMarkdownを正本として、同じ内容をZennとQiitaへ投稿するためのリポジトリです。

- Zenn: https://zenn.dev/parayan
- Qiita: https://qiita.com/parayan0429

## 必要な環境

- Node.js 22以上
- npm
- ZennとこのGitHubリポジトリの連携
- `read_qiita`と`write_qiita`権限を持つQiitaトークン

依存関係をインストールします。

```bash
npm ci
```

ローカルでQiita Previewを利用する場合は、最初にログインします。

```bash
cd qiita
npx qiita login
cd ..
```

GitHub Actionsから公開するには、リポジトリのActions secretへ`QIITA_TOKEN`を登録します。

## 記事の作成

`articles`にZenn形式の記事を作成します。ファイル名は公開後の記事URLになるため、公開後は変更しません。

```bash
npx zenn new:article --slug your-article-slug
```

画像は`images/<記事slug>/`へ配置し、記事からルート相対パスで参照します。

```markdown
![画像の説明](/images/your-article-slug/example.png)
```

## Qiita形式への変換

記事を編集したら、次のコマンドでQiita用Markdownを生成します。

```bash
npm run ztoq -- articles/your-article-slug.md
```

変換結果は`qiita/public/your-article-slug.md`へ出力されます。既存記事を変換した場合、Qiita CLIが管理する記事IDや更新日時などは保持されます。

画像URLはGitHubの既定ブランチを参照します。そのため、画像と変換後の記事を同じPull Requestに含め、mainへマージしてから公開してください。

## プレビュー

両方を同時に起動します。

```bash
npm run preview
```

個別に確認する場合は次のコマンドを使用します。

```bash
npm run preview:zenn
npm run preview:qiita
```

## 検証

Pull Requestを作成する前に、以下を実行します。

```bash
npm run typecheck
npm test
npm run format:check
npx zenn list:articles
```

## 公開

1. `articles`のZenn記事と`qiita/public`の変換結果を同じPull Requestへ含めます。
2. Pull Requestをmainへマージします。
3. ZennはGitHub連携により記事を反映します。
4. Qiitaは`Publish articles` GitHub Actionsにより記事を反映します。
5. Qiita CLIが記事IDや更新日時を書き換えた場合、Actionsがその変更をmainへ自動コミットします。

公開せず下書きにする場合は、Zenn記事のFront Matterを`published: false`にします。変換後のQiita記事は`private: true`になります。

## 自動変換の対応範囲

現在は次の差分を自動変換します。

- ZennとQiitaのFront Matter
- `/images/`から始まる画像パス
- Zennの`:::message`からQiitaの`:::note`

Zenn独自の埋め込みやアコーディオンなどを使用する場合は、両方のプレビューで表示を確認してください。

## 由来

このリポジトリは[neokidev/zenn-qiita-contents](https://github.com/ot07/zenn-qiita-contents)をForkして利用しています。仕組みの背景は[作者の解説記事](https://zenn.dev/ot07/articles/zenn-qiita-article-centralized)を参照してください。
