const fetch = require('node-fetch');

// Funzione per ottenere i dettagli della serie da TMDB
async function getTmdbDetails(title) {
    const apiKey = process.env.TMDB_API_KEY;
    const tmdbUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(title)}&language=it`;

    try {
        const response = await fetch(tmdbUrl);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const seriesInfo = data.results[0];
            return {
                id: seriesInfo.id,
                name: seriesInfo.name,
                overview: seriesInfo.overview,
                poster_path: `https://image.tmdb.org/t/p/w500${seriesInfo.poster_path}`
            };
        }
        return null;
    } catch (error) {
        console.error('Errore durante il recupero delle informazioni da TMDB:', error);
        throw error;
    }
}

module.exports = { getTmdbDetails };

