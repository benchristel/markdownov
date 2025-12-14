import {pick} from "../random.js"
import {State, Token, TokenFrequencies} from "./types.js"
import {take} from "../iterators.js"

export class MarkovModel<T extends Token> implements TokenFrequencies<T> {
    private readonly transitions: Record<string, T[] | undefined> = {}
    private tokenCounts: Record<string, number | undefined> = {}
    private totalTokens: number = 0

    constructor(
        private readonly rng: () => number,
        private readonly initialState: () => State<T>,
    ) {}

    train(tokens: Iterable<T>) {
        // FIXME:
        tokens = [...tokens]
        for (const token of tokens) {
            this.countToken(token)
        }
        let state = this.initialState()
        for (const token of tokens) {
            this.recordTransition(state, token)
            state.update(token, this)
        }
        while (!state.isTerminal()) {
            const token = state.terminalToken()
            this.recordTransition(state, token)
            state.update(token, this)
        }
    }

    generate(limit = 100_000): string {
        return [...take(limit, this.generateTokens())].join("")
    }

    fractionOfAllTokens(token: T): number {
        // Add 1 for Laplace smoothing.
        return (this.getTokenCount(token) + 1) / (this.totalTokens + 1)
    }

    private *generateTokens(): Generator<T, void, undefined> {
        let state = this.initialState()
        do {
            const next = this.predictFrom(state)
            yield next
            state.update(next, this)
        } while (!state.isTerminal())
    }

    private predictFrom(state: State<T>): T {
        const prediction = pick(this.rng, this.possibilities(state))
        if (prediction == null) {
            return state.terminalToken()
        }
        return prediction
    }

    private recordTransition(from: State<T>, to: T): void {
        // TODO: Might be primitive obsession? Make transitions a class?
        (this.transitions[from.id()] ??= []).push(to)
    }

    private possibilities(state: State<T>): T[] {
        // TODO: Might be primitive obsession? Make transitions a class?
        return this.transitions[state.id()] ?? []
    }

    private countToken(token: T): void {
        this.tokenCounts[token.toString()] = this.getTokenCount(token) + 1
        this.totalTokens++
    }

    private getTokenCount(token: T): number {
        return this.tokenCounts[token.toString()] ?? 0
    }
}
