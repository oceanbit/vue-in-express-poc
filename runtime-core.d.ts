import {
    AppContext,
    ComponentInternalInstance, ComponentPublicInstance,
    ComputedOptions,
    ConcreteComponent,
    MethodOptions, ObjectEmitsOptions, Slot, VNode
} from "@vue/runtime-core";

declare module "@vue/runtime-core" {
    // Replace unusable types for "InternalComponentInstance"
    export type UnionToIntersection<U> = (
        U extends any ? (k: U) => void : never
        ) extends (k: infer I) => void
        ? I
        : never

    export type Data = Record<string, unknown>
    export type EmitFn<
        Options = ObjectEmitsOptions,
        Event extends keyof Options = keyof Options
        > = Options extends Array<infer V>
        ? (event: V, ...args: any[]) => void
        : {} extends Options // if the emit is empty object (usually the default value for emit) should be converted to function
            ? (event: string, ...args: any[]) => void
            : UnionToIntersection<
                {
                    [key in Event]: Options[key] extends (...args: infer Args) => any
                    ? (event: key, ...args: Args) => void
                    : (event: key, ...args: any[]) => void
                }[Event]
                >

    export type InternalSlots = {
        [name: string]: Slot | undefined
    }


    export interface SchedulerJob extends Function {
        id?: number
        active?: boolean
        computed?: boolean
        /**
         * Indicates whether the effect is allowed to recursively trigger itself
         * when managed by the scheduler.
         *
         * By default, a job cannot trigger itself because some built-in method calls,
         * e.g. Array.prototype.push actually performs reads as well (#1740) which
         * can lead to confusing infinite loops.
         * The allowed cases are component update functions and watch callbacks.
         * Component update functions may update child component props, which in turn
         * trigger flush: "pre" watch callbacks that mutates state that the parent
         * relies on (#1801). Watch callbacks doesn't track its dependencies so if it
         * triggers itself again, it's likely intentional and it is the user's
         * responsibility to perform recursive state mutation that eventually
         * stabilizes (#1727).
         */
        allowRecurse?: boolean
        /**
         * Attached by renderer.ts when setting up a component's render effect
         * Used to obtain component information when reporting max recursive updates.
         * dev only.
         */
        ownerInstance?: ComponentInternalInstance
    }

    interface ComponentInternalInstance {
        type: ConcreteComponent<{}, any, any, ComputedOptions, MethodOptions> | undefined
        parent: ComponentInternalInstance | undefined
        root: ComponentInternalInstance | undefined
        appContext: AppContext | undefined
        vnode: VNode | undefined
        next: VNode | null | undefined
        subTree: VNode | undefined
        update: SchedulerJob | undefined
        proxy: ComponentPublicInstance | null | undefined
        exposed: Record<string, any> | null | undefined
        exposeProxy: Record<string, any> | null | undefined
        data: Data | undefined
        props: Data | undefined
        attrs: Data | undefined
        slots: InternalSlots | undefined
        refs: Data | undefined
        emit: EmitFn | undefined
    }

    export function setCurrentRenderingInstance(
        instance: ComponentInternalInstance | null
    ): ComponentInternalInstance | null

    export const ssrUtils: {
        setCurrentRenderingInstance,
    }
}
