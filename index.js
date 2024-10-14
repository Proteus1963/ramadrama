const express = require('express');
const dotenv = require('dotenv');
const scraper = require('./scraper');
const tmdb = require('./tmdb');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 2000;

// Manifesto dell'addon per Stremio
app.get('/manifest.json', (req, res) => {
    res.json({
        id: "stremio-addon-korean-series",
        version: "1.0.0",
        name: "Korean Series Addon",
        description: "Un addon per recuperare le serie coreane da Rama Oriental Fansub e integrarli con TMDB.",
        resources: ["catalog"],
        types: ["series"],
        catalogs: [{
            type: "series",
            id: "rama_korean_series"
        }],
        idPrefixes: ["tt"]
    });
});

// Endpoint per il catalogo delle serie coreane
app.get('/catalog/series/rama_korean_series.json', async (req, res) => {
    try {
        const seriesList = await scraper.scrapeSeries();
        const metas = [];

        for (const series of seriesList) {
            const tmdbInfo = await tmdb.getTmdbDetails(series.title);
            if (tmdbInfo) {
                metas.push({
                    id: tmdbInfo.id.toString(),
                    type: 'series',
                    name: tmdbInfo.name,
                    poster: tmdbInfo.poster_path,
                    background: tmdbInfo.poster_path,
                    description: tmdbInfo.overview,
                    videos: [{ url: series.url }]
                });
            }
        }

        res.json({ metas });
    } catch (error) {
        console.error("Errore durante il recupero del catalogo", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Avvia il server
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});

