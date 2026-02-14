import {pick} from "../random.js"
import {State, Token} from "./types.js"

export class Transitions<TokenT extends Token> {
    private readonly storage: Record<string, TokenT[] | undefined> = {}

    constructor(private readonly rng: () => number) { }

    record(from: State<TokenT>, to: TokenT): void {
        (this.storage[from.value()] ??= []).push(to)
    }

    predictFrom(state: State<TokenT>): TokenT {
        return pick(this.rng, this.storage[state.value()] ?? []) ?? state.terminalToken()
    }

    possibilities(stateId: string): TokenT[] {
        return this.storage[stateId] ?? []
    }
}
