# 80k Hours demo jobs board with Sanity headless CMS

## Transform & Import Jobs Data

1. First follow the instruction in
   [./data-transform/README.md](./data-transform/README.md)
2. Then follow the instructions in [./studio/README.md](./studio/README.md)

## Running Web Apps Locally

### Setup

1. `yarn` to install packages
2. `cp .env.local.example .env.local` then fill in the values in `.env.local`

### Jobs Board

The jobs board is a Next.js app, hosted at
[https://80k-jobs.vercel.app/](https://80k-jobs.vercel.app/). To run it locally:

```bash
yarn dev
```

### Studio

The Sanity studio is hosted at
[https://jobs-board.sanity.studio/](https://jobs-board.sanity.studio/). To run
the studio locally:

```bash
yarn studio:dev
```

## Deployment

Deployment is automated on every git push.
