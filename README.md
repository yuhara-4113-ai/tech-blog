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

### 実サイトで下書きを確認する

1. Zenn記事のFront Matterを`published: false`にします。
2. `npm run ztoq -- articles/your-article-slug.md`を実行し、Qiita版が`private: true`になっていることを確認します。
3. Zenn記事とQiita版を同じPull Requestへ含め、mainへマージします。
4. Zennの下書きとQiitaの限定共有記事を、それぞれ実サイトで確認します。

実サイトでは表示確認だけを行います。本文、タイトル、タグはWeb上で編集せず、リポジトリ側を修正してください。

### 確認した記事を公開する

1. GitHubの **Actions** を開きます。
2. **Publish selected article** を選択します。
3. **Run workflow** を開き、`article_slug`へ公開する記事のslugを入力します。

   ```text
   your-article-slug
   ```

4. **Run workflow** を実行します。

Workflowは対象記事だけに対して、次の処理を行います。

- Zenn記事を`published: true`へ変更
- Qiita版を`private: false`へ再生成
- 型チェック、テスト、フォーマット、Zenn記事一覧を検証
- Qiita CLIで対象記事を公開
- ZennとQiitaの公開状態、記事ID、更新日時をmainへ自動コミット

Qiitaへの公開では、対象記事だけに`--force`を指定します。これは実サイトで確認済みのリポジトリ内容を正本として反映し、Web側の公開操作による`updated_at`競合を避けるためです。他の記事は強制更新しません。

## 記事の削除

Zenn・Qiitaとも、リポジトリからMarkdownを削除しただけではサービス上の記事は削除されません。次の順番で削除します。

1. リポジトリからZenn用とQiita用のMarkdownを両方削除します。

   ```bash
   git rm articles/your-article-slug.md
   git rm qiita/public/your-article-slug.md
   ```

2. 削除をPull Requestにしてmainへマージします。
3. [Zennの投稿管理](https://zenn.dev/dashboard)から対象記事を削除します。
4. Qiitaの記事画面にあるメニューから対象記事を削除します。

Zennの記事を先にWeb上で削除しても、リポジトリにMarkdownが残っていると次回デプロイ時に復活します。そのため、先にリポジトリから削除してmainへ反映します。

記事で使用した`images/<記事slug>/`は、他の記事から参照されていないことを確認できた場合だけ削除します。共有している画像は残してください。

## 自動変換の対応範囲

現在は次の差分を自動変換します。

- ZennとQiitaのFront Matter
- `/images/`から始まる画像パス
- Zennの`:::message`からQiitaの`:::note`

Zenn独自の埋め込みやアコーディオンなどを使用する場合は、両方のプレビューで表示を確認してください。

## 由来

このリポジトリは[neokidev/zenn-qiita-contents](https://github.com/ot07/zenn-qiita-contents)をForkして利用しています。仕組みの背景は[作者の解説記事](https://zenn.dev/ot07/articles/zenn-qiita-article-centralized)を参照してください。
