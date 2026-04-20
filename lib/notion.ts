import { Client } from '@notionhq/client';
import { NotionItem, ResearchItem, BlogPost, Publication, ProfileItem } from '@/types';

type UnknownRecord = Record<string, unknown>;

const DATABASE_IDS = {
  research: process.env.NOTION_RESEARCH_DB_ID!,
  analysis: process.env.NOTION_ANALYSIS_DB_ID!,
  blog: process.env.NOTION_BLOG_DB_ID!,
  publications: process.env.NOTION_PUBLICATIONS_DB_ID!,
  profile: process.env.NOTION_PROFILE_DB_ID!,
};

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: '2026-03-11',
});

function formatDatabaseId(id: string): string {
  return id.replace(/-/g, '');
}

function getPlainTextFromRichText(value: unknown): string {
  if (!value || typeof value !== 'object') return '';
  const record = value as UnknownRecord;
  const richText = record.rich_text;
  if (!Array.isArray(richText) || richText.length === 0) return '';
  return ((richText[0] as UnknownRecord)?.plain_text as string) || '';
}

function getTitleText(value: unknown): string {
  if (!value || typeof value !== 'object') return '';
  const record = value as UnknownRecord;
  const title = record.title;
  if (!Array.isArray(title) || title.length === 0) return '';
  return ((title[0] as UnknownRecord)?.plain_text as string) || '';
}

function getMultiSelectTags(value: unknown): string[] {
  if (!value || typeof value !== 'object') return [];
  const record = value as UnknownRecord;
  const multiSelect = record.multi_select;
  if (!Array.isArray(multiSelect)) return [];
  return multiSelect
    .filter((item): item is UnknownRecord => typeof item === 'object' && item !== null)
    .map((item) => (item.name as string) || '')
    .filter(Boolean);
}

function getDateStart(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as UnknownRecord;
  const dateRecord = record.date;
  if (!dateRecord || typeof dateRecord !== 'object') return undefined;
  return (dateRecord as UnknownRecord).start as string | undefined;
}

function getCheckbox(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  return ((value as UnknownRecord).checkbox as boolean) ?? false;
}

function getNumber(value: unknown): number {
  if (!value || typeof value !== 'object') return 0;
  return ((value as UnknownRecord).number as number) ?? 0;
}

function getSelect(value: unknown): string {
  if (!value || typeof value !== 'object') return '';
  const record = value as UnknownRecord;
  const select = record.select;
  if (!select || typeof select !== 'object') return '';
  return ((select as UnknownRecord).name as string) || '';
}

function getUrl(value: unknown): string {
  if (!value || typeof value !== 'object') return '';
  const record = value as UnknownRecord;
  // URL-type property
  const url = record.url as string | undefined;
  if (url) return normalizeDOI(url);
  // Text/rich_text fallback (if user added DOI as a text field)
  const richText = record.rich_text;
  if (Array.isArray(richText) && richText.length > 0) {
    const text = ((richText[0] as UnknownRecord)?.plain_text as string) || '';
    return normalizeDOI(text);
  }
  return '';
}

function normalizeDOI(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  // Bare DOI like 10.1234/something → prepend resolver
  if (/^10\.\d{4,}\//.test(trimmed)) return `https://doi.org/${trimmed}`;
  return trimmed;
}

function getRelationIds(value: unknown): string[] {
  if (!value || typeof value !== 'object') return [];
  const record = value as UnknownRecord;
  const relation = record.relation;
  if (!Array.isArray(relation)) return [];
  return relation
    .filter((item): item is UnknownRecord => typeof item === 'object' && item !== null)
    .map((item) => item.id as string)
    .filter(Boolean);
}

async function getDataSourceId(databaseId: string): Promise<string> {
  const formattedId = formatDatabaseId(databaseId);
  const database = (await notion.databases.retrieve({ database_id: formattedId })) as unknown;
  const databaseRecord = database as UnknownRecord;
  const dataSources = databaseRecord.data_sources;

  if (!Array.isArray(dataSources) || dataSources.length === 0) {
    throw new Error(`No data source found for database ${databaseId}`);
  }

  const firstDataSource = dataSources[0];
  if (!firstDataSource || typeof firstDataSource !== 'object') {
    throw new Error(`Invalid data source metadata for database ${databaseId}`);
  }

  const dataSourceId = (firstDataSource as UnknownRecord).id as string | undefined;
  if (!dataSourceId) {
    throw new Error(`No data source found for database ${databaseId}`);
  }

  return dataSourceId;
}

function normalizePage(page: unknown): NotionItem {
  const pageRecord = page as UnknownRecord;
  const properties = pageRecord.properties as UnknownRecord | undefined;

  return {
    id: (pageRecord.id as string) || '',
    title: getTitleText(properties?.Title),
    slug: getPlainTextFromRichText(properties?.Slug),
    summary: getPlainTextFromRichText(properties?.Summary),
    tags: getMultiSelectTags(properties?.Tags),
    date: getDateStart(properties?.Date),
    relatedPublicationIds: getRelationIds(properties?.RelatedPublications),
  };
}

function normalizePublication(page: unknown): Publication {
  const pageRecord = page as UnknownRecord;
  const properties = pageRecord.properties as UnknownRecord | undefined;
  return {
    id: (pageRecord.id as string) || '',
    title: getTitleText(properties?.Title),
    authors: getPlainTextFromRichText(properties?.Authors),
    journal: getPlainTextFromRichText(properties?.Journal),
    year: getNumber(properties?.Year),
    doi: getUrl(properties?.DOI),
    type: getSelect(properties?.Type),
    featured: getCheckbox(properties?.Featured),
    relatedResearchIds: getRelationIds(properties?.RelatedResearch),
    relatedAnalysisIds: getRelationIds(properties?.RelatedAnalysis),
  };
}

export async function getItems(databaseId: string): Promise<NotionItem[]> {
  if (!process.env.NOTION_TOKEN) {
    console.warn('NOTION_TOKEN not set');
    return [];
  }

  try {
    const dataSourceId = await getDataSourceId(databaseId);
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      result_type: 'page',
    });

    return response.results.map((page: unknown) => normalizePage(page));
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
}

