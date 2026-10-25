# 公開結果

2026-10-25（日本時間）。ユーザーがpush・デプロイを明示許可し、push先を「nematatu/bado.infoを公開で新規作成」と指定した。

## GitHub

公開リポジトリ https://github.com/nematatu/bado.info をGitHub CLIで新規作成。mainの初回コミット253c9e4をpushした。GitHub APIでisPrivate:false、defaultBranch:mainを確認。git ls-remoteでもmainのSHA一致を確認した。

.envrcは作業開始前から存在するユーザーファイルとして公開対象に含めていない。.voidの認証情報、.auditの検証原稿、dist、node_modulesも公開対象外。明示したプロジェクトファイルの秘密情報パターン検査は一致0。ただしこの検査であらゆる秘密情報がないと保証するものではない。

## Cloudflare / Void

認証済みアカウントへ `devbox run -- pnpm exec void connect --platform cloudflare` で接続。生成設定にD1/R2/Queue/DOのバインディングやルートがないことを確認した。

`devbox run -- pnpm exec void deploy --dir dist --platform cloudflare` で静的サイトを公開した。公開先は https://bado-info.amtt.workers.dev/ 、Worker名bado-info。デプロイ成功をCLI出力で確認した。

初回は互換日付2026-10-25がCloudflareで未来と判定され、10021で拒否された。互換日付を2026-10-24に変更し、接続設定を再生成して再実行すると成功した。日本時間の日付とCloudflareが受け入れる互換日付を同一視しない。

## 公開後の実測

curlによる外部リクエストで確認。

| パス | HTTP |
| --- | --- |
| / | 200 |
| /about/ | 200 |
| /rss.xml | 200 |
| /articles/not-existing/ | 404 |
| /admin/ | 404 |

トップの空状態と検証用記事が含まれないことを確認。RSSはXMLとして解析成功、公開記事0件なのでitem 0。IABでも公開ページの表示とナビを確認した。スクリーンショットはscreenshots/published-1280.png。

HTMLの実測Cache-Controlはpublic, max-age=0, must-revalidate。更新には再ビルド・デプロイが必要。CDN全拠点の即時反映までは検証していない。

urllibの標準User-Agentは403、本文error code: 1010。curlにPython-urllib/3.9を指定しても403を再現した。通常のcurlとIABでは200。Cloudflare公式の1010説明はブラウザー署名による拒否としている。Browser Integrity Check関連と考えられるが、実アカウントの該当ルールは未確認。安全機能の変更はしていない。全RSSクライアントで取得できるとは報告しない。

公式資料 https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/ 、https://developers.cloudflare.com/waf/tools/browser-integrity-check/ （2026-10-25確認）。

## bado.info独自ドメイン

未取得とのユーザー申告に従い、独自ドメイン接続は対象外。DNS・ドメイン登録・domain addは実行しない。以前の追加承認待ちは終了した。

canonicalとRSS内のURLは、実際に配信しているhttps://bado-info.amtt.workers.devへ統一。Astroのsite設定1箇所から両方を生成し、テストではホーム・記事・RSSにhttps://bado.infoが残らないことと、記事URLの新しいホストを検証する。

2026-10-25の修正後にdevbox run check/test/buildが成功。Voidで再デプロイ成功。外部curlでトップ・運営方針のcanonicalとRSS channel/linkがすべてworkers.devになったこと、通常ページ200・不存在記事と管理URL404を確認した。検証用記事と旧ドメインURLは応答に含まれなかった。

## RSSクライアントの追加確認

標準urllibのUser-AgentはCloudflare 1010/403。同じPythonクライアントにbado-info-feed-check/1.0という識別用User-Agentを付けると200でXML解析成功、item 0。サイト側に認証は追加していない。

Cloudflare公式のBIC設定手順はzoneに対する設定を示す。workers.devでこの拒否をアプリ設定だけで変更できる公式手順は確認できていない。セキュリティ設定を変更したり、RSSクライアント全体の動作を保証したりはしない。現在の受け入れ確認はcurl、IAB、識別用User-Agentを付けたurllibでの取得まで。

## UI再設計の公開（2026-10-25）

