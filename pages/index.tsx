import Head from "next/head"
import Layout from "../components/layout"
import { filtersQuery } from "../lib/queries"
import { getClient } from "../lib/sanity.server"
import Jobs from "../components/Jobs"
import { Filter, FilterCategory } from "lib/types"
import { GetStaticProps } from "next"

interface Props {
  filters: Array<FilterCategory>
  preview: boolean
}

export default function Index({ filters, preview }: Props) {
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
        <Jobs filters={filters} />
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
export const getStaticProps: GetStaticProps<Props> = async ({ preview }) => {
  const filters = await getClient(preview).fetch<Array<Filter>>(filtersQuery)
  const filterCategoriesDict = filters.reduce((agg, filter) => {
    let newAgg = { ...agg }
    if (!newAgg[filter._type]) {
      newAgg[filter._type] = []
    }
    newAgg[filter._type].push({ _id: filter._id, name: filter.name })
    return newAgg
  }, {} as { [key in FilterCategory["_type"]]: FilterCategory["options"] })

  const filterCategoriesArr: Array<FilterCategory> = Object.keys(
    filterCategoriesDict
  )
    .map((filterType: FilterCategory["_type"]) => {
      return {
        _type: filterType,
        options: filterCategoriesDict[filterType],
      }
    })
    .sort((a, b) => a.options.length - b.options.length)

  return {
    props: {
      filters: filterCategoriesArr,
      preview: !!preview,
    },
    // If webhooks isn't setup then attempt to re-generate in 1 minute intervals
    revalidate: process.env.SANITY_REVALIDATE_SECRET ? undefined : 60,
  }
}
