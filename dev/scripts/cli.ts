#!/usr/bin/env bun
import * as fs from "fs/promises"
import {Markdownov} from "../../src/index.js"

const paths = process.argv.slice(2)

const model = new Markdownov()

async function trainOn(path: string): Promise<void> {
    const text = await fs.readFile(path, "utf-8")
    model.train(text)
}

function main() {
    const t0 = +new Date()
    let t1: number
    let t2: number
    return Promise.all(paths.map(trainOn))
        .then(() => t1 = +new Date())
        .then(() => console.log(model.generate()))
        .then(() => t2 = +new Date())
        .then(() => {
            console.log(model.stats())
            console.log("Training:", t1 - t0, "ms")
            console.log("Generating:", t2 - t1, "ms")
        })
        .catch(console.error)
}

main()
