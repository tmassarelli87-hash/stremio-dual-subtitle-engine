"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manifest = void 0;
exports.manifest = {
    id: "org.stremio.dual-subtitle-engine",
    version: "0.1.0",
    name: "Dual Subtitle Engine",
    description: "Minimal Stremio subtitle addon",
    resources: ["subtitles"],
    types: ["movie", "series"],
    catalogs: [],
    behaviorHints: {
        configurable: false,
    },
};
