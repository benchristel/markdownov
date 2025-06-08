#!/usr/bin/env bun
import * as fs from "fs/promises"
import {MarkovModel} from "../../src/markov/markov-model"
import {MarkdownAwareOrder2} from "../../src/markov/markdown-aware-order-2"

const paths = process.argv.slice(2)

const model = new MarkovModel(Math.random, new MarkdownAwareOrder2())

async function trainOn(path: string): Promise<void> {
    const text = await fs.readFile(path, "utf-8")
    model.train(text)
}

Promise.all(paths.map(trainOn))
    .then(() => console.log(model.generate()))
    .catch(console.error)
