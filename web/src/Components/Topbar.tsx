import { Accessor, createSignal, Show } from "solid-js";
import User from "../Models/User";

const oauth_url = "https://github.com/login/oauth/authorize?client_id=a53c416da46ab127f71a&redirect_uri=http://localhost:5000/api/auth/callback"

export default function Topbar({ user, isLoggedIn, roomID }: { user: Accessor<User>, isLoggedIn: Accessor<boolean>, roomID: Accessor<string | undefined> }) {
    const [showLogOut, setShowLogOut] = createSignal(false)
    
    return (
    <div class="h-12 bg-slate-900 w-full items-center flex px-8 justify-between">
        <span class="text-xl font-bold">Meet</span>
        <Show when={roomID() !== undefined}>
        <span>Room ID: {roomID()}</span>
        </Show>
        <Show when={isLoggedIn()}>
            <div class="relative h-8 w-8 hover:cursor-pointer" onclick={() => setShowLogOut(p => !p)}>
                <img 
                src={user().avatar_url} 
                alt="Avatar"
                class="rounded-full"
                />
                <Show when={showLogOut()}>
                <div class="absolute p-2 w-auto flex items-center bg-black h-12 right-0 rounded-md hover:cursor-default">
                    <div class="flex flex-col">
                    <span class="text-gray-500 text-xs">Logged in as</span>
                    <span>{user().name}</span>
                    </div>
                    <div class="w-8"></div>
                    <button class="text-red-700">Logout</button>
                </div>
                </Show>
            </div>
        </Show>
        <Show when={!isLoggedIn()}>
            <a class="px-3 py-1 rounded-md bg-black" href={oauth_url}>Login</a>
        </Show>
    </div>
  )
}
