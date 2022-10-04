import Head from "next/head"
import { filtersQuery } from "../lib/queries"
import { getClient } from "../lib/sanity.server"
import Jobs from "../components/jobs"
import { Filter, FilterCategory } from "lib/types"
import { GetStaticProps } from "next"
import NavBar from "components/navbar"
import Meta from "components/meta"

interface Props {
  filters: Array<FilterCategory>
  preview: boolean
}

export default function Index({ filters }: Props) {
  return (
    <div className="min-h-screen">
      <Meta />
      <NavBar />
      <Jobs filters={filters} />
    </div>
  )
}
export const getStaticProps: GetStaticProps<Props> = async ({ preview }) => {
  const filters = await getClient(preview).fetch<Array<Filter>>(filtersQuery)
  const filterCategoriesDict = filters.reduce((agg, filter) => {
    let newAgg = { ...agg }
    if (!newAgg[filter._type]) {
      newAgg[filter._type] = []
    }
    newAgg[filter._type].push({
      _id: filter._id,
      name: filter.name,
      selected: false,
    })
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
    // revalidate: process.env.SANITY_REVALIDATE_SECRET ? undefined : 60,
  }
}
