# 確認資料と判断

確認日2026-10-25。最新のユーザー指示「認証いらない、単にSSG」を最終構成に適用。

| 一次資料 | 確認と採用点 |
| --- | --- |
| https://docs.astro.build/en/guides/content-collections/ | ファイルのglob loader、スキーマ、公開対象の選別を利用。実際の型チェック・ビルドでも検証。 |
| https://void.cloud/guide/deployment | デプロイはリソース変更を伴うため実行禁止を維持。ローカルCLIのhelpで `--dir` による静的ディレクトリ公開を確認。Void 1.2.1は開発依存のCLIとして固定。AstroへのVite plugin・adapterは使わない。 |
| https://void.cloud/integrations/frameworks/astro | 初期SSR案ではAstro 6以上、nodejs_als、voidPlugin、Cloudflare adapterの要件を確認した。最新指示によるSSGではランタイム統合を使用しない。 |
| https://gihyo.jp/ | web本文で見出し・記事一覧・日付・要約の情報階層を確認。採用は情報構造のみ。 |
| https://publickey1.jp/ | web本文で日付・タイトルを中心とした時系列の一覧を確認。採用は情報構造のみ。 |
| https://jser.info/ | web本文とブラウザで投稿一覧・タイトル・要約・日付を確認。1カラムで本文を優先する構成に反映。 |
| https://www.radix-ui.com/colors | Slate/Tealの役割別トークンを利用。実際の文字色はブラウザでコントラスト測定。 |
| https://kumo-ui.com/installation/ | React/React DOM/Phosphorのpeer依存とBase UI基盤を確認。静的な記事表示には不要なので不採用。 |

参照媒体の利用者数・評価は未調査。HTML/CSS・ロゴを複製していない。

## 情報源

BADMINTON SPIRIT https://www.badspi.jp/ のRSS候補はweb取得で失敗、BWF https://bwfbadminton.com/ はweb取得402、SMASH and NET. TV https://www.smashandnet.tv/ も取得失敗。公式RSS/APIの提供・再利用許諾は未確認。取得失敗は媒体の不存在を意味しない。最終実装は自動収集をせず、運営者が確認した出典をMarkdownに記入する。

YouTube APIは今回利用しない。所有権・許諾のない選手写真は収集・複製しない。実際の記事原稿と画像は運営者が用意する。架空ニュースは置かない。

## 未実施

初期の未実施項目のうち、今回の許可でCloudflare接続とVoid経由のSSG公開を実施した。10-deployment.md参照。独自ドメインは未取得とのご申告により対象外。