export async function getItemBySlug(databaseId: string, slug: string): Promise<NotionItem | null> {
  if (!process.env.NOTION_TOKEN) {
    console.warn('NOTION_TOKEN not set');
    return null;
  }

  try {
    const dataSourceId = await getDataSourceId(databaseId);
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: 'Slug',
        rich_text: { equals: slug },
      },
      result_type: 'page',
    });

    if (response.results.length === 0) return null;

    const page = response.results[0] as unknown;
    const pageRecord = page as UnknownRecord;
    const pageId = (pageRecord.id as string) || '';
    const blocksData = await notion.blocks.children.list({ block_id: pageId });

    return {
      ...normalizePage(page),
      content: blocksData.results,
    };
  } catch (error) {
    console.error('Error fetching item by slug:', error);
    return null;
  }
}

export async function getPublicationsByIds(ids: string[]): Promise<Publication[]> {
  if (!ids.length || !process.env.NOTION_TOKEN) return [];

  try {
    const pages = await Promise.all(
      ids.map((id) => notion.pages.retrieve({ page_id: id.replace(/-/g, '') }))
    );
    return pages.map((page) => normalizePublication(page));
  } catch (error) {
    console.error('Error fetching publications by IDs:', error);
    return [];
  }
}

export async function getResearchItems(): Promise<ResearchItem[]> {
  const items = await getItems(DATABASE_IDS.research);
  return items.map(item => ({
    ...item,
    role: '',
    methods: item.tags,
  }));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const items = await getItems(DATABASE_IDS.blog);
  return items.filter(item => item.date) as BlogPost[];
}

export async function getPublications(): Promise<Publication[]> {
  if (!process.env.NOTION_TOKEN) {
    console.warn('NOTION_TOKEN not set');
    return [];
  }

  try {
    const dataSourceId = await getDataSourceId(DATABASE_IDS.publications);
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      result_type: 'page',
    });

    return response.results.map((page: unknown) => normalizePublication(page));
  } catch (error) {
    console.error('Error fetching publications:', error);
    return [];
  }
}

export async function getProfileItems(): Promise<ProfileItem[]> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_PROFILE_DB_ID) {
    console.warn('NOTION_TOKEN or NOTION_PROFILE_DB_ID not set');
    return [];
  }

  try {
    const dataSourceId = await getDataSourceId(DATABASE_IDS.profile);
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      result_type: 'page',
    });

    return response.results
      .map((page: unknown) => {
        const pageRecord = page as UnknownRecord;
        const properties = pageRecord.properties as UnknownRecord | undefined;

        return {
          id: (pageRecord.id as string) || '',
          name: getTitleText(properties?.Name),
          type: getSelect(properties?.Type) as 'Experience' | 'Education' | 'Certification' | 'Hero',
          organization: getPlainTextFromRichText(properties?.Organization),
          period: getPlainTextFromRichText(properties?.Period),
          summary: getPlainTextFromRichText(properties?.Summary),
          detail: getPlainTextFromRichText(properties?.Detail),
          visible: getCheckbox(properties?.Visible),
          order: getNumber(properties?.Order),
        };
      })
      .filter(item => { console.log('[profile]', item.name, item.type, item.visible); return item.visible; })
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error fetching profile items:', error);
    return [];
  }
}
