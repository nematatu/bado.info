import { getCollection } from 'astro:content';

export async function publishedArticles() {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return articles.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export const dateLabel = (date: Date) => date.toLocaleDateString('ja-JP', {
  timeZone: 'Asia/Tokyo', year: 'numeric', month: 'long', day: 'numeric',
});

export const articleUrl = (id: string) => `/articles/${id.split('/').map(encodeURIComponent).join('/')}/`;

export const xmlEscape = (value: string) => value.replace(/[<>&"']/g, character => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
}[character]!));
