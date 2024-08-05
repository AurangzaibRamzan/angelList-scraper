# AngelList (Wellfound) Scraper

## Overview

A Node.js-based scraper to extract company and job listing data from AngelList (Wellfound) using GraphQL requests.

## Features

- **Company Data**: Extracts company name, description, market, location, and funding.
- **Job Listings**: Retrieves job titles, company names, locations, and job types.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/angellist-scraper.git
    cd angellist-scraper
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

## Usage

1. Configure your settings in `config.js`.

2. Run the scraper:
    ```sh
    yarn save-company-urls
    yarn scrape-companies.js
    yarn  scrape-jobs.js
    ```

## License

This project is licensed under the MIT License.
