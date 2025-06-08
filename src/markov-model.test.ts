import {test, expect, is} from "@benchristel/taste"
import {MarkovModel} from "./markov-model.js"

test("a MarkovModel", {
    "generates nothing when not trained"() {
        const model = new MarkovModel()
        expect(model.generate(), is, "")
    },
})
