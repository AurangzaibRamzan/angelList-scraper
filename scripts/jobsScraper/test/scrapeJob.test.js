const scrapeJob = require('../scrapeJob');


describe("scrape companies", () => {
  it("job 1", async () => {
    const jobs = await scrapeJob('https://angel.co/company/wonolo/jobs/909052-senior-full-stack-software-engineer-internal-tools')
    expect(jobs).toMatchSnapshot();
  });
  it("job 2", async () => {
    const jobs = await scrapeJob('https://angel.co/company/wonolo/jobs/1039539-mobile-developer-b2b-pey-intern-summer-2021')
    expect(jobs).toMatchSnapshot();
  });
});


