const tokenRegex = /^[0-9\p{L}]*[^0-9\p{L}]*/u

export function *tokenize(text: string): Generator<string> {
    let token: string | undefined
    let rest = text
    while (token = wholeMatch(tokenRegex, rest)) {
        yield token
        rest = rest.slice(token.length)
    }
}

function wholeMatch(re: RegExp, s: string): string | undefined {
    const match = s.match(re)
    return match?.[0]
}
