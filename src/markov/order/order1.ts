import {tokenize} from "../../tokenize.js"
import {Order, State} from "../types.js"

const END = ""

export class Order1 implements Order<string> {
    initialState(): State<string> {
        return new Order1State()
    }

    tokenize(text: string): string[] {
        return [...tokenize(text)]
    }
}

export class Order1State implements State<string> {
    token = END

    id(): string {
        return this.token
    }

    update(token: string): void {
        this.token = token
    }

    isTerminal(): boolean {
        return this.token === END
    }

    terminalToken(): string {
        return END
    }
}
