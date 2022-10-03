import { Fragment, useState } from "react"
import { Dialog, Disclosure, Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/20/solid"
import { FilterCategory, Job } from "lib/types"
import { CalendarIcon, MapPinIcon, UsersIcon } from "@heroicons/react/20/solid"
import { indexQuery } from "lib/queries"
import { sanityClient } from "lib/sanity.client"
import useSWR from "swr"

const filters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White" },
      { value: "beige", label: "Beige" },
      { value: "blue", label: "Blue" },
      { value: "brown", label: "Brown" },
      { value: "green", label: "Green" },
      { value: "purple", label: "Purple" },
    ],
  },
  {
    id: "category",
    name: "Category",
    options: [
      { value: "new-arrivals", label: "All New Arrivals" },
      { value: "tees", label: "Tees" },
      { value: "crewnecks", label: "Crewnecks" },
      { value: "sweatshirts", label: "Sweatshirts" },
      { value: "pants-shorts", label: "Pants & Shorts" },
    ],
  },
  {
    id: "sizes",
    name: "Sizes",
    options: [
      { value: "xs", label: "XS" },
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" },
      { value: "xl", label: "XL" },
      { value: "2xl", label: "2XL" },
    ],
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function fetcher(query: string, params: { limit: number }) {
  return sanityClient.fetch(query, params)
}

function JobsList({ filters }: { filters: Array<FilterCategory> }) {
  const { data: dynamicJobs, error } = useSWR<Array<Job>>(
    [
      indexQuery({ filters }),
      {
        limit: 20,
      },
    ],
    fetcher
  )

  // useEffect(() => {
  //   if (dynamicJobs) {
  //     window.scrollTo(0, 0)
  //   }
  // }, [dynamicJobs])

  return error ? (
    <div className="text-red-400">{JSON.stringify(error)}</div>
  ) : (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {dynamicJobs?.map((position) => (
          <li key={position._id}>
            <a
              href={position.vacancy_page}
              target="_blank"
              rel="noreferrer noopener"
              className="block hover:bg-gray-50"
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-indigo-600">
                    {position.title}
                  </p>
                  <div className="ml-2 flex flex-shrink-0">
                    <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
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
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Jobs({ filters }: { filters: Array<FilterCategory> }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const [filterState, setFilterState] = useState(filters)

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

  return (
    <div className="bg-white">
      <div>
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
                                  {section._type}
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
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
          <div className="border-b border-gray-200 pb-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              80,000 Hours Jobs
            </h1>
            <p className="mt-4 text-base text-gray-500">
              Checkout out the latest opportunities
            </p>
          </div>

          <div className="pt-12 lg:pt-0 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
            <aside>
              <h2 className="sr-only">Filters</h2>

              <button
                type="button"
                className="inline-flex items-center lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="text-sm font-medium text-gray-700">
                  Filters
                </span>
                <PlusIcon
                  className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
              </button>

              <div className="hidden lg:block sticky top-0 max-h-screen overflow-auto px-2 py-12">
                <form className="space-y-10 divide-y divide-gray-200">
                  {filterState.map((section, sectionIdx) => (
                    <div
                      key={section._type}
                      className={sectionIdx === 0 ? null : "pt-10"}
                    >
                      <fieldset>
                        <legend className="block text-sm font-medium text-gray-900">
                          {section._type}
                        </legend>
                        <div className="space-y-3 pt-6">
                          {section.options.map((option, optionIdx) => (
                            <div key={option._id} className="flex items-center">
                              <input
                                id={`${section._type}-${optionIdx}`}
                                name={`${section._type}[]`}
                                // defaultValue={option.value}
                                checked={option.selected}
                                onChange={(e) =>
                                  toggle(section._type, option._id)
                                }
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                  ))}
                </form>
              </div>
            </aside>

            {/* Product grid */}
            <div className="mt-6 lg:col-span-2 lg:mt-12 xl:col-span-3">
              <JobsList filters={filterState} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
