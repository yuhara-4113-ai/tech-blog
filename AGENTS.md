# Repository instructions

## 記事を仕上げるときはNatural Japaneseで最終推敲する

- `articles/` 配下の記事を新規作成または本文を更新した場合は、本文が完成した後の最終工程で必ず `$natural-japanese` を使用する。
- モードは原則としてクイックを使い、ユーザーがフルを指定した場合や、スキルの基準でフルが必要な記事ではフルを使う。
- スキルの手順に従って推敲、lint、スケルトン通読、最終通読を行い、指摘を反映してから記事を完成とする。
- Natural Japaneseによる推敲後に、`npm run ztoq -- articles/<slug>.md` を実行してQiita向け記事へ反映する。
- 最終報告では、Natural Japaneseを使用したこと、lintの結果、Qiita向け記事を生成したことを明記する。
