const scrapeJob = require('./scrapeJob');

async function scrapeJobs() {
  const jobLinks = ['https://angel.co/company/wonolo/jobs/909052-senior-full-stack-software-engineer-internal-tools'];
  const job = await scrapeJob(jobLinks[0]);

  console.log('scrape', {
    job,
  });
}


scrapeJobs();

