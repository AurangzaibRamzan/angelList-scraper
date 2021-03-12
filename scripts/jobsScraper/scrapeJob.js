const cheerio = require('cheerio');
const request = require('../../utils/request');

async function scrapeJob(link) {
  const jobPage = await request({ url: link })
  const $ = cheerio.load(jobPage);
  const title = $('div.styles_title__1MUG6').find('h2').text();
  const description = $('div.styles_description__4fnTp').text().trim();
  let location = null;
  let jobType = null;
  let visaSponsorship = null;
  let hiringContact = null;
  $('div.styles_characteristic__3-A9g').each((i, obj) => {
    // console.log()
    if ($(obj).text().includes('Location')) {
      location = $(obj).find('div.styles_component__26gqE').text().trim();
    }
    if ($(obj).text().includes('Job type')) {
      jobType = $(obj).find('dd').text().trim();
    }
    if ($(obj).text().includes('Visa')) {
      visaSponsorship = $(obj).find('dd').text().trim();
    }
  })

  if ($('div.styles_recruitingContact__2rsEb').find('h4').text()) {
    hiringContact = {
      name: $('div.styles_recruitingContact__2rsEb').find('h4').text().trim(),
      title: $('div.styles_recruitingContact__2rsEb').find('span.styles_byline__3ogLZ').text().trim(),
      url: `https://angel.co/${$('div.styles_recruitingContact__2rsEb').find('a').attr('href')}`,
    };

  }
  return {
    title,
    description,
    location,
    jobType,
    visaSponsorship,
    hiringContact,
    page: jobPage,
  };
}


module.exports = scrapeJob;