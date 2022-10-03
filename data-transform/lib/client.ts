import dotenv from "dotenv"
dotenv.config({
  path: ".env.local",
})
import sanityClient from "@sanity/client"

const client = sanityClient({
  projectId: process.env["SANITY_API_PROJECT_ID"] as string,
  dataset: process.env["SANITY_API_DATASET"] as string,
  apiVersion: "2021-03-25", // use current UTC date - see "specifying API version"!
  token: process.env["SANITY_API_WRITE_TOKEN"] as string, // or leave blank for unauthenticated usage
  useCdn: true, // `false` if you want to ensure fresh data
})

export default client
