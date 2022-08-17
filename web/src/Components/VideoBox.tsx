import { Accessor, Show } from "solid-js"
import User from "../Models/User"
import { BiSolidMicrophoneOff } from 'solid-icons/bi'
import State from "../Models/State"

interface VideoProps {
    state: State
    user: Accessor<User | undefined>
    stream: () => MediaStream | undefined
    self: boolean
}

declare module "solid-js" {
    namespace JSX {
        interface ExplicitProperties {
            srcObject?: MediaStream
        }
    }
}

export default function VideoBox({ state, user, stream, self }: VideoProps) {
    return (
    <div class="relative flex items-center justify-center h-1/2 w-full sm:h-full sm:w-1/2 m-2">
        <video class={`bg-black w-full h-full rounded-md p-1 bg-clip-content ${ false && "border-2 border-green-600"}`} prop:srcObject={stream()} autoplay playsinline muted={self} />
        <Show when={state.video === false}>
            <img class="absolute w-20 h-20 rounded-full" src={user()?.avatar_url} alt={"avatar"} />
        </Show>
        <Show when={state.muted}>
            <div class="absolute bottom-6 right-6">
                <BiSolidMicrophoneOff />
            </div>
        </Show>
    </div>
    )
}
