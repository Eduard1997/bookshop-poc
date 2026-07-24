# Project Brief: Bookshop POC

**Duration:** 8 weeks
**Team:** 2 students, 4 hours/day, Monday to Friday

---

## 1. What this is

You will build an online bookshop.

We give you a set of XML files containing book data in ONIX format — the standard used by publishers and book distributors. Your job is to get that data into **Emporix**, our commerce platform, and build a storefront on top where a visitor can browse books, add them to a cart, and place an order.

You are not building a commerce backend from scratch. Emporix already provides products, prices, carts, and orders as APIs. What you build is the two ends: the **importer** that feeds ONIX data into Emporix, and the **storefront** that presents it. In between sits editorial content, managed in **Payload CMS**.

You are starting from zero on the code. There is no existing project to copy. The design decisions that remain are yours.

## 2. Why we're doing it

**For you:** most student projects are toy exercises with clean inputs and a known answer. This one isn't. ONIX is a real industry format and it is not friendly. Emporix is a real commerce platform with real API documentation you'll have to read carefully. Nobody will hand you the answer.

**For us:** we want to evaluate two things on a domain we understand well — how well **Payload CMS** works as a storefront and content layer, and how it feels to build against **Emporix**. Your experience using both *is* the evaluation. When something is confusing, slow, or badly documented, that is a finding, not a failure — write it down and tell us.

**Together:** a working POC at the end of 8 weeks. Not a perfect one. A working one.

## 3. Architecture

This is decided for you, and it matters that you understand *why* before you start.

There are three parts. Two you build; one is a service you consume.

```
   ONIX XML
      │
      ▼
 ┌──────────┐        ┌────────────────────┐
 │ Importer │───────▶│      EMPORIX       │  products, prices,
 └──────────┘  REST  │  (commerce SaaS)   │  carts, checkout, orders
   (you build)       └────────────────────┘  ← source of truth for commerce
                             ▲                  (you do NOT build this)
                             │  REST (api.emporix.io)
                             │
     ┌───────────────────────┼─────────────────────────┐
     │  PAYLOAD APP  (one Next.js application)          │
     │                       │                          │
     │   app/(frontend)  ────┘                          │
     │   ┌──────────────────────────┐                   │
     │   │ Storefront               │  ← the shop       │
     │   │ list · detail · cart     │    customers see  │
     │   │ checkout · editorial     │                   │
     │   └───────────┬──────────────┘                   │
     │               │  Local API (in-process)          │
     │   app/(payload)                                  │
     │   ┌──────────────────────────┐                   │
     │   │ Admin panel  /admin      │  ← what editors   │
     │   │ Editorial content        │    use            │
     │   └───────────┬──────────────┘                   │
     └───────────────┼──────────────────────────────────┘
                     ▼
              ┌────────────────┐
              │    Postgres    │  editorial overlay + pages
              │   (Payload's)  │  ← source of truth for content
              └────────────────┘
```

**Emporix owns commerce.** Products, prices, stock, carts, checkout, orders. If a number affects what a customer pays, Emporix owns it and calculates it. You do not build this and you do not copy this data anywhere. You call Emporix's API.

**You build the importer.** It reads the ONIX files and pushes book data into Emporix through its Catalog/Product/Price APIs. This is your main backend work — and it's a real one: parsing a messy standard and mapping it onto someone else's schema is exactly the kind of integration work that fills a career.

**Payload owns editorial content**, and only that. Two kinds:

1. *Standalone content* — landing pages, banners, category descriptions, curated lists ("Staff picks", "New this month").
2. *An overlay on books* — a thin collection keyed by ISBN, holding only what a human editor adds on top of the catalog: a hand-written blurb, a "staff pick" flag, an alternative cover. It stores **no price, no stock, no title** — those live in Emporix. Payload references a book by its ISBN; it never restates it.

To be clear about prices: the storefront shows prices and the cart shows a total. That data comes from Emporix on every request. It is never copied into Payload. There is exactly one place a price exists.

