# Specification: State Type Selection

## Overview
The `Markdownov` class currently uses a fixed state type (likely `Order2State` with POS tagging, based on the codebase). This track aims to allow users to choose the state type via a constructor parameter.

## Requirements
- Define a union type for state names (e.g., `'order1'`, `'order2'`, `'pos-tagged-v1'`).
- Implement a factory function that returns the appropriate state constructor based on the provided name.
- Update the `Markdownov` constructor to accept an optional `state` parameter in its options object.
- Ensure backwards compatibility (default to a sensible state if none is provided).

## Implementation Details
- **Union Type:** `StateName = 'order1' | 'order2' | 'pos-tagged-v1'` (or similar versioned names).
- **Factory:** A function mapping `StateName` to the corresponding class (e.g., `Order1State`, `Order2State`, `PosTaggedState`).
- **Options Update:** Add `state?: StateName` to the `MarkdownovOptions` interface.
