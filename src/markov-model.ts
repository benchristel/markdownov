import {pick} from "./random.js"
import {tokenize} from "./tokenize.js"

const EOT = ""

export class MarkovModel {
    private transitions: Record<string, string[]> = {}

    constructor(private rng: () => number) {}

    train(text: string) {
        // TODO: hardcoded order
        const tokens = [EOT, ...tokenize(text), EOT]
        // TODO: hardcoded order
        for (let i = 1; i < tokens.length; i++) {
            const token = tokens[i]
            const previous = tokens[i - 1]
            this.transitions[previous] ??= []
            this.transitions[previous].push(token)
        }
    }

    generate(): string {
        let generated = [EOT]
        // TODO: hardcoded order
        let context = EOT
        // TODO: magic number
        for (let i = 0; i < 42; i++) {
            const next = this.predictFrom(context)
            generated.push(next)
            if (next === EOT) break
            // TODO: hardcoded order
            context = next
        }
        return generated.join("")
    }

    private predictFrom(context: string): string {
        return pick(this.rng, this.transitions[context] ?? [EOT])
    }
}