**The storefront is the Payload app's `(frontend)`.** It is not a separate application — Payload 3 is a Next.js app, and your shop pages live inside it. A book detail page fetches the book from Emporix (HTTP) and its editorial overlay from Payload (in-process Local API), and renders them together. If Payload has nothing for that ISBN, the page still works.

Why this shape: it's how modern "composable commerce" is actually built — a commerce engine for the money-and-inventory truth, a CMS for the human-authored content, a storefront that composes them. Keeping that boundary clean, and resisting the urge to blur it when it's inconvenient, is one of the main things you'll learn here.

## 4. Emporix — what you need to know

Emporix is a headless, multi-tenant commerce platform. A few facts that shape your work:

- **We already have a tenant.** You will be given access. You do not create one, and you should be careful — it is a real environment, not a sandbox you can wipe.
- **API base URL:** `https://api.emporix.io`
- **Every request needs an access token.** Emporix uses OAuth2 with API keys tied to the tenant. Getting your first authenticated call to succeed is genuinely the first hurdle — budget time for it, and don't be surprised if it takes a few hours on day one. Once it works, keep the working example somewhere you can copy from.
- **Products, prices, and catalogs are separate services.** A product, its price, and its place in a catalog are distinct API calls. Read the Catalog / Product / Price documentation before designing the importer.
- **Search is eventually consistent.** After you import a product, it may not appear in search results immediately — Emporix indexes asynchronously. This will confuse you if you don't expect it. It is not a bug in your code.
- **Emporix publishes two open-source references** that are worth studying, not copying: a demo data importer and a B2B storefront showcase, both on their GitHub. Read them to see how authentication and the product APIs are used in practice.

Start from the developer docs: `https://developer.emporix.io/`. The general concepts page is the right first read.

## 5. Technology

**Fixed:**

| Layer | Technology | Why |
|---|---|---|
| Commerce backend | Emporix | Mandatory — provided tenant |
| Storefront + CMS | Payload CMS 3 | This is what we're evaluating |
| Editorial database | PostgreSQL 16 | Payload's store; run in Docker locally |

**Your choice — the importer.** The importer is a standalone program that reads ONIX and calls the Emporix API. Pick a language you can be productive in: Node.js/TypeScript, Java, Python, Go — all fine. Node/TypeScript has one practical advantage here: you're already in that ecosystem for Payload, so it's one less context to switch between. But it's your call.

Two conditions:
1. Decide by the **end of week 1**, and write two paragraphs on why.
2. Both of you must be able to work in it.

**Note on Payload:** Payload 3 is a Next.js application and requires React. Week 1 has room for ramp-up — use it, and tell us early if you need pointers.

## 6. How the work splits

You have 20 hours each per week. That is enough for this project, but only if you work in parallel rather than both on the same thing.

From week 4 onwards:

- **Student A** owns the Emporix integration: the importer, the ONIX mapping, and the storefront's data calls to Emporix.
- **Student B** owns Payload: collections, admin configuration, the editorial overlay, and the storefront's presentation.

Weeks 1–3 you work together. Getting authenticated against Emporix and agreeing how a book maps from ONIX into Emporix are shared decisions, and the most important ones in the project.

**You review each other's pull requests.** Every one. You will not write the other half, but you will read it, and by week 8 you should each be able to explain the whole system.

## 7. What you're building

### 7.1 The importer
Reads the ONIX files, extracts the fields in the appendix, and creates the corresponding products, prices, and catalog entries in Emporix through its API. Must be re-runnable: running it twice must not create duplicates — use the ISBN as the stable identifier. Must not crash on an incomplete record — log it and continue.

### 7.2 Payload
- Editorial collections: pages, banners, curated lists.
- The book overlay collection, keyed by ISBN.
- The admin configured so a non-technical person could actually use it. This is part of what we're evaluating.

