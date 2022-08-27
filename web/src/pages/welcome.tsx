export default function Welcome() {
  return (
    <div class="h-full w-full flex flex-col items-center justify-center">
        <span class="font-extrabold text-xl"> Please Log In </span>
        <span class="w-11/12 md:w-1/2 lg:w-1/4 font-bold">
            <br />
            <br />
            <br />
            One-To-One Video / Audio call app built with WebRTC, Go Fiber, Solid JS, TailwindCSS and uses Github OAuth.
            <br />
            <br />
            <br />
            <span class="text-red-500">
            This Application uses WebRTC so your IP address is visible to other user in the room
            </span>
        </span>
    </div>
  )
}
