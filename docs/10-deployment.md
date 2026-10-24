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

Voidのdomain listは空。`void domain add bado.info` は実行前に自動承認レビューで拒否された。理由は、デプロイ許可だけではDNS・既存サイトの接続先へ影響する独自ドメイン操作の明示承認にならないため。追加の承認を確認中であり、ドメイン接続完了とは扱わない。

canonicalとRSS内の記事URLは当初指定のhttps://bado.infoを使用している。独自ドメイン未接続の間はworkers.devの動作確認用公開URLと区別する。
