import { Dispatch, SetStateAction } from "react"
import { FilterCategory } from "lib/types"

export default function FiltersDesktop({
  filterState,
  setFilterState,
}: {
  filterState: Array<FilterCategory>
  setFilterState: Dispatch<SetStateAction<Array<FilterCategory>>>
}) {
  function toggle(filterType: FilterCategory["_type"], filterId: string) {
    setFilterState((prevState) => {
      const i = prevState.findIndex((x) => x._type === filterType)
      const j = prevState[i].options.findIndex((x) => x._id === filterId)
      return [
        ...prevState.slice(0, i),
        {
          _type: filterType,
          options: [
            ...prevState[i].options.slice(0, j),
            {
              ...prevState[i].options[j],
              selected: !prevState[i].options[j].selected,
            },
            ...prevState[i].options.slice(j + 1),
          ],
        },
        ...prevState.slice(i + 1),
      ]
    })
  }
  function clear(filterType: FilterCategory["_type"]) {
    setFilterState((prevState) => {
      const i = prevState.findIndex((x) => x._type === filterType)
      return [
        ...prevState.slice(0, i),
        {
          _type: filterType,
          options: prevState[i].options.map((x) => ({ ...x, selected: false })),
        },
        ...prevState.slice(i + 1),
      ]
    })
  }

  return (
    <div className="hidden lg:block sticky top-0 max-h-screen overflow-auto px-2 py-12">
      <form className="space-y-10 divide-y divide-gray-200">
        {filterState.map((section, sectionIdx) => {
          const numSectionFilters = filterState[sectionIdx].options.filter(
            (x) => x.selected
          ).length
          return (
            <div
              key={section._type}
              className={sectionIdx === 0 ? null : "pt-10"}
            >
              <fieldset>
                <div className="flex justify-between items-center">
                  <legend className="block text-sm font-medium text-gray-900">
                    {section._type.toUpperCase()}
                  </legend>
                  {numSectionFilters > 0 ? (
                    <button
                      className="text-sm text-cyan-600 hover:text-cyan-700 mr-3"
                      onClick={() => clear(section._type)}
                    >
                      clear
                    </button>
                  ) : null}
                </div>
                <div className="space-y-3 pt-6">
                  {section.options.map((option, optionIdx) => (
                    <div key={option._id} className="flex items-center">
                      <input
                        id={`${section._type}-${optionIdx}`}
                        name={`${section._type}[]`}
                        // defaultValue={option.value}
                        checked={option.selected}
                        onChange={(e) => toggle(section._type, option._id)}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <label
                        htmlFor={`${section._type}-${optionIdx}`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        {option.name}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          )
        })}
      </form>
    </div>
  )
}
