export default function Chip({
  onRemove,
  label,
}: {
  onRemove: () => void
  label: string
}) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 py-0.5 pl-2.5 pr-1 text-sm font-medium text-gray-700">
      {label}
      <button
        type="button"
        onClick={() => onRemove()}
        className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:bg-gray-500 focus:text-white focus:outline-none"
      >
        <span className="sr-only">Remove</span>
        <svg
          className="h-2 w-2"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 8 8"
        >
          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
        </svg>
      </button>
    </span>
  )
}
