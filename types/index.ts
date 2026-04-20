export interface NotionItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  date?: string;
  content?: unknown[];
  relatedPublicationIds?: string[];
}

export interface ResearchItem extends NotionItem {
  role: string;
  methods: string[];
}

export interface BlogPost extends NotionItem {
  date: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  type: string;
  featured: boolean;
  relatedResearchIds: string[];
  relatedAnalysisIds: string[];
}

export interface ProfileItem {
  id: string;
  name: string;
  type: 'Experience' | 'Education' | 'Certification' | 'Hero';
  organization: string;
  period: string;
  summary: string;
  detail: string;
  visible: boolean;
  order: number;
}
