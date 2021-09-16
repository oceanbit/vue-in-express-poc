import {EffectScope} from '@vue/reactivity';
import backcompat from './cjs-backcompat.cjs';
import {getCurrentInstance, setCurrentInstance} from "@vue/runtime-core";

let uid = 0

export const LifecycleHooks = {
    BEFORE_CREATE: 'bc',
    CREATED: 'c',
    BEFORE_MOUNT: 'bm',
    MOUNTED: 'm',
    BEFORE_UPDATE: 'bu',
    UPDATED: 'u',
    BEFORE_UNMOUNT: 'bum',
    UNMOUNTED: 'um',
    DEACTIVATED: 'da',
    ACTIVATED: 'a',
    RENDER_TRIGGERED: 'rtg',
    RENDER_TRACKED: 'rtc',
    ERROR_CAPTURED: 'ec',
    SERVER_PREFETCH: 'sp'
}

export const useInstanceScope = (instance, cb) => {
    const prev = getCurrentInstance()
    setCurrentInstance(instance)
    cb(instance)
    setCurrentInstance(prev)
}

export function createComponentInstance() {
    return {
        uid: uid++,
        scope: new EffectScope(true /* detached */),
        // lifecycle hooks
        // not using enums here because it results in computed properties
        isMounted: false,
        isUnmounted: false,
        isDeactivated: false,
        bc: null,
        c: null,
        bm: null,
        m: null,
        bu: null,
        u: null,
        um: null,
        bum: null,
        da: null,
        a: null,
        rtg: null,
        rtc: null,
        ec: null,
        sp: null
    }
}

export const invokeLifeCycle = (
    type,
    target
) => {
    if (target) {
        const hooks = target[type] || []
        useInstanceScope(target, () => {
            for (const hook of hooks)
                hook()
        })
    }
}
