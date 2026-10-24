# ローカル検証
2026-10-25。Astro 7.4.2の静的サイト。Node v26.12.0、pnpm 10.34.5をDevboxで固定。

## Devboxによる実行

- `devbox run versions` でNode/pnpm両方がプロジェクトの `.devbox/nix/profile/default/bin/` 配下であることを確認。
- `devbox run install` は frozen-lockfile で成功。
- `devbox run check` は0 errors / 0 warnings / 0 hints。
- `devbox run test` は1テスト成功。OSの一時ディレクトリへアプリをコピーしてビルドし、作業中の原稿やdistを変更しない。
- `devbox run build` はstatic出力で成功。記事0件のためglob-loaderの空コレクション警告あり。
- `devbox run -- pnpm exec void deploy --help` で静的ディレクトリ用 `--dir` を確認。デプロイは実行していない。

## 生成物の検証

テストでは公開・下書き・draft未指定の記事を作成。日付降順、本文、出典、日本時間の日付、canonical、階層化した記事URL、RSSのXMLエスケープ、下書き非生成、管理ページ非生成、記事削除後の古いHTML除去、空状態、404、公開HTMLにscriptがないことを検証した。

## 実ブラウザ

`.audit/browser/` に表示検証専用の記事・単色PNGを作り、通常原稿と分離した。Astroの静的プレビューを使用。記録はscreenshots/へ保存。スクリーンショット内の記事は検証専用であり、公開用distには含めない。

| viewport幅 | 一覧 clientWidth / scrollWidth | 本文 clientWidth / scrollWidth | 画像の表示幅×高さ |
| --- | --- | --- | --- |
| 375 | 375 / 375 | 360 / 360 | 320×180 |
| 768 | 768 / 768 | 753 / 753 | 705×397 |
| 1280 | 1280 / 1280 | 1265 / 1265 | 720×405 |

本文は縦スクロールバー15px分がviewport幅から差し引かれる。各幅でページ全体の横スクロールなし。長い和文見出し、英数字、長いURL、本文画像を確認。コードブロックだけは局所的に横スクロールする。

画像のnaturalWidth/Heightは1200×675、読み込み成功、altあり。3幅で16:9の比率を維持。フォントは15/17/21/28pxの4種類。

ヘッダーはposition:static。375pxでは高さ114.6875px、スクロール後も同じ。768/1280pxでは101px。スクロールに連動する高さ変更はない。

Tabで「本文へ移動」に到達し3pxのoutlineを確認。Enterで#mainへ移動しmainの上端0を確認。本文リンク・コードブロック・出典にもTabで到達しoutlineを確認。ナビゲーションから運営方針へ遷移できた。

背景rgb(252,252,253)に対し本文は約15.98、補助文字約5.79、修正後リンク約11.76のコントラスト比。初期リンク色は約4.45で通常文字の4.5を下回ったためRadix teal-12へ変更。

RSSをブラウザのXMLパーサーで開き、parsererror 0、item 1、URL https://bado.info/articles/verification/、pubDate Sun, 25 Oct 2026 00:00:00 GMTを確認した。

## 起動時の失敗と修正

Astro CLIの相対 `--root .audit/browser` では、バックグラウンド子プロセスの起動に失敗した。ログでは相対パスの解決先にpagesが見つからなかった。検証用ルートを絶対パスにするとプレビュー起動成功。通常のREADME手順はプロジェクトルートで実行し、このオプションを使わない。

当初はホストのNode/pnpmを使用してしまったが、指摘後にDevboxへ固定し検証をやり直した。Devboxでnodejs@24.22.1とpnpm@10.34.5はnot found。nodejs@26.12.0とpnpm_10@10.34.5で追加できた。

初期SSR案のローカルD1 migrationは成功したがVoidビルドは.env.example制約で失敗。その後のユーザー指示でSSR/DB/R2/Cronを削除。これを最終成果物の成功実績には含めない。

## 未実施

本番アカウント接続・ドメイン・キャッシュ・公開、外部RSSの取り込み、スクリーンリーダーでの検証、包括的なアクセシビリティ監査は実施していない。push・PR作成・本番リソース変更も実施していない。

## 最終照合

追加の読み取り専用レビューでも修正必須の不具合は見つからなかった。レビュー担当者はDevboxの実行パスとバージョンを独立に確認した。コメント削除0、型抑制0、追加修正0。

最終の `devbox run install/check/test/build` がすべて成功。`devbox run dev` のURL http://127.0.0.1:4321/ をcurlとIABで確認。利用用devサーバーを残し、分離した検証用サーバーは停止する。

## 要件照合後の再検証（2026-10-25）

この節より前の寸法・画面記録は監査前の実装。元プロンプト9章への照合後に、ナビの44×44px下限、役割別の余白・文字トークン、remによる文字サイズ、空状態の固定余白削除を実装した。

修正後も `devbox run check` は0 errors/0 warnings/0 hints、testは1件成功、build成功。独立レビューで公開を妨げる実バグは確認されなかった。

IAB実測のナビは、375/768/1280pxすべてで運営方針133.953125×44px、RSS44×44px。一覧clientWidth/scrollWidthは375/375、768/768、1280/1280。本文clientWidth/scrollWidthと画像寸法は上表の値と同じだった。最新の一覧・本文スクリーンショットに差し替えた。

Apple HIG Layoutの公式Markdown本文もcurlで取得して確認した。以前の「本文未確認」は解消し、レイアウト・整列・異なる画面幅の根拠を05に記録した。

この後、ユーザーがpushとデプロイを明示許可。10-deployment.mdに本番検証を分離して記録している。
