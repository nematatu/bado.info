import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, cp, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

test('静的生成で公開・下書き・日付順・出典・RSS・空状態を検証する', async () => {
  const workspace = await mkdtemp(join(tmpdir(), 'bado-ssg-'));
  const build = () => execFileSync(process.execPath, [resolve('node_modules/astro/bin/astro.mjs'), 'build'], {
    cwd: workspace, stdio: 'pipe',
  });
  const read = (file: string) => readFile(join(workspace, 'dist', file), 'utf8');
  const fixture = (title: string, date: string, draft?: boolean) => `---
title: "${title}"
summary: "検証用の要約 & 詳細"
publishedAt: "${date}"
${draft === undefined ? '' : `draft: ${draft}`}
sources:
  - title: "検証用出典"
    url: "https://example.com/"
---

## 検証本文

これは自動テスト専用の文章です。
`;

  try {
    for (const file of ['astro.config.mjs', 'tsconfig.json', 'package.json', 'src']) {
      await cp(file, join(workspace, file), { recursive: true });
    }
    await symlink(resolve('node_modules'), join(workspace, 'node_modules'), 'dir');
    const content = join(workspace, 'src/content/articles');
    await rm(content, { recursive: true, force: true });
    await mkdir(join(content, '2026'), { recursive: true });
    await writeFile(join(content, 'older.md'), fixture('検証専用の過去記事', '2026-10-24T09:00:00+09:00', false));
    await writeFile(join(content, '2026/public.md'), fixture('検証専用の公開記事', '2026-10-25T09:00:00+09:00', false));
    await writeFile(join(content, 'draft.md'), fixture('検証専用の下書き', '2026-10-25T09:00:00+09:00', true));
    await writeFile(join(content, 'default-draft.md'), fixture('既定値も下書き', '2026-10-25T09:00:00+09:00'));
    build();

    const home = await read('index.html');
    const rss = await read('rss.xml');
    const article = await read('articles/2026/public/index.html');
    assert.ok(home.indexOf('検証専用の公開記事') < home.indexOf('検証専用の過去記事'));
    assert.match(home, /href="\/articles\/2026\/public\/"/);
    assert.match(article, /検証本文/);
    assert.match(article, /https:\/\/example.com\//);
    assert.match(article, /2026年10月25日/);
    assert.match(article, /rel="canonical" href="https:\/\/bado-info\.amtt\.workers\.dev\/articles\/2026\/public\/"/);
    assert.doesNotMatch(article, /<script/);
    assert.match(rss, /検証専用の公開記事/);
    assert.match(rss, /&amp;/);
    assert.match(rss, /<link>https:\/\/bado-info\.amtt\.workers\.dev\/articles\/2026\/public\/<\/link>/);
    assert.doesNotMatch(home + article + rss, /https:\/\/bado\.info/);
    for (const output of [home, rss]) assert.doesNotMatch(output, /検証専用の下書き|既定値も下書き/);
    await assert.rejects(access(join(workspace, 'dist/articles/draft/index.html')));
    await assert.rejects(access(join(workspace, 'dist/articles/default-draft/index.html')));
    await assert.rejects(access(join(workspace, 'dist/admin/index.html')));
    assert.match(await read('404.html'), /ページが見つかりません/);

    await rm(content, { recursive: true });
    await mkdir(content);
    build();
    assert.match(await read('index.html'), /公開された記事はまだありません/);
    assert.doesNotMatch(await read('rss.xml'), /<item>/);
    await assert.rejects(access(join(workspace, 'dist/articles/2026/public/index.html')));
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});
