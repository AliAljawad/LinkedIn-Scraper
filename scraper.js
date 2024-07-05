const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeJobs() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const searchQuery = 'MLOps';
    const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchQuery)}`;
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    const jobs = await page.evaluate(() => {
      const jobElements = document.querySelectorAll('.base-card--link');

      const jobsData = [];
      
      jobElements.forEach(job => {
        const titleElement = job.querySelector('.base-search-card__title');
        const companyElement = job.querySelector('.base-search-card__subtitle a');
        const locationElement = job.querySelector('.job-search-card__location');
        const descriptionElement = "";
        const skills="";
        const postDateElement = job.querySelector('.job-search-card__listdate');
        const linkElement = job.querySelector('.base-card__full-link');
        
        if (titleElement && companyElement && locationElement && linkElement) {
          const title = titleElement.textContent.trim();
          const company = companyElement.textContent.trim();
          const location = locationElement.textContent.trim();
          const description = ""
          const postDate = postDateElement ? postDateElement.textContent.trim() : '';
          const link = linkElement.getAttribute('href');
          
          jobsData.push({
            title,
            company,
            location,
            description,
            skills,
            postDate,
            link
          });
        }
      });
      
      return jobsData;
    });
    
    await browser.close();
    
    fs.writeFileSync('jobs.json', JSON.stringify(jobs, null, 2), 'utf-8');
    
    console.log('Job data saved to jobs.json');
  } catch (error) {
    console.error('Error scraping jobs:', error);
  }
}

scrapeJobs();
