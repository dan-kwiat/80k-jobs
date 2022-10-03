import Head from "next/head"
import Layout from "../components/layout"
import { indexQuery } from "../lib/queries"
import { getClient, overlayDrafts } from "../lib/sanity.server"
import Jobs from "../components/Jobs"
import { Job } from "lib/types"

interface Props {
  jobs: Array<Job>
  preview: boolean
}

export default function Index({ jobs, preview }: Props) {
  // const { data: dynamicJobs } = usePreviewSubscription(indexQuery, {
  //   params: { limit: 5 },
  //   initialData: jobs,
  //   enabled: true, //preview,
  // })
  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>Jobs | 80,000 Hours</title>
        </Head>
        <Jobs />
        {/* <Container>
          <Intro />
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container> */}
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview = false }) {
  const jobs = overlayDrafts(
    await getClient(preview).fetch(indexQuery, { limit: 20 })
  )
  return {
    props: { jobs, preview },
    // If webhooks isn't setup then attempt to re-generate in 1 minute intervals
    revalidate: process.env.SANITY_REVALIDATE_SECRET ? undefined : 60,
  }
}
