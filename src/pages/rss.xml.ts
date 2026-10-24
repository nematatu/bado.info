import type { APIRoute } from 'astro';
import { articleUrl, publishedArticles, xmlEscape as x } from '../lib/articles';

export const GET: APIRoute = async ({ site }) => {
  const items = (await publishedArticles()).map(article => {
    const url = new URL(articleUrl(article.id), site).href;
    return `<item>
      <title>${x(article.data.title)}</title>
      <link>${x(url)}</link>
      <guid isPermaLink="true">${x(url)}</guid>
      <description>${x(article.data.summary)}</description>
      <pubDate>${article.data.publishedAt.toUTCString()}</pubDate>
    </item>`;
  });

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0"><channel>
      <title>bado.info</title><link>${site}</link>
      <description>バドミントンのニュースと考察</description><language>ja</language>
      ${items.join('')}
    </channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
