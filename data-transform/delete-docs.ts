import client from "./lib/client"

const TYPE_NAME = ""
// const TYPE_NAME = "job"
// const TYPE_NAME = "area"
// const TYPE_NAME = "experience"
// const TYPE_NAME = "location"
// const TYPE_NAME = "qualification"
// const TYPE_NAME = "role"

async function main() {
  client
    .delete({ query: `*[_type == "${TYPE_NAME}"]` })
    .then(() => {
      console.log(`All docs of type '${TYPE_NAME}' deleted`)
    })
    .catch((err) => {
      console.error("Delete failed: ", err.message)
    })
}

main()