### 7.3 The storefront (Payload's `(frontend)`)
- **Book list** — reads products from Emporix, with category filtering and pagination.
- **Book detail** — Emporix product data plus the Payload editorial overlay for that ISBN.
- **Cart** — using Emporix's cart API.
- **Checkout** — customer details, order summary, order placed through Emporix.
- **Confirmation page** — order reference and summary.
- **At least one editorial page** built entirely from Payload (e.g. a "Staff picks" landing page that lists ISBNs from Payload and pulls live prices from Emporix).

## 8. Cart and checkout — scope

This is where projects like this usually explode. Read this section twice.

**Use Emporix's cart and checkout.** You are not building cart logic or order storage yourself — Emporix has both. Your job is to call them correctly from the storefront and handle the responses.

**The important lesson is the same as it would be in any shop, just relocated:** the price and the total are decided by the commerce backend, never by the browser. In this project that backend is Emporix. The storefront sends what the customer *wants* (this ISBN, this quantity); Emporix returns what things *cost*. The storefront displays that — it never computes or trusts its own total. A shop that lets the browser decide the price is a shop that lets customers set their own prices.

**Payment:** use whatever test/mock payment path the tenant has configured. Do not integrate a real payment provider. If the tenant already has a test payment method, use it; if not, the order can complete at the "payment pending" state. Confirm with your mentor which applies before building the checkout's final step.

**Orders live in Emporix.** Payload never sees an order.

## 9. Out of scope

Explicitly not in this project. If you find yourself building one of these, stop and ask:

- A commerce backend of your own — Emporix is the backend
- Real payment processing
- Customer accounts and login beyond what the POC demo needs
- Full-text search tuning — basic category filtering is enough
- Shipping, tax, discount codes, promotions (Emporix can do these; they are out of scope for the POC)
- Email notifications
- Performance optimisation
- A custom design system — Payload defaults plus Tailwind
- Automated tests, beyond a handful on the importer's parsing logic

Scope creep is the most common way projects like this fail. When in doubt, build less.

## 10. Milestones

Each week ends with a demo. A rough, half-working demo is fine — showing us something broken early is far better than showing us nothing until week 8.

| Week | Goal |
|---|---|
| **1** | Local setup done: Payload running with Postgres in Docker, and **one successful authenticated call to the Emporix tenant** (e.g. list catalogs). Importer language chosen. React ramp-up. |
| **2** | **Mapping agreed.** You've read the ONIX files and Emporix's product model, and can explain how one maps to the other. First book created in Emporix by hand or script. |
| **3** | **Importer works.** All files import into Emporix cleanly, re-runnable, incomplete records logged not crashed. |
| **4** | **Work splits.** Payload collections defined, overlay keyed by ISBN. Storefront reads its first product list from Emporix. |
| **5** | **Storefront reads.** Book list and detail page, composing Emporix + Payload. Ugly is fine. |
| **6** | **Cart and checkout.** Full flow through Emporix: add → cart → checkout → order → confirmation. This is the big one. |
| **7** | **Polish.** Presentable, one editorial page, README, fix what's broken. |
| **8** | **Deploy and present.** Deployment target TBC. |

Week 6 is the highest-risk week and it does not compress. If weeks 1–5 slip, we cut something else rather than squeezing checkout. That decision is easy in week 4 and painful in week 7 — so tell us early.

## 11. How we work

- **Git from day one.** One repository, feature branches, small commits with real messages. Not one commit called "final" in week 8.
- **Daily standup**, 30 minutes maximum. What you did, what's next, what's blocking you. It is not a status report to management — it's the moment to say "I don't understand this" while it still costs half a day instead of a week.
- **Ask early.** If you've been stuck on the same thing for more than half a day, ask. There is no prize for suffering in silence — and this is genuinely the most common mistake at your stage. It costs weeks. Emporix authentication in week 1 is the most likely first place this bites; don't lose two days to it in silence.
- **Keep a running note** on both Payload and Emporix: anything that confused you, took too long, or seemed badly designed. This is one of our deliverables, and your unfiltered impression is worth more than a polished one.
- **README as you go.** Someone else should be able to run your project from a clean machine using it.

## 12. Definition of done

