export function *take<T>(max: number, iterable: Iterable<T>): Generator<T> {
    let i = 0
    for (const item of iterable) {
        if (i >= max) break
        yield item
        i++
    }
}