92aae41をmainへpush。中央のセリフ体マストヘッド、独立したナビ、日付・見出し・要約を縦にまとめた一覧、詳細の概要と出典領域を実装。Devbox check/test/build成功。

Void 1.2.1の静的デプロイは、アップロード後の検証でinheritance-source-changedとして停止した。CLI文面には「No version was uploaded」とあったが、Cloudflare上には候補版f46dce59-5145-4024-8a98-af928ebc2395が存在した。停止の根本原因は未確定。安全確認を無効化したり依存を改変したりはしていない。

稼働版と候補版のバインディングがASSETSと__VOID_VERSION_METADATAだけであることを確認。Void候補版のプレビューでトップHTML・CSS・運営方針・RSSが手元のdistと完全一致し、/__void/readyが同じ候補versionIdを返すことを確認した。復旧操作として既存のWrangler 4.152.0のversions deployで、この検証済み候補版へ100%の公開トラフィックを切り替えた。新たなビルド方式へ置き換えてはいない。ドメイン・DNS・非バージョン設定の変更なし。

公開先は引き続き https://bado-info.amtt.workers.dev/ 。IABの375/1280pxで新しいmasthead、Georgiaのサイト名（32/40px）、新ナビ、横はみ出しなし、正しいcanonicalを確認。screenshots/published-1280.pngとhome-375.pngを更新。公開記事0件。検証用記事はローカルだけ。

復旧で参照した公式資料：https://developers.cloudflare.com/workers/versions-and-deployments/ 、https://developers.cloudflare.com/workers/wrangler/commands/workers/ 。今後同じ停止が出ても未検証の候補をそのまま有効化しない。

## Markdown表示テストの公開（2026-10-25）

追加指示「テストでマークダウン入れて」により、d96d8b5でMarkdown表示テスト1件を追加してpush。原稿のタイトル・要約・本文にテストであることを明記し、架空の試合結果や写真は置いていない。見出し、段落、強調、番号付き・番号なしリスト、引用、リンク、コードを含む。

Devbox checkは0 errors/0 warnings/0 hints、testは1件成功、build成功。公開用Markdownから/articles/markdown-test/を生成。Voidは今回もアップロード後にinheritance-source-changedで停止した。候補版64554574-0c28-46d8-b892-761c4631e354のバインディング、準備完了IDを確認し、プレビューのトップ・記事・運営方針・RSS・CSSがdistと完全一致することを検証後、既存Wranglerで同じ候補版へ100%切り替えた。Void停止の根本原因は未解決。

公開後もトップ・記事HTMLとdistの一致、RSSがテスト記事1件であることを確認。IABで記事と一覧へのリンクを確認し、記事を375/768/1280pxで実測。clientWidth/scrollWidthは360/360、753/753、1265/1265で横スクロールなし。markdown-test-375.pngとmarkdown-test-1280.pngを保存。包括的な支援技術監査は未実施。独立レビューで公開原稿の公開阻害指摘なし、READMEと要件表の古い0件記録を修正した。

## Kumo公式コンポーネントの公開（2026-10-25）

4b11f23でKumo Link/Textを実採用、e9fc339で採用箇所と検証を記録しmainへpushした。今回のdevbox run -- pnpm exec void deploy --dir dist --platform cloudflareは、準備・アップロード・検証・ready・有効化まで完了しSuccessfully deployedを確認。Wranglerによる復旧操作は今回不要だった。これだけで以前の一時的な停止の根本原因が解消したとは判断しない。

公開versionIdはe5db4a6e-458a-4aa6-8af3-abf21452a04c。本番のトップ・Markdownテスト記事・運営方針HTMLとdistの完全一致をcurlで確認。Kumo Linkのdata-kumo-componentがそれぞれ7/8/7個、各HTMLのscript/astro-islandは0。RSSは公開テスト記事1件。IABでも本番記事の375/1280pxで横はみ出しなし、Kumo Link8個、script0を確認した。screenshots/kumo-article-375.png、kumo-article-1280.png、kumo-public-preview.pngが今回の公開画面。

実装コミットと独立レビュー対象SHAの一致を確認し、修正必須指摘なし。KumoCSSのresetで消えるMarkdownのリスト・見出し太字はサイトCSSで復元。包括的な支援技術監査は未実施。ドメイン操作なし。
