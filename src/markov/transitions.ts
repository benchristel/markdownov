import {Bag} from "../bag.js"
import {pick} from "../random.js"
import {State, Token} from "./types.js"

export class Transitions<TokenT extends Token> {
    private readonly storage: Record<string, Bag<TokenT> | undefined> = {}

    constructor(private readonly rng: () => number) { }

    record(from: State<TokenT>, to: TokenT): void {
        (this.storage[from.context()] ??= new Bag()).add(to)
    }

    predictFrom(state: State<TokenT>): TokenT {
        return this.storage[state.context()]?.pick(this.rng())
            ?? state.terminalToken()
    }
}
