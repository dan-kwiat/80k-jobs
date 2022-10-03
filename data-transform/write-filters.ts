import fs from "fs"
import readline from "readline"
import { filterId } from "./lib/format"
import type { Job } from "./types"

const JSON_LINES_FILE = "./data/job.ndjson"

async function getJobs(): Promise<Array<Job>> {
  let arr: Array<Job> = []

  const readStream = fs.createReadStream(JSON_LINES_FILE)
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  })

  rl.on("line", (data: Buffer) => {
    arr.push(JSON.parse(data.toString()))
  })
  return new Promise((resolve, reject) => {
    readStream.on("error", (err) => reject(err))
    rl.on("close", () => {
      resolve(arr)
    })
  })
}

function sortedArray(set: Set<string>): Array<string> {
  return Array.from(set)
    .filter((x) => !!x)
    .sort((a, b) => a.localeCompare(b))
}

function writeDocs(typeName: string, set: Set<string>) {
  fs.writeFileSync(
    `./data/sanity/${typeName}.ndjson`,
    sortedArray(set)
      .map((name) =>
        JSON.stringify({
          _id: filterId(typeName, name),
          _type: typeName,
          name,
          // slug: slugify(name),
        })
      )
      .join("\n")
  )
}

async function main() {
  const jobs = await getJobs()

  let experience = new Set<string>()
  let qualification = new Set<string>()
  let role = new Set<string>()
  let area = new Set<string>()
  let location = new Set<string>()

  jobs.forEach((job) => {
    // One per job:
    experience.add(job.required_experience)
    qualification.add(job.required_degree)
    // Many per job:
    job.roles.forEach((x) => role.add(x))
    job.problem_areas.forEach((x) => area.add(x))
    job.countries.forEach((x) => location.add(x))
  })

  writeDocs("experience", experience)
  writeDocs("qualification", qualification)
  writeDocs("role", role)
  writeDocs("area", area)
  writeDocs("location", location)
}

main()
