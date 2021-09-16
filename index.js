import {
    createComponentInstance,
    invokeLifeCycle,
    LifecycleHooks
} from "./create-component.js";
import {setCurrentInstance} from "@vue/runtime-core";
import {ref} from "@vue/reactivity";
import {onMounted, onUpdated, watchEffect} from "@vue/runtime-core";
import backcompat from './cjs-backcompat.cjs';
const {express} = backcompat;
const app = express()
const port = 3009

const component = createComponentInstance()
setCurrentInstance(component)

app.get('/', (req, res) => {
    invokeLifeCycle(LifecycleHooks.MOUNTED, component)
})


app.get('/update', (req, res) => {
    invokeLifeCycle(LifecycleHooks.UPDATED, component)
    res.send();
})

app.get('/quit', (req, res) => {
    invokeLifeCycle(LifecycleHooks.UNMOUNTED, component);
    component.scope.stop();
    res.send();
    setTimeout(() => process.exit(), 0);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

component.scope.run(() => {
    const val = ref(0);

    console.log("I am doing some stuff");

    onMounted(() => {
        console.log("I am mounted");
    })

    onUpdated(() => {
        console.log("I am updated");
    })

    watchEffect((onInvalidate) => {
        console.log("Value has changed", val.value)

        onInvalidate(() => {
            console.log("I AM CLEANING UP")
        })
    })

    val.value++;
})
