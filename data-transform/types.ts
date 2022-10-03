export interface Job {
  title: string
  org: string
  vacancy_page: string
  location: string
  date_published: string
  date_it_closes: string
  problem_area_main: string
  problem_area_others: string
  description: string
  required_degree: string
  required_experience: string
  role_type: string
  orgs_home_page: string
  orgs_vacancies_page: string
  orgs_logo: string
  // Added columns:
  countries: Array<string>
  problem_areas: Array<string>
  roles: Array<string>
}
