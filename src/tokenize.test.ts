import {test, expect, equals} from "@benchristel/taste"
import {tokenize} from "./tokenize.js"

test("tokenize", {
    "emits no tokens given empty text"() {
        const tokens = [...tokenize("")]
        expect(tokens, equals, [])
    },
})
