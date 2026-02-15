import {State, Token} from "./types.js"
import {take} from "../iterators.js"
import {Transitions} from "./transitions.js"

export class MarkovModel<TokenT extends Token> {
    private readonly transitions: Transitions<TokenT>

    constructor(
        rng: () => number,
        private readonly initialState: () => State<TokenT>,
    ) {
        this.transitions = new Transitions<TokenT>(rng)
    }

    train(tokens: Iterable<TokenT>) {
        let state = this.initialState()
        for (const token of tokens) {
            this.recordTransition(state, token)
            state.update(token)
        }
        while (!state.isTerminal()) {
            const token = state.terminalToken()
            this.recordTransition(state, token)
            state.update(token)
        }
    }

    generate(limit = 100_000): string {
        return [...take(limit, this.generateTokens())].join("")
    }

    stats(): any {
        return this.transitions.stats()
    }

    private *generateTokens(): Generator<TokenT, void, undefined> {
        let state = this.initialState()
        do {
            const next = this.transitions.predictFrom(state)
            yield next
            state.update(next)
        } while (!state.isTerminal())
    }

    private recordTransition(from: State<TokenT>, to: TokenT): void {
        this.transitions.record(from, to)
    }
}
