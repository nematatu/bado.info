# データ保存
最新のSSG指示に従いDBは使用しない。記事はsrc/content/articles/*.md。スキーマはsrc/content.config.ts。SQL migrationは最終成果物に含めない。

draftは既定true。falseの明示で公開対象となる。公開日時はタイムゾーン付きで記入し、画面は日本時間表示。出典はtitleとHTTP(S) URL。slugはMarkdownファイル名で公開後は固定する。
