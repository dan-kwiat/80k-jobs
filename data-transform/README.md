# 80k Jobs Data Transform

## Setup

1. `yarn` to install packages
2. `cp .env.local.example .env.local` then fill in the values in `.env.local`
3. Download 80k jobs CSV from
   [airtable](https://airtable.com/shrD9UEKusc6BYWWc/tbl5zkv6T7WSivZ89) and save
   to `80k-jobs/data-transform/data/job.csv`

## Write Data

### Jobs

This script will:

- read the CSV
- transform each record to JSON
- add some array fields to each record
- dump two JSON lines files
  - one with raw docs
  - one with sanity-friendly docs

```bash
yarn write-jobs
```

### Filters

This script will:

- read the raw JSON lines file of jobs
- for each filter category e.g. location:
  - determine the unique set of values in the dataset e.g. UK, USA, ...
  - write a JSON lines file of the filter values in sanity-friendly format

```bash
yarn write-filters
```
