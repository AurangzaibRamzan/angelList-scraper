const companyScrapper = require('../company');


describe("scrape companies", () => {
  it("wonolo", async () => {
    const company = await companyScrapper('https://angel.co/company/wonolo')
    expect(company).toMatchSnapshot();
  });
  it("stord", async () => {
    const company = await companyScrapper('https://angel.co/company/stord')
    expect(company).toMatchSnapshot();
  });
});


