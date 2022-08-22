const axios = require('axios').default;
const cheerio = require('cheerio');
const randomUseragent = require('random-useragent');
const XLSX = require('xlsx')

const main = async () => {
    try {
        const companies = [];
        const url = 'https://www.husseinattar.com/en/venture-capital-saudi-arabia/';
        const userAgent = randomUseragent.getRandom();        
        const responce = await axios.get(url, {
            headers: {
                'User-Agent': userAgent
            }
        });
        const $ = cheerio.load(responce.data);
        $('.tatsu-column > div > div > div > div > div > div > div > div > img').each(function(i, el){
            const logo = $(this).attr('data-src');
            companies.push({logo});
        });
        $('.team-description').each(function(i, el){
            const desc = $(this).text();
            companies[i].description = desc;
        });
        $('.team-description < div >  ul > li > a').each(function(i, el){
            const website = $(this).attr('href');
            companies[i].website = website;
        });
        const companiesWS = XLSX.utils.json_to_sheet(companies);
        const wb = XLSX.utils.book_new() 
        XLSX.utils.book_append_sheet(wb, companiesWS, 'Companies');
        XLSX.writeFile(wb, 'Companies.xlsx');

    } catch (err) { console.log('Error: ', err) }
}

main();