- [ ] `docker compose up` plus documented commands runs the storefront locally against Emporix
- [ ] The importer loads the ONIX files into Emporix without manual intervention and without crashing, and is re-runnable
- [ ] Books are browsable: list, category filter, detail page — product data from Emporix
- [ ] The detail page shows editorial content from Payload when it exists, and works when it doesn't
- [ ] A visitor can add books to a cart, check out, and receive an order confirmation — through Emporix
- [ ] At least one page built entirely from Payload content
- [ ] The Payload admin is usable by a non-technical person
- [ ] README: setup, architecture, known limitations
- [ ] A short write-up on Payload CMS and Emporix: what worked, what didn't, what you'd do differently
- [ ] A 20-minute presentation of what you built and what you learned

## 13. A note on expectations

This project is deliberately larger than what you have probably done before. That is intentional, and it means some things are guaranteed to happen.

You will get stuck. You will spend a day fighting Emporix authentication. You will build something in week 3 and realise in week 5 it was wrong. You will read documentation that assumes knowledge you don't have. You will look at an ONIX file and feel it was designed to make you unhappy.

None of this means the project is going badly. It is what the project *is*. Every working system you have ever used was built by people going through exactly this, and the difference between them and you is practice, not talent.

What we're looking for is not a flawless result. It's whether you can make decisions with incomplete information, recover when they turn out to be wrong, and say honestly where you are.

---

# Appendix: Working with ONIX

ONIX 3.0 is large. The full specification has hundreds of elements, deep nesting, and external code lists. **You are not expected to support all of it, and you should not try.** Extract what maps onto an Emporix product, and ignore the rest.

## Fields to extract

| Field | Where it lives in ONIX | Maps to in Emporix |
|---|---|---|
| ISBN-13 | `ProductIdentifier` (type 15) | product `code` / identifier |
| Title, subtitle | `DescriptiveDetail / TitleDetail` | product name |
| Contributors + role | `DescriptiveDetail / Contributor` | product attributes |
| Language | `DescriptiveDetail / Language` | product attribute |
| Product form | `DescriptiveDetail / ProductForm` | product attribute (hardback/paperback) |
| Subject / category | `DescriptiveDetail / Subject` | category assignment |
| Description | `CollateralDetail / TextContent` | product description |
| Cover image URL | `CollateralDetail / SupportingResource` | product media |
| Publisher | `PublishingDetail / Publisher` | product attribute |
| Publication date | `PublishingDetail / PublishingDate` | product attribute |
| Price + currency | `ProductSupply / SupplyDetail / Price` | Emporix price |
| Availability | `ProductSupply / SupplyDetail / ProductAvailability` | stock / availability |

The mapping is the interesting part. ONIX and Emporix were designed by different people for different reasons; where they don't line up cleanly is where you'll make decisions. Write those decisions down.

## A representative record

**This is an illustrative example, not taken from your actual files.** Use it to get oriented; check the real files before trusting any detail.

