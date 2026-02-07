import {test, expect, equals} from "@benchristel/taste"
import {DelimiterStack} from "./delimiter-stack.js"
import {tokenizeWithPosTags} from "./pos-tagged-state.js"

test("DelimiterStack", {
    "starts empty"() {
        const delimiters = new DelimiterStack().getDelimiters()
        expect(delimiters, equals, [])
    },

    "pushes a paren"() {
        const stack = new DelimiterStack()
        stack.process("(")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, ["("])
    },

    "pops a paren"() {
        const stack = new DelimiterStack()
        stack.process("(")
        stack.process(")")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [])
    },

    "processes matched delimiters within one token"() {
        const stack = new DelimiterStack()
        stack.process("()(())")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [])
    },

    "processes unmatched delimiters within one token"() {
        const stack = new DelimiterStack()
        stack.process("{()[")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, ["{", "["])
    },

    "pops in the presence of unmatched delimiters"() {
        const stack = new DelimiterStack()
        stack.process("(")
        stack.process("[")
        stack.process(")")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [])
    },

    "only pops until it finds a matching opening delimiter"() {
        const stack = new DelimiterStack()
        stack.process("(")
        stack.process("[")
        stack.process("]")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, ["("])
    },

    "ignores an unrecognized symbol"() {
        const stack = new DelimiterStack()
        stack.process("%")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [])
    },

    "handles matched quotes with surrounding space"() {
        const stack = new DelimiterStack()
        stack.process(` "`)
        stack.process("hello")
        stack.process(`" `)
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [])
    },

    "handles matched quotes without initial space"() {
        const stack = new DelimiterStack()
        stack.process(`"`)
        stack.process("hello")
        stack.process(`!" `)
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [])
    },

    "handles unmatched quotes"() {
        const stack = new DelimiterStack()
        stack.process(`"hello`)
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, ['"'])
    },

    "handles matched curly quotes"() {
        const stack = new DelimiterStack()
        stack.process(`“a”`)
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [])
    },

    "handles an unmatched open curly quote"() {
        const stack = new DelimiterStack()
        stack.process(`“a`)
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [`“`])
    },

    "ignores an unmatched closing curly quote"() {
        const stack = new DelimiterStack()
        stack.process(`a”`)
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [])
    },

    "handles markdown emphasis"() {
        const stack = new DelimiterStack()
        stack.process("_hello_ ")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [])
    },

    "handles unmatched markdown emphasis"() {
        const stack = new DelimiterStack()
        stack.process("_hello")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, ["_"])
    },

    "handles markdown strong text"() {
        const stack = new DelimiterStack()
        stack.process("**Hello**, world!")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [])
    },

    "handles unmatched markdown strong text"() {
        const stack = new DelimiterStack()
        stack.process("**Hello")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, ["**"])
    },

    "handles a complete markdown code block"() {
        const stack = new DelimiterStack()
        stack.process("```\nhello\n```")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [])
    },

    "handles a markdown code block with a language tag"() {
        const stack = new DelimiterStack()
        stack.process("```bash\necho hi\n```")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [])
    },

    "keeps track of an unterminated code block"() {
        const stack = new DelimiterStack()
        stack.process("\n```\n    hello\n")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, ["```"])
    },

    "keeps track of an unterminated code block with a language tag"() {
        const stack = new DelimiterStack()
        stack.process("```bash\necho hi\n")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, ["```"])
    },

    "ignores closing delimiters escaped by code blocks"() {
        const stack = new DelimiterStack()
        stack.process("**a\n```**")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, ["**", "```", "**"])
    },

    "keeps track of unterminated inline code"() {
        const stack = new DelimiterStack()
        stack.process("`")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, ["`"])
    },

    "closes inline code blocks"() {
        const stack = new DelimiterStack()
        stack.process("`a`")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [])
    },

    "ignores markdown syntax in code blocks"() {
        const stack = new DelimiterStack()
        stack.process("`**`")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [])
    },

    "processes a Markdown image tag"() {
        const stack = new DelimiterStack()
        stack.process(`![this alt text says "hi"](https://example.com)`)
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [])
    },

    "in the middle of a Markdown image tag"() {
        const stack = new DelimiterStack()
        stack.process(`![this alt text says "hi"](https://`)
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, ["("])
    },

    "given repeated intra-word emphasis"() {
        const stack = new DelimiterStack()
        stack.process(`here_is_some_snake_case_!`)
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [])
    },
})
