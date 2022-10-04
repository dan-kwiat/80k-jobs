import { Dispatch, Fragment, SetStateAction, useState } from "react"
import { Dialog, Disclosure, Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { FilterCategory } from "lib/types"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function FiltersMobile({
  filterState,
  setFilterState,
  mobileFiltersOpen,
  setMobileFiltersOpen,
}: {
  filterState: Array<FilterCategory>
  setFilterState: Dispatch<SetStateAction<Array<FilterCategory>>>
  mobileFiltersOpen: boolean
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>
}) {
  let numFilters = 0
  filterState.forEach((x) => {
    x.options.forEach((y) => {
      if (y.selected) {
        numFilters++
      }
    })
  })

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

  return (
    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40 lg:hidden"
        onClose={setMobileFiltersOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4">
                {filterState.map((section) => (
                  <Disclosure
                    as="div"
                    key={section._type}
                    className="border-t border-gray-200 pt-4 pb-4"
                  >
                    {({ open }) => (
                      <fieldset>
                        <legend className="w-full px-2">
                          <Disclosure.Button className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                            <span className="text-sm font-medium text-gray-900">
                              {section._type.toUpperCase()}
                            </span>
                            <span className="ml-6 flex h-7 items-center">
                              <ChevronDownIcon
                                className={classNames(
                                  open ? "-rotate-180" : "rotate-0",
                                  "h-5 w-5 transform"
                                )}
                                aria-hidden="true"
                              />
                            </span>
                          </Disclosure.Button>
                        </legend>
                        <Disclosure.Panel className="px-4 pt-4 pb-2">
                          <div className="space-y-6">
                            {section.options.map((option, optionIdx) => {
                              return (
                                <div
                                  key={option._id}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`${section._type}-${optionIdx}-mobile`}
                                    name={`${section._type}[]`}
                                    // id={option._id}
                                    defaultValue={option.name}
                                    checked={option.selected}
                                    onChange={(e) =>
                                      toggle(section._type, option._id)
                                    }
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                                  />
                                  <label
                                    // htmlFor={option._id}
                                    htmlFor={`${section._type}-${optionIdx}-mobile`}
                                    className="ml-3 text-sm text-gray-500"
                                  >
                                    {option.name}
                                  </label>
                                </div>
                              )
                            })}
                          </div>
                        </Disclosure.Panel>
                      </fieldset>
                    )}
                  </Disclosure>
                ))}
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
