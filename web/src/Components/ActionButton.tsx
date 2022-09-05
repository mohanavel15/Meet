import { Accessor, JSX, Show } from "solid-js";

export default function ActionButton(prop: { children: JSX.Element, visible: Accessor<boolean>, when: boolean, onclick?: () => void }) {
    return(
        <Show when={prop.visible() === prop.when}>
            <div onClick={prop.onclick} class="mx-2 hover:cursor-pointer bg-white p-2 rounded-full">
                { prop.children }
            </div>
        </Show>
    )
}