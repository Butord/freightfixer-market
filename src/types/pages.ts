
export interface PageContent {
  id: number;
  title: string;
  content: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  updated_at: string;
}

export interface PageContentUpdateRequest {
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
}
