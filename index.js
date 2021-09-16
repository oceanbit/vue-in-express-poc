import {effectScope, ref} from "@vue/reactivity";
import {watchEffect} from "@vue/runtime-core";

const scope = effectScope()

scope.run(() => {
    const val = ref(0);

    console.log("I am doing some stuff");

    watchEffect((onInvalidate) => {
        console.log("Value has changed", val.value)

        onInvalidate(() => {
            console.log("I AM CLEANING UP")
        })
    })

    val.value++;
})

setTimeout(() => {
    scope.stop();
}, 1000)
