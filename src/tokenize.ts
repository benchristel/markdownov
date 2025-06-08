const tokenRegex = /^([\u2E80-\u2EFF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFE30-\uFE4F]|[0-9\p{L}]*)[^0-9\p{L}]*/u

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
