import { Link } from "@solidjs/router";
import { Accessor, createSignal, Show } from "solid-js";
import URLs from "../config";
import User from "../Models/User";

interface TopbarProp { 
    user: Accessor<User>, 
    isLoggedIn: boolean,
    roomID: Accessor<string | undefined>
}

export default function Topbar(prop: TopbarProp) {
    const [showLogOut, setShowLogOut] = createSignal(false)

    async function Logout() {
        const response = await fetch("/api/logout")
        if (response.ok) {
            window.location.reload();
        }
    }
    
    return (
    <div class="h-12 bg-slate-900 w-full items-center flex px-8 justify-between">
        <Link href="/">
            <span class="text-xl font-bold">Meet</span>
        </Link>
        <Show when={prop.roomID() !== undefined}>
        <span class="hidden md:block">Room ID: {prop.roomID()}</span>
        </Show>
        <Show when={prop.isLoggedIn}>
            <div class="relative h-8 w-8 hover:cursor-pointer" onclick={() => setShowLogOut(p => !p)}>
                <img 
                src={prop.user().avatar_url} 
                alt="Avatar"
                class="rounded-full"
                />
                <Show when={showLogOut()}>
                <div class="absolute p-2 w-auto flex items-center bg-black h-12 right-0 rounded-md hover:cursor-default">
                    <div class="flex flex-col">
                    <span class="text-gray-500 text-xs">Logged in as</span>
                    <span>{prop.user().name}</span>
                    </div>
                    <div class="w-8"></div>
                    <button class="text-red-700" onclick={Logout}>Logout</button>
                </div>
                </Show>
            </div>
        </Show>
        <Show when={!prop.isLoggedIn}>
            <a class="px-3 py-1 rounded-md bg-black" href={URLs.oauth_url}>Login</a>
        </Show>
    </div>
  )
}
