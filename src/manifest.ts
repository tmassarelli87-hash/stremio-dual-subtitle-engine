export const manifest = {
  id: "org.stremio.dual-subtitle-engine",
  version: "0.1.0",

  name: "Dual Subtitle Engine",

  description:
    "Advanced subtitle addon with dual subtitle support",

  resources: [
    {
      name: "subtitles",
      types: [
        "movie",
        "series"
      ],
      idPrefixes: [
        "tt"
      ]
    }
  ],

  types: [
    "movie",
    "series"
  ],

  catalogs: [],

  idPrefixes: [
    "tt"
  ],

  behaviorHints: {
    configurable: false
  }
};