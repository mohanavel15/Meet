import { Accessor, createEffect, createSignal, Show } from "solid-js"
import User from "../Models/User"
import { BiSolidMicrophoneOff } from 'solid-icons/bi'
import State from "../Models/State"
import { createAmplitudeFromStream } from "@solid-primitives/stream"

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
    const [speaking, setSpeaking] = createSignal(false)
    const [AudioLevel] = createAmplitudeFromStream(stream)

    createEffect(() => {
        const level = AudioLevel()
        if (level > 50) {
          setSpeaking(true)
        } else {
          setSpeaking(false)
        }
    })

    return (
    <div class="relative flex items-center justify-center h-1/2 w-11/12 sm:h-full sm:w-1/2 m-2">
        <video class={`bg-black w-full h-full rounded-md p-1 bg-clip-content ${ speaking() && "border-2 border-green-600"}`} prop:srcObject={stream()} autoplay playsinline muted={self} />
        <Show when={state.video === false}>
            <img class="absolute w-20 h-20 rounded-full" src={user()?.avatar_url} alt={"avatar"} />
        </Show>
        <Show when={state.muted}>
            <div class="absolute bottom-6 right-6 p-2 backdrop-blur-sm bg-gray-900 rounded-full">
                <BiSolidMicrophoneOff />
            </div>
        </Show>
    </div>
    )
}
