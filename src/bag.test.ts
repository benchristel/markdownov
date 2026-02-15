import {test, expect, is, equals, which} from "@benchristel/taste"
import {Bag} from "./bag.js"

test("Bag", {
    "returns undefined from pick() when empty"() {
        const bag = new Bag()
        expect(bag.pick(0), is, undefined)
        expect(bag.pick(0.99), is, undefined)
    },

    "always returns a lone element from pick()"() {
        const bag = new Bag()
        bag.add(1)
        expect(bag.pick(0), is, 1)
    },

    "returns an element at random"() {
        const bag = new Bag()
        bag.add(1)
        bag.add(2)

        const n = 20
        const results = Array(n).fill(null).map((_, i) => bag.pick(i / n))

        expect(new Set(results), equals, new Set([1, 2]))
    },

    "picks elements in proportion to how often they have been added"() {
        const bag = new Bag()
        bag.add(1)
        bag.add(2)
        bag.add(2)

        const n = 10
        const results = Array(n).fill(null).map((_, i) => bag.pick(i / n))

        expect(results, equals, [1, 1, 1, 1, 2, 2, 2, 2, 2, 2])
    },

    "de-duplicates elements by value"() {
        const a = {}
        const b = {}
        const c = {x: 1}

        const bag = new Bag()
        bag.add(a)
        bag.add(b)
        bag.add(c)

        const n = 10
        const results = Array(n).fill(null).map((_, i) => bag.pick(i / n))

        // b gets droppe because it's value-equal to a. a is used instead.
        expect(results, equals, [
            which(is(a)),
            which(is(a)),
            which(is(a)),
            which(is(a)),
            which(is(a)),
            which(is(a)),
            which(is(a)),
            which(is(c)),
            which(is(c)),
            which(is(c)),
        ])
    },
})
