import { Accessor, JSX, Show } from "solid-js";

export default function ActionButton({ children, visible, when, onclick }: { children: JSX.Element, visible: Accessor<boolean>, when: boolean, onclick?: () => void }) {
    return(
        <Show when={visible() === when}>
            <div onClick={onclick} class="mx-2 hover:cursor-pointer bg-white p-2 rounded-full">
                { children }
            </div>
        </Show>
    )
}