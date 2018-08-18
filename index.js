const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');

const options = {
  uri: `http://quotes.stormconsultancy.co.uk/`,
  transform: function (body) {
    return cheerio.load(body);
  }
};
const results = [];

rp(options)
  .then($ => {
    $('article.row').each((_, element) => {
      const quote = $(element).find('blockquote > p')
        .text()
        .slice(1, -1);
      const author = $(element).find('footer')
        .clone()
        .children()
        .remove()
        .end()
        .text()
        .trim()
        .slice(2);

      results.push({ author, quote });
    });

    return results;
  })
  .then(res => {
    const json = JSON.stringify(res);
    fs.writeFileSync('quotes.json', json, 'utf8');
    console.log('Done.');
  })
  .catch(err => {
    console.error(err);
  });
