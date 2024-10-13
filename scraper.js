const fetch = require('node-fetch');
const cheerio = require('cheerio');

// Funzione per eseguire lo scraping delle serie
async function scrapeSeries() {
    const url = 'https://ramaorientalfansub.tv/paese/corea-del-sud/';
    const seriesData = [];

    try {
        const response = await fetch(url);
        const data = await response.text();
        const $ = cheerio.load(data);

        $('a[href*="/drama/"]').each((index, element) => {
            const seriesUrl = $(element).attr('href');
            const seriesTitle = $(element).text().trim();
            seriesData.push({
                title: seriesTitle,
                url: seriesUrl
            });
        });

        return seriesData;
    } catch (error) {
        console.error('Errore durante lo scraping del sito:', error);
        throw error;
    }
}

module.exports = { scrapeSeries };

