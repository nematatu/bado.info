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
