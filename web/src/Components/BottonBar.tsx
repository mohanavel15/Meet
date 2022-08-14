import { Accessor, createSignal, JSX, Show } from "solid-js"
import { BiSolidMicrophone, BiSolidMicrophoneOff } from 'solid-icons/bi'
import { 
    BsCameraVideoFill, 
    BsCameraVideoOffFill,
    BsTelephoneXFill
} from 'solid-icons/bs'

interface BottonBarProps {
    mute: Accessor<boolean>
    setMute: (bool: boolean) => void
    video: Accessor<boolean>
    setVideo: (bool: boolean) => void
    endCall: () => void
}

export default function BottonBar({ mute, setMute, video, setVideo, endCall }: BottonBarProps) {
    const [self, _] = createSignal(true)
    
    return (
    <div class="h-12 bg-slate-900 w-full items-center flex px-8 justify-center">
        <ActionButton visible={video} when={false} onclick={() => setVideo(true)}>
        <BsCameraVideoFill size={20} color="#000000" />
        </ActionButton>
        
        <ActionButton visible={video} when={true} onclick={() => setVideo(false)}>
        <BsCameraVideoOffFill size={20} color="#E60000"/>
        </ActionButton>
        
        <ActionButton visible={mute} when={false} onclick={() => setMute(true)}>
        <BiSolidMicrophone size={20} color="#000000"/>
        </ActionButton>
        
        <ActionButton visible={mute} when={true} onclick={() => setMute(false)} >
        <BiSolidMicrophoneOff size={20} color="#E60000"/>
        </ActionButton>
        
        <ActionButton visible={self} when={true} onclick={endCall}>
        <BsTelephoneXFill size={20} color="#E60000"/>
        </ActionButton>
        
    </div>
  )
}

function ActionButton({ children, visible, when, onclick }: { children: JSX.Element, visible: Accessor<boolean>, when: boolean, onclick?: () => void }) {
    return(
        <Show when={visible() === when}>
            <div onClick={onclick} class="mx-2 hover:cursor-pointer bg-white p-2 rounded-full">
                { children }
            </div>
        </Show>
    )
}