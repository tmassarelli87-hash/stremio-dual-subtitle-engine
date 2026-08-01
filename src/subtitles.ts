export interface SubtitleRequest {
  type?: string;
  imdb_id?: string;
  tmdb_id?: string;
}

export interface SubtitleItem {
  id: string;
  lang: string;
  name: string;
  url: string;
  hearing_impaired?: boolean;
}

export function getSubtitles(request: SubtitleRequest, baseUrl: string): SubtitleItem[] {
  const titleId = request.imdb_id ?? request.tmdb_id;
  if (!titleId) {
    return [];
  }

  return [
    {
      id: `${request.type ?? "item"}-${titleId}-en`,
      lang: "eng",
      name: "English sample subtitle",
      url: `${baseUrl}/subtitle-file.srt?title=${encodeURIComponent(titleId)}`,
      hearing_impaired: false,
    },
  ];
}
