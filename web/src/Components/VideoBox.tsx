import { Accessor, createSignal, Show } from "solid-js"
import User from "../Models/User"
import { BiSolidMicrophoneOff } from 'solid-icons/bi'

interface VideoProps {
    video: Accessor<boolean>
    mute: Accessor<boolean>
    user: Accessor<User | undefined>
    self: boolean
    video_ref: (el: HTMLVideoElement) => void
}

export default function VideoBox({ video, mute, user, self, video_ref }: VideoProps) {
    const [spaeaking, setspaeaking] = createSignal(false)

    return (
    <div class="relative flex items-center justify-center">
        <Show when={self}>
        <video class={`bg-black w-full h-full rounded-md p-1 bg-clip-content ${ spaeaking() && "border-2 border-green-600"} m-2`} ref={video_ref} controls autoplay playsinline muted></video>
        </Show>
        <Show when={!self}>
        <video class={`bg-black w-full h-full rounded-md p-1 bg-clip-content ${ spaeaking() && "border-2 border-green-600"} m-2`} ref={video_ref} controls autoplay playsinline></video>
        </Show>
        <Show when={video() === false}>
            <img class="absolute w-20 h-20 rounded-full" src={user()?.avatar_url} alt={"avatar"} />
        </Show>
        <Show when={mute()}>
            <div class="absolute bottom-6 right-6">
                <BiSolidMicrophoneOff />
            </div>
        </Show>
    </div>
  )
}
