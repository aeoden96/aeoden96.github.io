---
title: "TypeScript - Discriminated Unions"
description: "Leveraging TypeScript's discriminated unions for type-safe code"
pubDate: "May 9 2024"
heroImage: "/blog-placeholder-3.jpg"
---

## TypeScript Discriminated Unions

TypeScript's discriminated unions are a powerful feature that allows you to create types that can be one of several variants, with type safety throughout your code.

### Basic Example

Here's a practical example that shows how discriminated unions work:

```typescript
type PropsA = {
  type: "A";
  myItem1: ItemA;
  myItem2: SpecialItem;
};

type PropsB = {
  type: "B";
  myItem1: ItemB;
  myItem3: OtherSpecialItem;
};

function Component(props: PropsA | PropsB) {
  if (props.type === "B") {
    const { myItem1, myItem3 } = props;

    // myItem1 is of type ItemB
    // myItem3 is also defined!
  } else {
    const { myItem1, myItem2 } = props;

    // myItem1 is of type ItemA
    // myItem2 is also defined!
  }
}
```

### Why This Is Useful

The power of this pattern is that TypeScript understands the relationship between the discriminant property (`type` in this case) and the rest of the properties. When you check the value of `type`, TypeScript automatically narrows the type of `props` to either `PropsA` or `PropsB`.

This gives you:

- Type safety when accessing properties
- Autocomplete suggestions that are context-aware
- Compiler errors if you try to access properties that don't exist in the current type

### When To Use

Discriminated unions are especially useful for:

- Component props that change based on a "mode" or "type"
- API responses that might return different data structures
- State management where the state shape changes based on status
- Modeling complex domain objects with distinct variants
