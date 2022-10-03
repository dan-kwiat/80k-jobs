export interface Filter {
  _id: string
  _type: "area" | "experience" | "location" | "qualification" | "role"
  name: string
}

export interface FilterCategory {
  _type: Filter["_type"]
  options: Array<{ _id: string; name: string }>
}

export interface Job {
  _id: string
  countries: Array<{
    name: string
  }>
  date_it_closes: string
  date_published: string
  description: Array<{
    _key: string
    _type: string
    children: Array<{
      _key: string
      _type: string
      marks: Array<any>
      text: string
    }>
    markDefs: Array<any>
    style: string
  }>
  location: string
  org: string
  orgs_home_page: string
  orgs_logo: string
  orgs_vacancies_page: string
  problem_area_main: string
  problem_area_others: string
  problem_areas: Array<{
    name: string
  }>
  required_degree: {
    name: string
  }
  required_experience: {
    name: string
  }
  role_type: string
  roles: Array<{
    name: string
  }>
  title: string
  vacancy_page: string
}
