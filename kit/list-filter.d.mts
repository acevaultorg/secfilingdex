export interface FilterFacet { key: string; label?: string; values?: string[]; max?: number }
export interface FilterItem { html?: string; q?: string; f?: Record<string, string | undefined> }
export interface PrepareOptions { id: string; label?: string; items: FilterItem[]; facets?: FilterFacet[]; phone?: number; wide?: number; placeholder?: string; filter?: boolean }
export interface PreparedFilter {
  foldOn: boolean; total: number;
  wrap: { className: string; id: string; 'data-total': string; 'data-label': string; 'data-p'?: string; 'data-w'?: string };
  barHtml: string;
  cb: { type: 'checkbox'; className: string; id: string; 'aria-controls': string };
  list: { className: string; id: string };
  btn: { className: string; htmlFor: string };
  more: string;
  item: Array<{ 'data-q': string; 'data-f'?: string }>;
}
export function prepareFilter(o: PrepareOptions): PreparedFilter;
export function renderFilterFold(o: Record<string, unknown>): string;
export function listFilterCss(counts?: number[]): string;
export const LIST_FILTER_CSS: string;
export const LIST_FILTER_JS: string;
