# markdownov

A Markdown-aware Markov model for text generation.

## Development

Dependencies: node 23.11.0, bun 1.2.13, pnpm 9.10.0

```sh
make deps    # one-time setup; installs dependencies and configures git hooks
make test    # run unit tests
make ts      # run the typechecker in watch mode
make lint    # run other static checks
make fix     # fix formatting
make verify  # run all checks
make right   # run all checks and fix formatting (do this before you commit)
make         # same as `make right`
```

The [Husky](https://typicode.github.io/husky/) git hook framework will run
`make right` automatically when you try to commit changes. To bypass this
check, use `git commit -n` or `git commit --no-verify`.
