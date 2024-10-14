const express = require('express');
const fetch = require('node-fetch');
const app = express();

// Carica la chiave API di TMDB dalla variabile di ambiente
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const BASE_URL = 'https://ramaorientalfansub.tv/paese/corea-del-sud/';

// Funzione per ottenere i dettagli di TMDB
async function getTMDBDetails(id) {
    const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US`;
    const response = await fetch(url);
    return response.json();
}

// Endpoint per il catalogo
app.get('/catalog/series/rama_korean_series.json', async (req, res) => {
    try {
        const response = await fetch(BASE_URL);
        const html = await response.text();

        // Parsing HTML per trovare i metadati dei titoli
        const metas = parseHtmlToMetas(html); // Dovrai implementare questa funzione

        // Aggiungere i dettagli di TMDB ai titoli
        const metasWithDetails = await Promise.all(
            metas.map(async (meta) => {
                const tmdbData = await getTMDBDetails(meta.tmdbId);  // Usa l'ID TMDB corrispondente
                return {
                    ...meta,
                    poster: `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`,
                    description: tmdbData.overview,
                };
            })
        );

        res.json({ metas: metasWithDetails });
    } catch (error) {
        console.error('Errore nel recupero del catalogo:', error);
        res.status(500).json({ error: 'Errore nel recupero del catalogo' });
    }
});

// Funzione di salute per verificare il funzionamento dell'addon
app.get('/health', (req, res) => {
    res.send('Addon is working!');
});

// Porta su cui l'app verrà eseguita
const port = process.env.PORT || 7000;
app.listen(port, () => {
    console.log(`Addon is running on port ${port}`);
});
