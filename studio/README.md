# Sanity Studio

## Upload data

Run these one by one from the command line. Make sure you've already written the
data locally by running the scripts in [../data-transform](../data-transform/)

```bash
npx @sanity/cli dataset import ../data-transform/data/sanity/area.ndjson production
npx @sanity/cli dataset import ../data-transform/data/sanity/experience.ndjson production
npx @sanity/cli dataset import ../data-transform/data/sanity/location.ndjson production
npx @sanity/cli dataset import ../data-transform/data/sanity/qualification.ndjson production
npx @sanity/cli dataset import ../data-transform/data/sanity/role.ndjson production
npx @sanity/cli dataset import ../data-transform/data/sanity/job.ndjson production
```
