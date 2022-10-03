import fs from "fs"
import { parse } from "csv-parse"
import { parse as parseSync } from "csv-parse/sync"
import type { Job } from "./types"
import { dequote, filterId, snakeCase } from "./lib/format"

const CSV_FILE = "./data/job.csv"
const JSON_LINES_FILE = "./data/job.ndjson"
const JSON_LINES_SANITY_FILE = "./data/sanity/job.ndjson"

async function getRecords(): Promise<Array<Job>> {
  const records: Array<Job> = []
  // Initialize the parser
  const parser = parse()

  fs.createReadStream(CSV_FILE).pipe(parser)

  let counter = 0
  let header: Array<string>
  // Use the readable stream api to consume records
  parser.on("readable", function () {
    let record: Array<string>
    while ((record = parser.read()) !== null) {
      if (counter === 0) {
        header = record.map((x) => snakeCase(x))
      } else {
        let obj: Job = header.reduce(
          (agg, fieldName, i) => ({ ...agg, [fieldName]: record[i] }),
          {} as Job
        )
        obj.countries = extractCountries(obj.location)
        obj.problem_areas = extractProblemAreas(
          obj.problem_area_main,
          obj.problem_area_others
        )
        obj.roles = extractRoles(obj.role_type)
        records.push(obj)
      }
      counter++
    }
  })
  return new Promise((resolve, reject) => {
    parser.on("error", function (err) {
      reject(err)
    })
    parser.on("end", function () {
      resolve(records)
    })
  })
}

function parseCSVLine(str: string | undefined): Array<string> {
  if (!str) {
    return []
  }
  return parseSync(str, {
    columns: false,
  })[0]
}

function dedupe(arr: Array<string>): Array<string> {
  return Array.from(new Set(arr))
}

function extractCountries(location: string | undefined): Array<string> {
  return dedupe(
    parseCSVLine(location)
      .map((x: string) => x.split(".")[1])
      .filter((x) => !!x) as Array<string>
  )
}

function extractProblemAreas(
  mainArea: string,
  otherAreas: string
): Array<string> {
  return dedupe([mainArea, ...parseCSVLine(otherAreas)].filter((x) => !!x))
}

function extractRoles(role: string): Array<string> {
  return dedupe(parseCSVLine(role).filter((x) => !!x))
}

// Transforms doc to format required for Sanity
function transform(doc: Job) {
  return {
    ...doc,
    // _id: slugify(`${job.org}-${job.title}-${job.date_published}`),
    _type: "job",
    // Mutate rich text field
    description: dequote(doc.description)
      .split("<br><br>")
      .map((para) => ({
        style: "normal",
        _type: "block",
        markDefs: [],
        children: [
          {
            _type: "span",
            text: para.trim(),
            marks: [],
          },
        ],
      })),
    // Mutate reference fields
    required_degree: {
      _type: "reference",
      _ref: filterId("qualification", doc.required_degree),
    },
    required_experience: {
      _type: "reference",
      _ref: filterId("experience", doc.required_experience),
    },
    problem_areas: doc.problem_areas.map((x) => ({
      _type: "reference",
      _ref: filterId("area", x),
    })),
    countries: doc.countries.map((x) => ({
      _type: "reference",
      _ref: filterId("location", x),
    })),
    roles: doc.roles.map((x) => ({
      _type: "reference",
      _ref: filterId("role", x),
    })),
  }
}

async function main() {
  const arr = await getRecords()
  const writeStream = fs.createWriteStream(JSON_LINES_FILE)
  const writeStreamSanity = fs.createWriteStream(JSON_LINES_SANITY_FILE)
  arr.forEach((job) => {
    writeStream.write(JSON.stringify(job) + "\n")
    writeStreamSanity.write(JSON.stringify(transform(job)) + "\n")
  })
}

main()
