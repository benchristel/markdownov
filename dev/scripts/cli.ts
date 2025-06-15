#!/usr/bin/env bun
import * as fs from "fs/promises"
import pos from "pos"
import {MarkovModel} from "../../src/markov/markov-model.js"
import {PosTaggedState, PosTaggedToken, tokenizeWithPosTags} from "../../src/markov/state/pos-tagged-state.js"
import {seedRandom} from "../../src/random.js"

const paths = process.argv.slice(2)

const model = new MarkovModel(Math.random, () => new PosTaggedState())

async function trainOn(path: string): Promise<void> {
    const text = await fs.readFile(path, "utf-8")
    model.train(tokenizeWithPosTags(text))
}

function main() {
    return Promise.all(paths.map(trainOn))
        .then(() => console.log(model.generate()))
        .catch(console.error)
}

main()
