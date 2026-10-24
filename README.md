# bado.info

バドミントンのニュースと考察を掲載するAstro SSGサイトです。2026-10-25の追加指示に従い、認証・管理画面・DB・R2・Cronを使う構成から、Markdownファイルを編集してビルドする構成へ変更しました。2026-10-25にVoid経由でCloudflareへ静的サイトをデプロイしました。

公開URL: https://bado-info.amtt.workers.dev/

公開リポジトリ: https://github.com/nematatu/bado.info

原依頼との機能差分はdocs/09-requirements-audit.md、公開検証はdocs/10-deployment.mdを参照してください。

## ローカル実行

Node.js 26.12.0、pnpm 10.34.5をdevbox.jsonとdevbox.lockで固定しています。ホスト側のNode/pnpmは使用しません。

```sh
devbox run install
devbox run check
devbox run test
devbox run build
devbox run dev
```

`devbox run versions` で実行ファイルとバージョンを確認できます。検証結果は docs/08-local-verification.md を参照してください。

## 記事の追加

`src/content/articles/` に `lowercase-slug.md` を作成します。ファイル名がURLになります。公開後は変更しないでください。

```md
---
title: "記事タイトル"
summary: "記事の要約"
publishedAt: "2026-10-25T09:00:00+09:00"
draft: true
sources:
  - title: "確認した出典名"
    url: "https://example.com/"
---

確認済みの事実と、管理人の考察を区別して書きます。
```

`draft: false` に変更して再ビルドすると、一覧・詳細・RSSへ反映されます。下書きは生成されません。Markdownは運営者が編集する信頼済みソースです。外部入力の自動取り込みはしません。所有・許諾確認済み画像は `public/images/` に配置し、altと寸法を記載してください。

記事0件が初期状態です。架空のニュースを同梱しません。検証用記事はテストが一時作成・削除し、通常の公開データから分離します。

## 公開

生成先は `dist/` です。Void CLIによる静的公開手順を下記に記載しています。今回の明示許可に基づき公開リポジトリへのpushとCloudflareへの静的デプロイを実施しました。bado.info独自ドメインの接続は別途確認中です。

Void 1.2.1を静的ファイル公開用の開発依存として固定しています。Astroの実行時プラグイン・Cloudflare adapterは不要です。運営者が本番公開する際は、Cloudflareアカウントと公開先を確認し、ローカルの `dist/` を見てから次を実行します。実際の公開結果はdocs/10-deployment.mdに記録しています。

```sh
devbox run build
devbox run -- pnpm exec void deploy --dir dist --platform cloudflare
```

`--spa` は指定しません。記事URLごとにHTMLを生成するサイトです。本番キャッシュとドメイン設定は公開時に確認してください。
