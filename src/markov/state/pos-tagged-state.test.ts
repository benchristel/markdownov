import {test, expect, equals, is} from "@benchristel/taste"
import {PosTaggedState, PosTaggedToken, tokenizeWithPosTags} from "./pos-tagged-state.js"
import {testBehavesLikeState} from "./state-contract-tests.js"
import {Token, TokenFrequencies} from "../types.js"

testBehavesLikeState(PosTaggedState)

test("PosTaggedState", {
    "includes POS tags in id"() {
        const frequencies = FakeTokenFrequencies({})
        const state = new PosTaggedState()
        state.update(new PosTaggedToken("the", "DET"), frequencies)
        state.update(new PosTaggedToken("bear", "N"), frequencies)
        state.update(new PosTaggedToken("did", "VPST"), frequencies)
        state.update(new PosTaggedToken("not", "NEG"), frequencies)
        state.update(new PosTaggedToken("order", "V"), frequencies)
        state.update(new PosTaggedToken("beer", "N"), frequencies)
        expect(state.id(), endsWith, "DET:N:VPST:NEG:order:beer")
    },

    "includes a recent salient token in the id"() {
        const frequencies = FakeTokenFrequencies({
            the: 0.1,
            bear: 0.001,
            did: 0.01,
            not: 0.01,
            order: 0.01,
            beer: 0.01,
        })
        const state = new PosTaggedState()
        state.update(new PosTaggedToken("the", "DET"), frequencies)
        state.update(new PosTaggedToken("bear", "N"), frequencies)
        state.update(new PosTaggedToken("did", "VPST"), frequencies)
        state.update(new PosTaggedToken("not", "NEG"), frequencies)
        state.update(new PosTaggedToken("order", "V"), frequencies)
        state.update(new PosTaggedToken("beer", "N"), frequencies)
        expect(state.id(), is, "bear:::DET:N:VPST:NEG:order:beer")
    },

    "does not use POS tags for punctuation"() {
        const frequencies = FakeTokenFrequencies({})
        const state = new PosTaggedState()
        state.update(new PosTaggedToken(",", "PUNCT"), frequencies)
        expect(state.id(), endsWith, ":,")
    },
})

test("PosTaggedToken", {
    "stringifies to the word it contains"() {
        const token = new PosTaggedToken("the-word", "the-tag")
        expect(token.toString(), is, "the-word")
    },
})

test("tokenizeWithPosTags", {
    "adds part-of-speech tags"() {
        const text = `Data types form the space "between" routines, since data are passed from routine to routine.`
        const tokens = tokenizeWithPosTags(text)
            .map((t) => `${t.word}:${t.tag}`)
        expect(tokens, equals, [
            "Data:NNP",
            " :_",
            "types:NNS",
            " :_",
            "form:NN",
            " :_",
            "the:DT",
            " :_",
            "space:NN",
            " \":_",
            "between:IN",
            "\" :_",
            "routines:NNS",
            ", :_",
            "since:IN",
            " :_",
            "data:NNS",
            " :_",
            "are:VBP",
            " :_",
            "passed:VBN",
            " :_",
            "from:IN",
            " :_",
            "routine:JJ",
            " :_",
            "to:TO",
            " :_",
            "routine:JJ",
            ".:_",
        ])
    },
})

function endsWith(suffix: string, s: string): boolean {
    return s.endsWith(suffix)
}

function FakeTokenFrequencies(obj: Record<string, number | undefined>): TokenFrequencies<Token> {
    return {
        fractionOfAllTokens(token: Token): number {
            return obj[token.toString()] ?? 0
        },
    }
}
