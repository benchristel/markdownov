.DEFAULT_GOAL = right
TEST = bun dev/scripts/test.ts
LINT = bun run eslint src --config dev/config/eslint.config.js
TYPE = bun run tsc --noEmit --project dev/config/tsconfig.json

.PHONY: right
right: test typecheck fix ;

.PHONY: verify
verify: test typecheck lint ;

.PHONY: deps
deps:
	pnpm install
	pnpm husky

.PHONY: fix
fix:
	@$(LINT) --fix

.PHONY: lint
lint:
	@$(LINT)

.PHONY: test
test:
	@$(TEST)

.PHONY: ts
ts:
	@$(TYPE) --watch

.PHONY: typecheck
typecheck:
	@$(TYPE)

.PHONY: build
build:
	@rm -rf dist
	@bun run tsc --project dev/config/tsconfig.build.json

.PHONY: release
release: verify build
	@node_modules/.bin/bumpp --no-push --commit "Release v"

.PHONY: publish
publish:
	@pnpm publish && git push --tags
