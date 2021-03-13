const cheerio = require('cheerio');
const request = require('../../../utils/request');

async function scrapeCompanyInfo(link) {
  const page = await request({ url: link });
  if (!page) return null;

  const $ = cheerio.load(page);
  const links = {};
  let companySize = {};
  let raised = {};
  const name = $('a.styles_anchor__2aXMZ').text().trim();
  const tag = $('div.styles_name__14jlL').find('h2').text();
  const description = $('div.styles_description__34Ra7').text();
  $('div.styles_component__DaQ39')
    .find('a')
    .each((i, obj) => {
      if (i === 0 && $(obj).attr('href')) {
        links['website'] = $(obj).attr('href');
      }
      if ($(obj).attr('href').includes('facebook')) {
        links['facebook'] = $(obj).attr('href');
      }
      if ($(obj).attr('href').includes('twitter')) {
        links['twitter'] = $(obj).attr('href');
      }
      if ($(obj).attr('href').includes('linkedin')) {
        links['linkedin'] = $(obj).attr('href');
      }
    });

  const locations = [];
  $('div.styles_component__2yJfJ')
    .find('li')
    .each((i, obj) => {
      if (
        $(obj).text() &&
        !$(obj).text().includes('.com') &&
        !$(obj).text().includes('Show 5 more')
      ) {
        locations.push($(obj).text());
      }
    });

  $('div.styles_component__2yJfJ')
    .find('dt')
    .each((i, elem) => {
      if ($(elem).text().includes('people')) {
        companySize = $(elem).text();
      }
      if ($(elem).text().includes('$')) {
        raised = $(elem).text();
      }
    });

  let marketTags = [];
  $('dt.styles_tags__KR_s2')
    .find('a')
    .each((i, obj) => {
      marketTags.push($(obj).text());
    });

  const round = {};
  $('div.styles_card__j9u8o').each((i, obj) => {
    if ($(obj).text().includes('Funded over')) {
      round['foundOver'] = $(obj).find('h4').text();
    }
    if ($(obj).text().includes('Latest round')) {
      round['round'] = $(obj).find('h4').text();
    }
  });

  const member = [];
  $('div.styles_header__2n2Q4').each((i, elem) => {
    if ($(elem).find('h4').text()) {
      const title =
        $(elem).find('span.styles_byline__3ogLZ').text() || 'Founder';
      member.push({
        name: $(elem).find('h4').text(),
        tilte: title.includes('•')
          ? title.slice(0, title.indexOf('•')).trim()
          : title,
        url: `https://angel.co${$(elem).find('h4').find('a').attr('href')}`,
      });
    }
  });

  return {
    url: link,
    name,
    tag,
    description,
    links,
    locations,
    companySize,
    raised,
    marketTags,
    round,
    member,
    page,
  };
}

module.exports = scrapeCompanyInfo;