```xml
<ONIXMessage release="3.0" xmlns="http://ns.editeur.org/onix/3.0/reference">
  <Header>
    <Sender><SenderName>Example Distributor</SenderName></Sender>
    <SentDateTime>20260715</SentDateTime>
  </Header>

  <Product>
    <RecordReference>EX-0001</RecordReference>
    <NotificationType>03</NotificationType>

    <ProductIdentifier>
      <ProductIDType>15</ProductIDType>          <!-- 15 = ISBN-13 -->
      <IDValue>9783161484100</IDValue>
    </ProductIdentifier>

    <DescriptiveDetail>
      <ProductComposition>00</ProductComposition>
      <ProductForm>BC</ProductForm>              <!-- List 150: BC = Paperback -->

      <TitleDetail>
        <TitleType>01</TitleType>
        <TitleElement>
          <TitleElementLevel>01</TitleElementLevel>
          <TitleText>Die Verwandlung</TitleText>
          <Subtitle>Eine Erzählung</Subtitle>
        </TitleElement>
      </TitleDetail>

      <Contributor>
        <SequenceNumber>1</SequenceNumber>
        <ContributorRole>A01</ContributorRole>   <!-- List 17: A01 = Author -->
        <PersonName>Franz Kafka</PersonName>
      </Contributor>

      <Language>
        <LanguageRole>01</LanguageRole>
        <LanguageCode>ger</LanguageCode>          <!-- ISO 639-2/B -->
      </Language>

      <Subject>
        <SubjectSchemeIdentifier>93</SubjectSchemeIdentifier>  <!-- Thema -->
        <SubjectCode>FBA</SubjectCode>
      </Subject>
    </DescriptiveDetail>

    <CollateralDetail>
      <TextContent>
        <TextType>03</TextType>                   <!-- 03 = Description -->
        <ContentAudience>00</ContentAudience>
        <Text textformat="05">&lt;p&gt;Als Gregor Samsa eines Morgens...&lt;/p&gt;</Text>
      </TextContent>
      <SupportingResource>
        <ResourceContentType>01</ResourceContentType>  <!-- 01 = Front cover -->
        <ResourceMode>03</ResourceMode>
        <ResourceVersion>
          <ResourceForm>02</ResourceForm>
          <ResourceLink>https://example.com/covers/9783161484100.jpg</ResourceLink>
        </ResourceVersion>
      </SupportingResource>
    </CollateralDetail>

    <PublishingDetail>
      <Publisher>
        <PublishingRole>01</PublishingRole>
        <PublisherName>Example Verlag AG</PublisherName>
      </Publisher>
      <PublishingStatus>04</PublishingStatus>     <!-- 04 = Active -->
      <PublishingDate>
        <PublishingDateRole>01</PublishingDateRole>
        <Date dateformat="00">20250915</Date>      <!-- YYYYMMDD -->
      </PublishingDate>
    </PublishingDetail>

    <ProductSupply>
      <SupplyDetail>
        <ProductAvailability>21</ProductAvailability>  <!-- 21 = In stock -->
        <Price>
          <PriceType>02</PriceType>               <!-- 02 = RRP incl. tax -->
          <PriceAmount>18.90</PriceAmount>
          <CurrencyCode>CHF</CurrencyCode>
        </Price>
      </SupplyDetail>
    </ProductSupply>
  </Product>

</ONIXMessage>
```

## Code lists

Almost nothing above is human-readable. `A01`, `BC`, `21`, `02` are codes, and their meanings live in **EDItEUR's code lists**, published separately from your files. You'll need a handful:

| List | Codes | Example |
|---|---|---|
| 5 | Product identifier type | 15 = ISBN-13 |
| 17 | Contributor role | A01 = author, B06 = translator |
| 58 | Price type | 01 = RRP excl. tax, 02 = RRP incl. tax |
| 64 | Publishing status | 04 = active |
| 65 | Product availability | 21 = in stock |
| 150 | Product form | BB = hardback, BC = paperback |

Don't import the full lists. Hardcode the handful of values that actually appear in your files — but put them somewhere obvious and named, not scattered as magic strings through your parser.

## Three things that will catch you out

**1. ONIX has two tag styles.** The example uses *reference tags* (`<ProductIdentifier>`). There's also a *short tag* variant (`<productidentifier>`, or codes like `<b244>`). Check which your files use before writing any parsing code — a five-minute check that saves a day.

**2. The namespace.** Note `xmlns="http://ns.editeur.org/onix/3.0/reference"` on the root. If your XPath returns nothing despite the element clearly being there, this is almost always why.

**3. There can be several prices.** Different types, currencies, sometimes countries. Pick one rule — e.g. `PriceType` 02 in CHF — write it down as an explicit decision, and apply it consistently. The first price in the file is not the same one in every record.

## Where to start

Before writing any parsing code, pick three records that look different from each other and fill in the field table above for each, by hand, in a text file. An hour or two, and it's the cheapest way to find the things that bite in week 5: the missing field, the second price, the unexpected contributor role. You cannot map data you haven't looked at.
