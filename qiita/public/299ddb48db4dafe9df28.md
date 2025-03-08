---
title: Flutterでスマホアプリから任意の内容をDynamoDBに保存
tags:
  - Dart
  - DynamoDB
  - lambda
  - Flutter
  - OpenAI
private: false
updated_at: '2024-12-03T20:30:01+09:00'
id: 299ddb48db4dafe9df28
organization_url_name: null
slide: false
ignorePublish: false
---
# はじめに
https://qiita.com/parayan0429/items/06c5350788afe6655171

上記で紹介したシステムのFlutter部分にフォーカスした記事です。

全体像が気になった方は上記を一読ください。
※開発背景や全体像のみの短い記事のためすぐに読み終わると思います。

## 補足
本記事はスマホアプリの開発初心者が拙いながらもFlutterで作ったアプリ開発の一部始終を紹介する内容になっています。

そのため、Flutterのベストプラクティスとかけ離れている箇所も多々あると思いますが、ご容赦ください🙇

# 本記事の紹介範囲
1. このアプリでやっていること
1. 開発環境の紹介
1. 環境構築の手順
1. 実際のコード
1. 困ったこと

# このアプリでやっていること
1. テキストフィールドの内容をDynamoDBに保存
1. チャット画面でChatGPT(OpenAI API)とやり取り

## デモ画像
それぞれ以下です
### テキストフィールドの内容をDynamoDBに保存
- 保存後の状態
DynamoDBに保存する項目は下記のテキストフィールドの中身です。
  <img width="300" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/569056/631975d2-fc87-4827-8069-6197f9ba3dde.png">

- 保存前の状態
ボタンの見た目が変わり、ユーザーに保存を促すような作りにしています。
  <img width="300" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/569056/1ab2aa96-5a38-6048-ebb2-0632b14b25da.png">

- DynamoDBの状態
以下のtoneの項目に保存しています
※user_idなどの項目はとりあえず用意した物で、現状使用していないため無視してください
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/569056/3319f672-4632-069f-034c-25b38008f3d7.png)

### チャット画面でChatGPT(OpenAI API)とやり取り
- 自分の送信
  <img width="300" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/569056/54426f2c-341d-0cdf-8a88-01e964312f6a.png">

- ChatGPTの返信
口調はツンデレに設定してます。
(内容は結構変動しますが、今回はデレ要素が強めでした)
  <img width="300" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/569056/c5f6fa5a-176b-6bef-8683-6d7cb84728c7.png">


# 開発環境の紹介
- MacBook
2016年製の為、最新OSのサポートから外れてます
※後続のXcodeインストールに影響します
- Flutter 3.19.4
- Dart 3.3.2
- VScode
- 実機確認：Pixel7

