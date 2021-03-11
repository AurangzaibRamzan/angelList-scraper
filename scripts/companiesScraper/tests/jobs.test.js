const jobsScraper = require('../jobs');


describe("scrape companies", () => {
  it("wonolo jobs", async () => {
    const jobs = await jobsScraper('https://angel.co/company/wonolo')
    expect(jobs).toMatchSnapshot();
  });
  it("stord jobs", async () => {
    const jobs = await jobsScraper('https://angel.co/company/stord')
    expect(jobs).toMatchSnapshot();
  });
});


