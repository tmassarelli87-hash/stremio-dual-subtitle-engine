"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubtitles = getSubtitles;
function getSubtitles(request, baseUrl) {
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
