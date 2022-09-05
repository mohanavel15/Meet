import { Link } from "@solidjs/router";
import { Accessor, createSignal, Show } from "solid-js";
import URLs from "../config";
import User from "../Models/User";

export default function Topbar(prop: { user: Accessor<User>, isLoggedIn: Accessor<boolean>, roomID: Accessor<string | undefined> }) {
    const [showLogOut, setShowLogOut] = createSignal(false)
    
    return (
    <div class="h-12 bg-slate-900 w-full items-center flex px-8 justify-between">
        <Link href="/">
            <span class="text-xl font-bold">Meet</span>
        </Link>
        <Show when={prop.roomID() !== undefined}>
        <span class="hidden md:block">Room ID: {prop.roomID()}</span>
        </Show>
        <Show when={prop.isLoggedIn()}>
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
                    <button class="text-red-700">Logout</button>
                </div>
                </Show>
            </div>
        </Show>
        <Show when={!prop.isLoggedIn()}>
            <a class="px-3 py-1 rounded-md bg-black" href={URLs.oauth_url}>Login</a>
        </Show>
    </div>
  )
}
