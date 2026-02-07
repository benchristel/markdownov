import {pick} from "../random.js"
import {State, Token} from "./types.js"
import {take} from "../iterators.js"

export class MarkovModel<TokenT extends Token> {
    private readonly transitions: Record<string, TokenT[] | undefined> = {}

    constructor(
        private readonly rng: () => number,
        private readonly initialState: () => State<TokenT>,
    ) {}

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

    private *generateTokens(): Generator<TokenT, void, undefined> {
        let state = this.initialState()
        do {
            const next = this.predictFrom(state)
            yield next
            state.update(next)
        } while (!state.isTerminal())
    }

    private predictFrom(state: State<TokenT>): TokenT {
        return pick(this.rng, this.possibilities(state))
            ?? state.terminalToken()
    }

    private recordTransition(from: State<TokenT>, to: TokenT): void {
        // TODO: Might be primitive obsession? Make transitions a class?
        (this.transitions[from.id()] ??= []).push(to)
    }

    private possibilities(state: State<TokenT>): TokenT[] {
        // TODO: Might be primitive obsession? Make transitions a class?
        return this.transitions[state.id()] ?? []
    }
}
