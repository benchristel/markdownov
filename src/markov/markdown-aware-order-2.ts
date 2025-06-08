import {Order, State, END} from "./types.js"

export class MarkdownAwareOrder2 implements Order {
    textBoundary(): typeof END[] {
        return [END, END]
    }

    initialState(): State {
        return new MarkdownAwareOrder2State()
    }
}

export class MarkdownAwareOrder2State implements State {
    lastNonwordWithNewline = ""
    last = END
    lastButOne = END

    id(): string {
        return [this.lastNonwordWithNewline, this.lastButOne, this.last].join("")
    }

    update(token: string): void {
        if (this.lastButOne.includes("\n")) {
            // TODO: connascence of algorithm with tokenizer
            this.lastNonwordWithNewline =
                this.lastButOne.match(/\n.*/m)?.[0] ?? ""
        }

        if (token.includes("\n\n")) {
            // If we just saw a paragraph break, forget the earlier context.
            this.lastButOne = END
            // `[^]` matches any character including newlines.
            // `.` doesn't match newlines.
            this.last = token.match(/\n[^]*/)?.[0] ?? "\n\n"
        } else {
            this.lastButOne = this.last
            this.last = token
        }
    }

    tail(): string[] {
        return [this.lastButOne, this.last]
    }
}
