const cheerio = require('cheerio');
const request = require('../../utils/request');

async function scrapeJobs(link) {
  const jobsPage = await request({ url: `${link}/jobs` })
  const $ = cheerio.load(jobsPage);
  let jobs = [];
  $('div.styles_component__1_YxE').each((i, elem) => {
    const category = $(elem).find('h6').first().text();
    const title = $(elem).find('h4').text();
    const description = $(elem).find('div.styles_descriptionSnippet__yngxb').text().trim();
    const location = $(elem).find('div.styles_truncate__dUufp').text().slice('•');
    let time = null;
    const link = `https://angel.co${$(elem).find('a').attr('href')}`;
    $(elem).find('div.breakpoint__desktop-up').each((i, elem) => {
      if ($(elem).text().includes('Posted')) {
        time = $(elem).text();
      }
    })

    jobs.push({
      category,
      title,
      description,
      location,
      time,
      link,
    })

  })

  return jobs;
}


module.exports = scrapeJobs;