# 環境構築の手順
## FlutterのInstall
以下の記事などを参考に進めました。
- [【世界一やさしい】Flutter環境構築【画像付き解説/macOS編】](https://note.com/yagi7721/n/n67db58ed1609#646864c5-6357-4bff-ae47-55f6221144f0)
- [Flutterの環境構築（Mac）](https://qiita.com/myzw1mt3/items/7898ccb588b6ae635bb6)

合計で1〜2時間程かかりましたが、特に大きな問題はなかった記憶です。
※Android studioが時間かかった&面倒でした
詳しい手順については本記事の趣旨ではないため、割愛させてもらいます

### Install後の確認(flutter doctorのコマンド実行結果)
古いmacのため、flutterの要件であるXcode 14がインストールできず以下のような結果(XcodeだけNG)です。
![スクリーンショット 2024-04-28 17.11.05.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/569056/51114479-94ee-752b-bc79-5513923821c8.png)

:::note info
この状態でもFlutterの開発自体は可能です。iOSの動作確認ができないだけです。
私はスマホがAndroidのため、シミュレーターと実機の確認には何の影響もありませんでした。
※余談ですが、1年前までiPhoneだったため、Androidに変えておいて助かりました。
人生何がプラスに働くかわかりませんね。
:::

## Flutterのプロジェクト作成
プロジェクトを作成したい場所で以下を実行
my_appの部分は任意のプロジェクト(フォルダ)名です
```sh
flutter create my_app
```

すると以下のような長ったらしいフォルダ構造が作成されます。
これで環境構築は終わりです。
![スクリーンショット 2024-04-28 17.51.59.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/569056/4df2aca5-c4f4-67d1-9ea9-907f080c52ff.png)

### よく使用したフォルダとファイル
- libフォルダ
画面含め、あらゆるソースコード(Dartファイル)はこのフォルダに格納します
Javaのsrcフォルダに該当します
- pubspec.yaml
Installしたい外部ライブラリなどの情報をここに記載します
npmのpackage.jsonに該当します

### 使わなかった(手動変更しなかった)フォルダ
- OS名のフォルダ
各OS毎の設定を定義している模様
「アプリ名」、「アプリアイコン」の設定を変更した際に差分が発生していました
以下ライブラリで自動生成したので手動で変更はしていません
  - アプリ名：rename_app
  - アプリアイコン：flutter_launcher_icons
- testフォルダ
その名の通り、testコードを記載するフォルダです
まずはアプリを作り上げることを優先したため、何もしてません。(よくないですね)
※形にはなりましたが、まだまだ改善を加えていこうと思っています。が、まずは現行コードのテストを書こうと思います

# 実際のコード
全て載せると相当量になってしまうので、主要な部分のみを以下の形式でそれぞれ紹介させていただきます
- コードのポイント
- コード

:::note warn
コードは一部抜粋ではなく、ファイルの全量を記載しています
※一部抜粋だと前後関係がわからなくなった経験があったので、長くなってしまいますが、全量を記載する方針にしています。

また、TODOコメントが赤裸々に残っています。ご了承ください。
:::

## 設定画面
前述のテキストフィールド(うずまきナルト、ツンデレ)をDynamoDBに保存する画面です
### コードのポイント
1. 設定内容を以下の2パターンで保存
    1. 変更〜保存するまで
        - hooks_riverpod(外部ライブラリ)で「メモリ」に保存(アプリ終了で消滅)
    1. 保存後
        - hive(外部ライブラリ)で「スマホ端末」に保存
        基本的に消滅しないが、「アプリ削除」や「アプリのストレージ/キャッシュ削除」で消滅
        - Lambda実行で「DynamoDB」に保存
        基本的に消滅しない
1. 保存ボタンの見た目変更
設定内容が「メモリ」と「スマホ端末」で「同じ or 異なる」で見た目が変わる
    - 同じ　：ボタン非活性　/　「設定に変更はありません」という文言
    - 異なる：ボタン活性　　/　「変更内容を保存」という文言

### コード
<details><summary>クリックで↓に展開します</summary>

```setting_screen.dart
// 必要なパッケージとファイルをインポート
import 'package:flutter/material.dart'; // Flutterのマテリアルデザインパッケージ
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../database/database.dart';
import '../models/setting_screen_model.dart';
import '../providers/setting_screen_model_provider.dart';
import '../services/cloud_storage_service.dart';
import '../widgets/drawer.dart';

import 'home_screen.dart';
import 'chat_ai_screen.dart';

final cloudStorageService = CloudStorageService();

class SettingScreen extends HookConsumerWidget {
  // コンストラクタ 状態を保持しているModelを受け取る
  final SettingScreenModel settingScreenModel;
  const SettingScreen({Key? key, required this.settingScreenModel})
      : super(key: key);

  // 画面名
  static String name = '設定画面';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 状態保持している設定画面のmodelを取得
    final settingScreenModelProvider = ref.watch(settingScreenModelState);

    // 画面描画後に1度だけ呼び出されるメソッド
    useEffect(() {
      // 画面に表示する設定画面のmodelを設定
      _setViewnModel(settingScreenModelProvider);
      return () {
        // このコードはウィジェットが破棄されるときに実行されます
        // disposeのような動作を行います(現状は何もしない)
      };
    }, const []);
    // ローカルDBに保存した内容と差分があるかどうか(保存ボタンの活性/非活性を切り替える際に使用)
    ValueNotifier<bool> isCompareWithLocalDB =
        useState(settingScreenModelProvider.compareWithLocalDB());

    // 呼び名の入力フォームの状態を保持
    TextEditingController aiToneController = createAiToneController(
        settingScreenModelProvider, isCompareWithLocalDB);

    // Scaffoldを使用して基本的なレイアウトを作成
    return Scaffold(
      appBar: AppBar(
        title: Text(name), // アプリバーのタイトル
      ),
      drawer: CustomDrawer(
        // TODO 今はtilesを各画面でコピペで定義している状態。各画面で自画面は非表示にできたら、シンプルにできる
        tiles: [
          ListTile(
            title: Text(HomeScreen.name),
            onTap: () {
              // ホーム画面への遷移
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => const HomeScreen()),
              );
            },
          ),
          ListTile(
            title: Text(ChatAIScreen.name),
            onTap: () {
              // AIチャット画面への遷移
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => const ChatAIScreen()),
              );
            },
          ),
        ],
      ),
      // 画面の主要な部分
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          // フォームの項目(定義順に縦に並べる)
          children: [
            // 口調/キャラクター名の入力フォーム
            TextField(
              // TODO TextFieldの入力中に画面描画が行われると、フォーカスが失われるため、キーボードの予測変換が閉じてしまう
              // 上記の解消：keyを定義し、TextFieldの状態を保持する
              // ⇨ダメだった
              key: const Key('aiToneTextFieldKey'),
              controller: aiToneController, // 初期値
              decoration: const InputDecoration(labelText: '口調/キャラクター名'),
            ),
            // 保存ボタン
            const SizedBox(height: 20), // フォームとボタンの間にスペースを作成します
            ElevatedButton(
              onPressed: isCompareWithLocalDB.value
                  // 活性
                  ? () {
                      _saveSettings(
                          settingScreenModelProvider, isCompareWithLocalDB);
                    }
                  // 非活性
                  : null,
              child: Text(
                isCompareWithLocalDB.value ? '変更内容を保存' : '設定に変更はありません',
              ),
            ),
            // チャット画面への遷移ボタン
            const SizedBox(height: 20), // フォームとボタンの間にスペースを作成します
            ElevatedButton(
              onPressed: () {
                // AIチャット画面への遷移
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const ChatAIScreen()),
                );
              },
              child: const Text(
                'AIチャット画面でお試し',
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ============================================
  // 以下ロジック部分
  // ============================================

  TextEditingController createAiToneController(
      SettingScreenModel settingScreenModelProvider,
      ValueNotifier<bool> isCompareWithLocalDB) {
    // TextEditingControllerのインスタンスを作成します
    final aiToneController = useTextEditingController();
    // 初期化時にテキストフィールドの初期値を設定します
    aiToneController.text = settingScreenModelProvider.aiTone;

    // テキストフィールドの内容が変更されたときに呼び出されるリスナーを追加
    useEffect(() {
      aiToneController.addListener(() {
        // TODO 変更する度に状態保持に反映しており、無駄がある。フォーカスアウト時だけ検知できれば最低限の反映で済むが、実装が難しそうなので一旦このまま
        // TODO 上記の影響もあり、「保存ボタン」のstaetが変更した直後、1文字目の入力後が確定したような挙動になり、予測バーみたいのが閉じてしまう
        settingScreenModelProvider.aiTone = aiToneController.text;
        // boxとの差分状態を更新
        isCompareWithLocalDB.value =
            settingScreenModelProvider.compareWithLocalDB();
      });
      // コンポーネントがアンマウントされるときにリスナーを削除
      return () => aiToneController.removeListener(() {});
    }, []);
    return aiToneController;
  }

  /// 設定をローカルDBに保存
  Future<void> _saveSettings(SettingScreenModel model,
      ValueNotifier<bool> isCompareWithLocalDB) async {
    // TODO スナックバーで保存しましたを表示
    debugPrint('保存しました: 名前=${model.aiTone}');

    // 保存用のインスタンスを生成
    // 状態保持中のmodelをそのままboxに保存するとインスタンスが共有されてしまい、差分が発生しなくなる
    SettingScreenModel saveData = SettingScreenModel()
      ..aiTone = model.aiTone
      ..isSaved = true;

    // ローカルDBに保存
    await settingModelBox.put(settingModelBoxKey, saveData);

    // TODO 以下のようにsave()でboxkeyを意識しないで保存できるようにしたい
    // model.save(){}

    // boxとの差分状態を更新
    isCompareWithLocalDB.value = model.compareWithLocalDB();

    // 設定内容をクラウド上に保存する関数を実行
    cloudStorageService.saveAISettingData(model);
  }

  /// ローカルDBに保存されている設定がある場合は、状態保持中のmodelに設定を反映
  void _setViewnModel(SettingScreenModel settingScreenModelProvider) {
    final settingModel = settingModelBox.get(settingModelBoxKey);
    debugPrint('ローカルDBの設定を状態保持中のmodelに反映');
    debugPrint('box: ${settingModel.toString()}');
    debugPrint('this: ${settingScreenModelProvider.toString()}');

    settingScreenModelProvider.aiTone = settingModel!.aiTone;
  }
}
```
</details>

## Cloudストレージ関連(DynamoDB)のロジック
Lambda実行で「DynamoDB」に保存するロジック部分です
### コードのポイント
1. Lambdaをインターネット通信で実行可能
LambdaのエンドポイントにAPI Gatewayを設定
1. API GatewayはAPIキーで認証
無防備だとDOS攻撃により、以下の増大(AWS料金の高騰)を懸念
※ないよりはマシのAPIキーで、申し訳程度の認証
    - Lambdaの稼働時間
    - DynamoDB書き込み回数
1. API GatewayのURL、APIキーは環境変数に定義
flutter_dotenvで.envに上記を定義し、コード上でベタ書きしないようにしています
もちろん.envはgitのコミット対象外に設定

### コード
<details><summary>クリックで↓に展開します</summary>

```cloud_storage_service.dart
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../models/env.dart';
import '../models/setting_screen_model.dart';

String saveAISettingUrl = env[EnvKey.saveAISettingUrl]!;

class CloudStorageService {
  /// クラウド環境に保存した設定内容を送信
  void saveAISettingData(SettingScreenModel saveData) async {
    // 実行するAPIはパブリックのため、簡易的なapiKeyで認証をしている(アプリは公開しないため、apiKeyは.envから取得)
    // ※アプリを公開するなら解析されてapiKeyが盗まれる可能性がある。その場合はちゃんとした認証(Cognitoなど)を行った上でAPIを実行する
    String apiKey = env[EnvKey.awsXApiKey]!;

    final http.Response response = await http.post(
      Uri.parse(saveAISettingUrl),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'x-api-key': apiKey,
      },
      body: saveData.toJson(),
    );

    if (response.statusCode == 200) {
      debugPrint('saveAISetting API 成功: ${response.body}');
    } else {
      // TODO 失敗の場合は呼び元でモーダルを表示するなどの処理を行う
      debugPrint('saveAISetting API 失敗 statusCode: ${response.statusCode}');
    }
  }
}
```

</details>

## チャット画面
前述のチャット画面でChatGPT(OpenAI API)とやり取りする画面です

### コードのポイント
1. チャット画面風のUI
flutter_chat_ui(外部ライブラリ)で簡単にチャット画面を実装
めちゃくちゃ便利。UI部分を最初は自作してましたが、このライブラリを使用することでコードが50行くらい削減できました
1. 設定が未保存の場合にアラート表示
アプリの初期インストール後などで設定を保存していない場合にその旨をアラートで表示します

### コード
<details><summary>クリックで↓に展開します</summary>

```chat_ai_screen.dart
// Flutterとその他のパッケージをインポート
import 'package:flutter/material.dart';
import 'dart:convert';
import 'dart:math';
import 'package:flutter_chat_types/flutter_chat_types.dart' as types;
import 'package:flutter_chat_ui/flutter_chat_ui.dart';

import '../database/database.dart';
import '../models/setting_screen_model.dart';
import '../services/ai_service.dart';
import '../widgets/alert_dialog.dart';
import '../widgets/drawer.dart';

import 'home_screen.dart';
import 'setting_screen.dart';

class ChatAIScreen extends StatefulWidget {
  const ChatAIScreen({super.key});

  // 画面名
  static String name = 'AIチャット画面';

  @override
  ChatAIScreenState createState() => ChatAIScreenState();
}

class ChatAIScreenState extends State<ChatAIScreen> {
  // 設定画面で保存した内容をローカルDBから取得
  final settingModel = settingModelBox.get(settingModelBoxKey);

  List<types.Message> messages = []; // メッセージを格納するリスト
  final _user = const types.User(id: '82091008-a484-4a89-ae75-a22bf8d6f3ac');
  final _ai = const types.User(id: '82091008-a484-4a89-ae75-hjgvhkjbig44');

  late AIService aiService;

  // 画面描画後に1度だけ呼び出されるメソッド
  @override
  void initState() {
    super.initState();
    aiService = AIService();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      // ローカルDBに未保存のない場合(初期インストール後に設定画面で保存してない場合など)
      // アラートを表示し、保存を促す
      final settingModel = settingModelBox.get(settingModelBoxKey);
      if (!settingModel!.isSaved) {
        _showAlertDialog();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(ChatAIScreen.name), // アプリバーのタイトル
      ),
      // ハンバーガーメニュー
      drawer: CustomDrawer(
        // TODO 今はtilesを各画面でコピペで定義している状態。各画面で自画面は非表示にできたら、シンプルにできる
        tiles: [
          ListTile(
            title: Text(HomeScreen.name),
            onTap: () {
              // ホーム画面への遷移
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => const HomeScreen()),
              );
            },
          ),
          ListTile(
            title: Text(SettingScreen.name),
            onTap: () {
              // 設定画面への遷移
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                    builder: (context) => SettingScreen(
                        settingScreenModel: SettingScreenModel())),
              );
            },
          ),
        ],
      ),
      // 画面の主要な部分
      body: Chat(
        user: _user,
        messages: messages,
        onSendPressed: _onPressedSendButton,
      ),
    );
  }

  /// 送信ボタンが押された際の処理
  void _onPressedSendButton(types.PartialText message) {
    final textMessage = types.TextMessage(
      author: _user,
      createdAt: DateTime.now().millisecondsSinceEpoch,
      id: randomString(),
      text: message.text,
    );

    _addMessage(textMessage);

    // メッセージをAIに送信
    _sendMessageToAi(message.text);
  }

  void _addMessage(types.Message message) {
    setState(() {
      messages.insert(0, message);
    });
  }

  /// 設定が未保存の場合にアラートを表示
  void _showAlertDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return CustomAlertDialog(
          titleValue: '設定が未保存です',
          contentValue: '設定画面でAIの口調などがカスタマイズできます',
          onOkPressed: () {
            Navigator.of(context).pop();
          },
        );
      },
    );
  }

  /// ユーザの入力文字列をAIに送信
  void _sendMessageToAi(String message) async {
    // ユーザの入力文字列に設定内容を付与し、AIに送信するプロンプトを作成
    String prompt = createPrompt(message);
    // AIにリクエストを送信
    aiService.sendMessageToAi(prompt).then((responseText) {
      // AIからの返答をメッセージとして表示
      final textMessage = types.TextMessage(
        author: _ai,
        createdAt: DateTime.now().millisecondsSinceEpoch,
        id: randomString(),
        text: responseText,
      );

      _addMessage(textMessage);
    });
  }

  String createPrompt(String message) {
    // 口調のプロンプト設定
    String aiTonePrompt = '';
    String aiTone = settingModel!.aiTone;
    if (aiTone.isNotEmpty) {
      aiTonePrompt = '口調は$aiToneで';
    }
    // ユーザの入力文字列に設定内容を付与し、AIに送信するプロンプトを作成
    String prompt = aiTonePrompt + message;
    return prompt;
  }

  String randomString() {
    final random = Random.secure();
    final values = List<int>.generate(16, (i) => random.nextInt(255));
    return base64UrlEncode(values);
  }
}
```

</details>

## ChatGPT(OpenAI API)のロジック
ChatGPT(OpenAI API)とやり取りするロジック部分です
### コードのポイント
1. ChatGPTとやりとり
chat_gpt_sdk(外部ライブラリ)で簡易実装
1. ChatGPTのAPIキーは環境変数に定義
前述のAPI Gatewayと同様に.envに上記を定義しています
1. AIのレスポンスは一括表示
AIとのチャットでレスポンスは「ストリーミング表示(1文字ずつ)」が主流ですが、本アプリのチャット機能はあくまで「お試し」の位置付けのため、対応していません。
※とはいえ、興味はあるので、その内実装してみようと思います

### コード
<details><summary>クリックで↓に展開します</summary>

```ai_service.dart
// Flutterとその他のパッケージをインポート
import 'package:flutter/material.dart';
import 'package:chat_gpt_sdk/chat_gpt_sdk.dart';

import '../models/env.dart';

class AIService {
  /// AIにリクエストを送信
  /// prompt: ユーザのチャット入力内容に「設定内容(キャラクター、口調など)」を付与した文字列
  Future<String> sendMessageToAi(String prompt) async {
    debugPrint('prompt=$prompt');

    // TODO 将来的にはAPIキーは設定画面で設定できるようにしたいが、一旦は.envから取得
    String apiKey = env[EnvKey.openApiKey]!;

    // OpenAIインスタンスの生成
    // 都度、生成するのは微妙だが、APIキーは変わる可能性があるため都度生成する
    final openAI = OpenAI.instance.build(
        token: apiKey,
        baseOption: HttpSetup(receiveTimeout: const Duration(seconds: 20)),
        enableLog: true);

    // role：contentの内容を送信する人（直前のやり取りも送信する場合はuser(人間)とsystem(ChatGPT)を設定する）
    // content：ChatGPTに送るプロンプト（指示）
    // max_tokens：ChatGPTが生成するテキストの最大トークン数
    // TODOO max_tokensはとりあえず固定値。後で設定画面から変更できるようにする
    final request = ChatCompleteText(messages: [
      Map.of({"role": Role.user.name, "content": prompt})
    ], maxToken: 500, model: GptTurboChatModel());

    // ChatGPTにリクエストを送信
    final response = await openAI.onChatCompletion(request: request);
    debugPrint('response!.toJson(): ${response!.toJson().toString()}');

    // TODO 入出力のtoken(total_tokens)を保持し、このアプリでどのくらいのtoken数(料金)を消費しているかを表示したい
    debugPrint('response.usage!.totalTokens: ${response.usage!.totalTokens}');

    String responseText = response.choices[0].message!.content;
    debugPrint('Response from GPT-3: $responseText');

    return responseText;
  }
}
```

</details>


# 困った(詰まった)こと
## デフォルトフォント(中華っぽい)の変更

「pubspec.yamlの定義名」と「Dartファイル側の定義名」を一致させる必要があったが、それを把握しておらず、フォントが変更されず、調査などに小一時間使ってしまった。

### 具体例
```pubspec.yaml
flutter:
  fonts:
    - family: NotoSansJP
      fonts:
        - asset: assets/google_fonts/NotoSansJP-Regular.ttf
```
```main.dart
child: MaterialApp(
  theme: ThemeData(
    // こことpubspec.yamlのfonts.familyの値を合わせないと指定したフォントが適用されない
    fontFamily: 'NotoSansJP',
  ),
  home: const HomeScreen(),
),
```

# おわりに
色々ありましたがなんとかアプリと言える形にできたかと思います。
TODOコメントやgithubに立てたIssueもあるので、テストコードが書けたら随時進めていこうと思います。
