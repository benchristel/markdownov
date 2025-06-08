import {pick} from "./random.js"
import {tokenize} from "./tokenize.js"

const END = ""

export interface Order {
    textBoundary(): typeof END[];
    initialState(): State;
}

export interface State {
    id(): string;
    afterObserving(token: string): State;
    empty(): State;
    textBoundary(): typeof END[];
    isEndOfText(): boolean;
}

class Order1 implements Order {
    textBoundary(): typeof END[] {
        return [END]
    }

    initialState(): State {
        return new Order1State()
    }
}

class Order1State implements State {
    token = END

    id(): string {
        return this.token
    }

    afterObserving(token: string): State {
        this.token = token
        return this
    }

    // TODO: this method doesn't interact with any instance variables.
    // Move to a new Order interface?
    empty(): State {
        return new Order1State()
    }

    // TODO: this method doesn't interact with any instance variables.
    // Move to a new Order interface?
    textBoundary(): typeof END[] {
        return [END]
    }

    isEndOfText(): boolean {
        return this.token === END
    }
}

export class MarkovModel {
    private readonly transitions: Record<string, string[] | undefined> = {}

    constructor(
        private readonly rng: () => number,
        private readonly order = new Order1(),
    ) {}

    train(text: string) {
        const textBoundary = this.order.textBoundary()
        const tokens = [
            ...textBoundary,
            ...tokenize(text),
            ...textBoundary,
        ]
        let state = this.order.initialState()
        for (let i = textBoundary.length; i < tokens.length; i++) {
            const token = tokens[i]
            ;(this.transitions[state.id()] ??= []).push(token)
            state = state.afterObserving(token)
        }
    }

    generate(): string {
        let generated: string[] = this.order.textBoundary()
        let state = this.order.initialState()
        // TODO: magic number
        for (let i = 0; i < 42; i++) {
            const next = this.predictFrom(state)
            generated.push(next)
            state = state.afterObserving(next)
            if (state.isEndOfText()) break
        }
        return generated.join("")
    }

    private predictFrom(state: State): string {
        const possibilities = this.transitions[state.id()] ?? [END]
        return pick(this.rng, possibilities)
    }
}
