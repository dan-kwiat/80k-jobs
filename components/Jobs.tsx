import { Fragment, useState } from "react"
import { Dialog, Disclosure, Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/20/solid"
import { FilterCategory, Job } from "lib/types"
import { CalendarIcon, MapPinIcon, UsersIcon } from "@heroicons/react/20/solid"
import { indexQuery } from "lib/queries"
import { sanityClient } from "lib/sanity.client"
import useSWR from "swr"
import Search from "./search"
import { FaceFrownIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import Chip from "./chip"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function fetcher(query: string, params: { limit: number }) {
  return sanityClient.fetch(query, params)
}

const LIMIT = 20

const dummyJob: Job = {
  _id: "dummy-job",
  countries: [{ name: "UK" }],
  date_it_closes: "2022-10-03",
  date_published: "2022-09-23",
  description: [
    {
      _key: "VZ1EabbD",
      _type: "block",
      children: [
        {
          _key: "123",
          _type: "span",
          marks: [],
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
      ],
      markDefs: [],
      style: "normal",
    },
  ],
  location: "London.UK",
  org: "Organisation name",
  orgs_home_page: "example.com",
  orgs_logo: "",
  orgs_vacancies_page: "",
  problem_area_main: "A. Global health & poverty",
  problem_area_others: "",
  problem_areas: [{ name: "A. Global health & poverty" }],
  required_degree: { name: "Master's degree" },
  required_experience: { name: "5+ years of experience" },
  role_type: "Operations",
  roles: [{ name: "Operations" }],
  title: "Placeholder job title",
  vacancy_page: "example.com",
}

const dummyJobs = new Array(10).fill(dummyJob) as Array<Job>

function JobsList({
  filters,
  searchText,
}: {
  filters: Array<FilterCategory>
  searchText: string
}) {
  const { data: dynamicJobs, error } = useSWR<Array<Job>>(
    [
      indexQuery({ filters, searchText }),
      {
        limit: LIMIT,
      },
    ],
    fetcher
  )
  const loading = !dynamicJobs && !error
  const empty = !error && dynamicJobs && dynamicJobs.length === 0

  // useEffect(() => {
  //   if (dynamicJobs) {
  //     window.scrollTo(0, 0)
  //   }
  // }, [dynamicJobs])

  return error ? (
    <div className="text-red-400">{JSON.stringify(error)}</div>
  ) : (
    <div>
      <div
        className={`overflow-hidden bg-white shadow sm:rounded-md ${
          loading ? "blur-sm animate-pulse" : ""
        }`}
      >
        <ul role="list" className="divide-y divide-gray-200">
          {(loading ? dummyJobs : dynamicJobs).map((position, index) => (
            <li key={loading ? `dummy-${index}` : position._id}>
              <a
                href={position.vacancy_page}
                target="_blank"
                rel="noreferrer noopener"
                className="block hover:bg-gray-50"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium text-gray-700">
                      {position.title}
                    </p>
                    <div className="ml-2 flex flex-shrink-0">
                      <p className="inline-flex rounded-full bg-cyan-100 px-2 text-xs font-semibold leading-5 text-cyan-800">
                        {position.org}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <UsersIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        {position.roles.map((x) => x.name).join(" / ")}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <MapPinIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        {position.countries.map((x) => x.name).join(" / ")}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <CalendarIcon
                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <p>
                        Closing on{" "}
                        <time dateTime={position.date_it_closes}>
                          {position.date_it_closes}
                        </time>
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between space-x-2">
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {position.description.map((x) => (
                        <p key={x._key}>
                          {x.children.map((y) => y.text).join("")}
                        </p>
                      ))}
                    </div>
                    <div className="flex-shrink-0 rounded-full overflow-hidden w-8 h-8 shadow bg-gray-300">
                      {position.orgs_logo ? (
                        <Image
                          src={position.orgs_logo}
                          width={32}
                          height={32}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
      {empty ? (
        <div className="flex flex-col items-center justify-center">
          <FaceFrownIcon className="w-24 h-24 text-gray-700" />
          <div className="mt-4 text-lg font-medium text-gray-700">
            Sorry, we can't find any matching jobs
          </div>
        </div>
      ) : null}
      {dynamicJobs && dynamicJobs.length > 0 ? (
        dynamicJobs.length < LIMIT ? (
          <div className="mt-8 flex justify-center text-gray-700">
            <div>End of results</div>
          </div>
        ) : (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="cursor-not-allowed opacity-50 inline-flex items-center rounded-md border border-transparent bg-cyan-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              disabled
            >
              Show more
            </button>
          </div>
        )
      ) : null}
    </div>
  )
}

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

  function toggle(filterType: FilterCategory["_type"], filterId: string) {
    setFilterState((prevState) => {
      const i = prevState.findIndex((x) => x._type === filterType)
      const j = prevState[i].options.findIndex((x) => x._id === filterId)
      return [
        ...prevState.slice(0, i),
        {
          _type: filterType,
          options: [
            ...prevState[i].options.slice(0, j),
            {
              ...prevState[i].options[j],
              selected: !prevState[i].options[j].selected,
            },
            ...prevState[i].options.slice(j + 1),
          ],
        },
        ...prevState.slice(i + 1),
      ]
    })
  }
  function clear(filterType: FilterCategory["_type"]) {
    setFilterState((prevState) => {
      const i = prevState.findIndex((x) => x._type === filterType)
      return [
        ...prevState.slice(0, i),
        {
          _type: filterType,
          options: prevState[i].options.map((x) => ({ ...x, selected: false })),
        },
        ...prevState.slice(i + 1),
      ]
    })
  }

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
      <div className="absolute inset-x-0 h-72">
        <Image
          src="https://80000hours.org/wp-content/uploads/2020/02/job-board-library-compressed-1440x830.jpg"
          layout="fill"
          objectFit="cover"
        />
        <div className="bg-gradient-to-b from-white/10 to-white absolute inset-0"></div>
      </div>

      <div className="relative">
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4">
                    {filterState.map((section) => (
                      <Disclosure
                        as="div"
                        key={section._type}
                        className="border-t border-gray-200 pt-4 pb-4"
                      >
                        {({ open }) => (
                          <fieldset>
                            <legend className="w-full px-2">
                              <Disclosure.Button className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                                <span className="text-sm font-medium text-gray-900">
                                  {section._type.toUpperCase()}
                                </span>
                                <span className="ml-6 flex h-7 items-center">
                                  <ChevronDownIcon
                                    className={classNames(
                                      open ? "-rotate-180" : "rotate-0",
                                      "h-5 w-5 transform"
                                    )}
                                    aria-hidden="true"
                                  />
                                </span>
                              </Disclosure.Button>
                            </legend>
                            <Disclosure.Panel className="px-4 pt-4 pb-2">
                              <div className="space-y-6">
                                {section.options.map((option, optionIdx) => {
                                  return (
                                    <div
                                      key={option._id}
                                      className="flex items-center"
                                    >
                                      <input
                                        id={`${section._type}-${optionIdx}-mobile`}
                                        name={`${section._type}[]`}
                                        // id={option._id}
                                        defaultValue={option.name}
                                        checked={option.selected}
                                        onChange={(e) =>
                                          toggle(section._type, option._id)
                                        }
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                                      />
                                      <label
                                        // htmlFor={option._id}
                                        htmlFor={`${section._type}-${optionIdx}-mobile`}
                                        className="ml-3 text-sm text-gray-500"
                                      >
                                        {option.name}
                                      </label>
                                    </div>
                                  )
                                })}
                              </div>
                            </Disclosure.Panel>
                          </fieldset>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

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

              <div className="hidden lg:block sticky top-0 max-h-screen overflow-auto px-2 py-12">
                <form className="space-y-10 divide-y divide-gray-200">
                  {filterState.map((section, sectionIdx) => {
                    const numSectionFilters = filterState[
                      sectionIdx
                    ].options.filter((x) => x.selected).length
                    return (
                      <div
                        key={section._type}
                        className={sectionIdx === 0 ? null : "pt-10"}
                      >
                        <fieldset>
                          <div className="flex justify-between items-center">
                            <legend className="block text-sm font-medium text-gray-900">
                              {section._type.toUpperCase()}
                            </legend>
                            {numSectionFilters > 0 ? (
                              <button
                                className="text-sm text-cyan-600 hover:text-cyan-700 mr-3"
                                onClick={() => clear(section._type)}
                              >
                                clear
                              </button>
                            ) : null}
                          </div>
                          <div className="space-y-3 pt-6">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option._id}
                                className="flex items-center"
                              >
                                <input
                                  id={`${section._type}-${optionIdx}`}
                                  name={`${section._type}[]`}
                                  // defaultValue={option.value}
                                  checked={option.selected}
                                  onChange={(e) =>
                                    toggle(section._type, option._id)
                                  }
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                                />
                                <label
                                  htmlFor={`${section._type}-${optionIdx}`}
                                  className="ml-3 text-sm text-gray-600"
                                >
                                  {option.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </fieldset>
                      </div>
                    )
                  })}
                </form>
              </div>
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
