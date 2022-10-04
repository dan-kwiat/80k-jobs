import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { useEffect, useRef, useState } from "react"

function useDebounce(callback: () => void, delay) {
  const latestCallback = useRef<typeof callback>()
  const latestTimeout = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    latestCallback.current = callback
  }, [callback])

  return () => {
    if (latestTimeout.current) {
      clearTimeout(latestTimeout.current)
    }

    latestTimeout.current = setTimeout(() => {
      latestCallback.current()
    }, delay)
  }
}

export default function Search({
  onSearch,
}: {
  onSearch: (x: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>()
  const [state, setState] = useState("")

  const onChange = useDebounce(() => {
    onSearch(state)
  }, 300)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSearch(state)
        if (inputRef.current) {
          inputRef.current.blur()
        }
      }}
    >
      <label htmlFor="search" className="sr-only">
        Search jobs
      </label>
      <div className="relative mt-1 flex items-center">
        <input
          ref={inputRef}
          type="text"
          name="jobs-search"
          id="jobs-search"
          placeholder="Search jobs, orgs, roles..."
          value={state}
          onChange={(e) => {
            setState(e.currentTarget.value)
            onChange()
          }}
          className="block w-full rounded-md border-gray-300 pr-12 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
        />
        <div className="absolute inset-y-0 right-0 flex py-2 sm:py-1.5 pr-2 sm:pr-1.5">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-700" />
        </div>
      </div>
    </form>
  )
}
