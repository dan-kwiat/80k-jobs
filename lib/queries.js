const postFields = `
  _id,
  name,
  title,
  date,
  excerpt,
  coverImage,
  "slug": slug.current,
  "author": author->{name, picture},
`

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

export const indexQuery = `
*[_type == "job" && date_it_closes >= '${
  new Date().toISOString().split("T")[0]
}'] | order(date_it_closes asc, date_published desc) {
  ${jobFields}
}[0..$limit-1]`

export const postQuery = `
{
  "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
    content,
    ${postFields}
  },
  "morePosts": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...2] {
    content,
    ${postFields}
  }
}`

export const postSlugsQuery = `
*[_type == "post" && defined(slug.current)][].slug.current
`

export const postBySlugQuery = `
*[_type == "post" && slug.current == $slug][0] {
  ${postFields}
}
`
