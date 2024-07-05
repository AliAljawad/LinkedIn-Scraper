const axios = require('axios');
const cheerio = require('cheerio');

async function fetchJobDescription(jobUrl) {
  try {
    const response = await axios.get(jobUrl);
    const html = response.data;
    const $ = cheerio.load(html);
    const description = $('.show-more-less-html__markup').text().trim();

    return description;
  } catch (error) {
    console.error('Error fetching job description:', error);
    return '';
  }
}

module.exports = {
  fetchJobDescription
};
