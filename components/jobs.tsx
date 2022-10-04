import { useState } from "react"
import { PlusIcon } from "@heroicons/react/20/solid"
import { FilterCategory } from "lib/types"
import Search from "./input-search"
import Image from "next/image"
import Chip from "./chip"
import JobsList from "./jobs-list"
import FiltersMobile from "./filters-mobile"
import FiltersDesktop from "./filters-desktop"

export default function Jobs({ filters }: { filters: Array<FilterCategory> }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [filterState, setFilterState] = useState(filters)

  let numFilters = 0
  filterState.forEach((x) => {
    x.options.forEach((y) => {
      if (y.selected) {
        numFilters++
      }
    })
  })

  function clearAll() {
    setFilterState((prevState) => {
      return prevState.map((x) => ({
        ...x,
        options: x.options.map((y) => ({ ...y, selected: false })),
      }))
    })
  }

  return (
    <div className="bg-white relative">
      <div className="absolute inset-x-0 h-72 bg-gray-300">
        <Image
          src="https://80000hours.org/wp-content/uploads/2020/02/job-board-library-compressed-1440x830.jpg"
          layout="fill"
          objectFit="cover"
        />
        <div className="bg-gradient-to-b from-white/10 to-white absolute inset-0"></div>
      </div>

      <div className="relative">
        <FiltersMobile
          filterState={filterState}
          setFilterState={setFilterState}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
        />
        <main className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="border-b border-gray-200 pb-10 lg:flex lg:justify-between lg:items-end">
            <div>
              <h1 className="text-4xl lg:text-7xl font-bold tracking-tight text-gray-900">
                Current Jobs
              </h1>
              <p className="bg-white/50 p-2 rounded mt-4 lg:mt-8 text-base text-gray-700">
                Checkout out the latest opportunities. Or{" "}
                <a
                  href="https://jobs-board.sanity.studio/desk/job"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-cyan-700"
                >
                  create your own in Sanity studio
                </a>
                ...
              </p>
            </div>
            <div className="mt-6 lg:mt-0 lg:ml-24 w-full lg:max-w-sm shadow-lg">
              <Search onSearch={(x) => setSearchText(x)} />
            </div>
          </div>

          <div className="pt-6 lg:pt-0 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
            <aside>
              <h2 className="sr-only">Filters</h2>
              <div className="lg:hidden flex justify-between items-center">
                <button
                  type="button"
                  className="inline-flex items-center text-cyan-600 hover:text-cyan-600"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <span className="text-sm font-medium">Add Filter</span>
                  <PlusIcon
                    className="ml-1 h-5 w-5 flex-shrink-0 text-current"
                    aria-hidden="true"
                  />
                </button>
                {numFilters > 0 ? (
                  <Chip
                    label={`${numFilters} filter${numFilters > 1 ? "s" : ""}`}
                    onRemove={() => clearAll()}
                  />
                ) : null}
              </div>
              <FiltersDesktop
                filterState={filterState}
                setFilterState={setFilterState}
              />
            </aside>
            {/* Jobs List */}
            <div className="relative mt-6 lg:col-span-2 xl:col-span-3 lg:mt-12">
              {numFilters > 0 ? (
                <div className="hidden lg:block absolute lg:-top-10 right-0">
                  <Chip
                    label={`${numFilters} filter${numFilters > 1 ? "s" : ""}`}
                    onRemove={() => clearAll()}
                  />
                </div>
              ) : null}
              <JobsList filters={filterState} searchText={searchText} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
