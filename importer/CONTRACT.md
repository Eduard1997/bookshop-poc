# Import pipeline contract

Agreed by both students before splitting up the work (BSP-8).
Update this file if the shape changes later — it's the source of truth both
sides build against.

## Book object shape

The plain object the parser (BSP-9) produces for each book, and that the
Emporix client (BSP-11, BSP-12) consumes. Example:

```js
{
  isbn: "9783161484100",
  title: "Die Verwandlung",
  subtitle: "Eine Erzählung",
  authors: [{ role: "author", name: "Franz Kafka" }],
  language: "de",
  publisher: "Example Verlag AG",
  publicationDate: "2025-09-15",
  description: "<p>Als Gregor Samsa...</p>",
  coverImageUrl: "https://example.com/covers/9783161484100.jpg",
  category: "FBA",
  price: { amount: 18.90, currency: "CHF" },
  availability: "in_stock",
  pageCount: 128,
  productForm: "paperback",
}
```

<Replace with your actual agreed shape — field names and types.>

## Call order

1. Create the `bookDetails` mixin schema in Emporix — **once**, not per book (BSP-10)
2. For each book:
   a. Create the product in Emporix, including `bookDetails` mixin values (BSP-11)
   b. Create the price, using the product ID from step (a) (BSP-12)

## Re-run safety

<How duplicates are avoided — e.g. check for existing product by ISBN before
creating.>
