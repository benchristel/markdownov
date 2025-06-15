export class DelimiterStack {
    private stack: string[] = []

    getDelimiters(): string[] {
        return [...this.stack]
    }

    process(token: string): void {
        for (const [delimiter] of token.matchAll(delimiterRegex)) {
            if (this.stack.some((d) => isOpeningMatchFor(delimiter, d))) {
                let popped: string | undefined
                while (popped = this.stack.pop()) {
                    if (isOpeningMatchFor(delimiter, popped)) {
                        break
                    }
                }
            } else if (couldBeOpening(delimiter)) {
                this.stack.push(delimiter)
            }
        }
    }
}

const delimiterRegex = /[\(\)\[\]\{\}“”]|\s?(["_]|\*\*)\s?/g

function couldBeOpening(delimiter: string): boolean {
    return /\(|\{|\[|“|(["\*_]|\*\*)$/.test(delimiter)
}

function isOpeningMatchFor(closing: string, opening: string): boolean {
    return opening === "(" && closing === ")"
        || opening === "{" && closing === "}"
        || opening === "[" && closing === "]"
        || opening.endsWith(`"`) && closing.startsWith(`"`)
        || opening.endsWith(`“`) && closing.startsWith(`”`)
        || opening.endsWith("_") && closing.startsWith("_")
        || opening.endsWith("**") && closing.startsWith("**")
}
