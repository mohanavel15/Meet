export default function Loader() {
  // https://tailwind-elements.com/docs/standard/components/spinners/
  return (
    <div class="flex justify-center items-center h-full w-full">
        <div class="animate-spin inline-block border-8 w-16 h-16 border-l-gray-800 border-gray-900 rounded-full" role="status">
            <span class="hidden">Loading...</span>
        </div>
    </div>
  )
}
