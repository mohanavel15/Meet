import { Accessor, createSignal, Show } from "solid-js"

interface HomeProps {
  isLoggedIn: Accessor<boolean>, 
  onCreate: () => void
  onJoin: (room_id: string) => void
}

export default function Home({ isLoggedIn, onCreate, onJoin }: HomeProps) {
  const [input, setInput] = createSignal("")

  return (
    <Show when={isLoggedIn}>
    <div class="flex items-center h-full w-full justify-center">
      <div class="flex flex-col bg-gray-900 rounded-xl p-4 sm:p-16">
        <input class="h-8 bg-gray-800 px-2" placeholder="Room ID" value={input()} onchange={e => setInput(e.currentTarget.value)}></input>
        <button class="h-8 bg-gray-800 rounded-lg my-4" onclick={() => onJoin(input())}>Join Room</button>
        <button class="h-8 bg-gray-800 rounded-lg" onClick={() => onCreate()}>Create Room</button>
      </div>
    </div>
    </Show>
  )
}
