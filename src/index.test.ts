import {test, expect, is} from "@benchristel/taste"
import {hello} from "./index.js"

test("hello", {
    "returns a greeting"() {
        expect(hello(), is, "Hello, world!")
    },
})
