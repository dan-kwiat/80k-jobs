import { FilterCategory, Job } from "lib/types"
import { CalendarIcon, MapPinIcon, UsersIcon } from "@heroicons/react/20/solid"
import { indexQuery } from "lib/queries"
import { sanityClient } from "lib/sanity.client"
import useSWR from "swr"
import { FaceFrownIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import { PAGE_LIMIT } from "lib/constants"

function fetcher(query: string, params: { limit: number }) {
  return sanityClient.fetch(query, params)
}

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

export default function JobsList({
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
        limit: PAGE_LIMIT,
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
        dynamicJobs.length < PAGE_LIMIT ? (
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
