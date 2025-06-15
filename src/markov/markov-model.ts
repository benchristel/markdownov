import {pick} from "../random.js"
import {State, Order, Token} from "./types.js"
import {take} from "../iterators.js"

export class MarkovModel<T extends Token> {
    // TODO: make MarkovModel generic and make the value of transitions use
    // the token type.
    private readonly transitions: Record<string, T[] | undefined> = {}

    constructor(
        private readonly rng: () => number,
        private readonly order: Order<T>,
    ) {}

    train(text: string) {
        // TODO: WTF. This textBoundary stuff doesn't need to be here. The
        // tokenized text shouldn't include the initial boundary, since we just
        // ignore those tokens.
        const textBoundary = this.order.textBoundary()
        const tokens = this.order.tokenize(text)
        let state = this.order.initialState()
        for (let i = textBoundary.length; i < tokens.length; i++) {
            const token = tokens[i]
            // TODO: this is gross. `transitions` really needs to be an object.
            ;(this.transitions[state.id()] ??= []).push(token)
            state.update(token)
        }
    }

    generate(limit = 100_000): string {
        return [...take(limit, this.generateTokens())].join("")
    }

    *generateTokens(): Generator<T, void, undefined> {
        yield* this.order.textBoundary()
        let state = this.order.initialState()
        do {
            const next = this.predictFrom(state)
            yield next
            state.update(next)
        } while (!state.isTerminal())
    }

    private predictFrom(state: State<T>): T {
        // TODO: decouple from token type
        const possibilities = this.transitions[state.id()] ?? []
        return pick(this.rng, possibilities) ?? this.order.defaultToken()
    }
}
