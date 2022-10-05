import { FilterCategory, Job } from "./types"

const jobFields = `
  _id,
  title,
  org,
  vacancy_page,
  location,
  date_published,
  date_it_closes,
  problem_area_main,
  problem_area_others,
  description,
  required_degree->{name},
  required_experience->{name},
  role_type,
  orgs_home_page,
  orgs_vacancies_page,
  orgs_logo,
  countries[]->{name},
  roles[]->{name},
  problem_areas[]->{name},
`

export const filtersQuery = `*[_type in ["area", "experience", "location", "qualification", "role"]]{ _id, _type, name }`

function getFilterStringScalar(
  filters: Array<FilterCategory>,
  filterType: FilterCategory["_type"],
  fieldName: keyof Job
): string {
  const categoryFilters = filters.find((x) => x._type === filterType)
  if (
    categoryFilters &&
    categoryFilters.options &&
    categoryFilters.options.find((x) => x.selected)
  ) {
    let arrayString = categoryFilters.options
      .filter((x) => x.selected)
      .map((x) => `"${x._id}"`)
      .join(",")
    return ` && ${fieldName}->_id in [${arrayString}]`
  }
  return ""
}

function getFilterStringArray(
  filters: Array<FilterCategory>,
  filterType: FilterCategory["_type"],
  fieldName: keyof Job
): string {
  const categoryFilters = filters.find((x) => x._type === filterType)
  if (
    categoryFilters &&
    categoryFilters.options &&
    categoryFilters.options.find((x) => x.selected)
  ) {
    let arrayString = categoryFilters.options
      .filter((x) => x.selected)
      .map((x) => `"${x._id}"`)
      .join(",")
    return ` && count((${fieldName}[]->_id)[@ in [${arrayString}]]) > 0`
  }
  return ""
}

export function indexQuery({
  filters,
  searchText,
}: {
  filters: Array<FilterCategory>
  searchText: string
}) {
  let today = new Date().toISOString().split("T")[0]
  let filterString = `_type == "job" && [title, org, role_type, problem_areas, location, ...description[].children[].text] match [${searchText
    .split(" ")
    .map((x) => `"${x}*"`)
    .join(", ")}] && date_it_closes >= '${today}'`

  filterString += getFilterStringScalar(
    filters,
    "experience",
    "required_experience"
  )
  filterString += getFilterStringScalar(
    filters,
    "qualification",
    "required_degree"
  )

  filterString += getFilterStringArray(filters, "area", "problem_areas")
  filterString += getFilterStringArray(filters, "location", "countries")
  filterString += getFilterStringArray(filters, "role", "roles")

  let scoreFunc = `score(
    boost(title match "${searchText}", 5),
    boost(description[].children[].text match "${searchText}", 4),
    boost(org match "${searchText}", 3),
    boost(role_type match "${searchText}", 1),
    boost(problem_areas match "${searchText}", 1),
    boost(location match "${searchText}", 1)
  )`

  return `*[${filterString}] | ${scoreFunc} | order(_score desc, date_it_closes asc, date_published desc) { _score, ${jobFields} }[0..$limit-1]`
}
