# Implementation Plan: State Type Selection

## Phase 1: State Factory Foundation
- [ ] Task: Define the `StateName` union type and versioned names
    - [ ] Write failing tests for `StateName` type (using `tsd` or similar if applicable)
    - [ ] Implement the `StateName` union type in `src/markov/types.ts`
- [ ] Task: Implement the `StateFactory` function
    - [ ] Write failing tests for `StateFactory` mapping names to constructors
    - [ ] Implement `StateFactory` in a new file `src/markov/state/factory.ts`
- [ ] Task: Conductor - User Manual Verification 'State Factory Foundation' (Protocol in workflow.md)

## Phase 2: Markdownov Integration
- [ ] Task: Update `MarkdownovOptions` to include the `state` parameter
    - [ ] Write failing tests for `MarkdownovOptions` accepting `state`
    - [ ] Update the `MarkdownovOptions` interface in `src/markov/markdownov.ts`
- [ ] Task: Update `Markdownov` constructor to utilize the `StateFactory`
    - [ ] Write failing tests for `Markdownov` using the selected state type
    - [ ] Implement the logic to initialize the state using the factory in `src/markov/markdownov.ts`
- [ ] Task: Conductor - User Manual Verification 'Markdownov Integration' (Protocol in workflow.md)

## Phase 3: Polish and Finalization
- [ ] Task: Update documentation to reflect state selection
    - [ ] Update `README.md` with examples of choosing state types
- [ ] Task: Ensure all existing tests pass with the new default state
    - [ ] Run the full test suite and fix any regressions
- [ ] Task: Conductor - User Manual Verification 'Polish and Finalization' (Protocol in workflow.md)
