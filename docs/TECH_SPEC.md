# Tech Spec: Highend Fashion Mall

## 1. Database Schema (Prisma)

### 1.1 Core Models

```prisma
// ─── Brand ───
model Brand {
  id              String   @id @default(cuid())
  name            String   @unique            // Canonical name: "Gucci"
  slug            String   @unique            // URL: "gucci"
  tier            BrandTier                    // HERITAGE / MODERN / CONTEMPORARY / STREETLUXURY
  description     String?
  story           Json?                        // AI-generated brand narrative
  logoUrl         String?
  websiteUrl      String?
  voiceGuidelines Json?                        // Brand-specific tone rules
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  products        Product[]
  collections     Collection[]
}

enum BrandTier {
  HERITAGE        // Hermes, Chanel, Louis Vuitton
  MODERN          // Bottega Veneta, The Row, Celine
  CONTEMPORARY    // Jacquemus, Khaite, Toteme
  STREETLUXURY    // Off-White, Fear of God, Amiri
}

// ─── Product ───
model Product {
  id              String        @id @default(cuid())
  sku             String        @unique
  brandId         String
  name            String
  slug            String        @unique
  category        ProductCategory
  subcategory     String?
  priceTier       PriceTier                    // ACCESSIBLE / CORE / ULTRA

  // Pricing (multi-currency)
  prices          ProductPrice[]

  // AI-generated content
  titleDisplay    String                       // "GG Marmont Small Shoulder Bag"
  titleSeo        String                       // "Gucci GG Marmont..."
  descriptionHero String                       // Max 160 chars
  descriptionFull String                       // 200-400 words editorial
  specifications  Json                         // Structured specs
  tags            String[]
  seoKeywords     String[]
  categoryPath    String                       // "Bags > Shoulder Bags > Designer"

  // Materials & Details
  materials       Json                         // { primary, secondary, lining }
  sizing          Json                         // { available, sizeSystem }
  colorway        String?
  collection      String?                      // "FW26"

  // Images
  images          ProductImage[]

  // Status
  status          ProductStatus @default(DRAFT)
  aiListingId     String?                      // Reference to AI generation job
  qaScore         Float?                       // luxury-qa-guardian score
  publishedAt     DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  brand           Brand         @relation(fields: [brandId], references: [id])
  variants        ProductVariant[]
  reviews         Review[]
  orderItems      OrderItem[]
  wishlistItems   WishlistItem[]
  recommendations RecommendationItem[]

  @@index([brandId])
  @@index([category])
  @@index([status])
  @@index([priceTier])
}

enum ProductCategory {
  BAGS
  RTW             // Ready-to-Wear
  SHOES
  ACCESSORIES
  JEWELRY
  BEAUTY
}

enum PriceTier {
  ACCESSIBLE      // $100-$500
  CORE            // $500-$5,000
  ULTRA           // $5,000+
}

enum ProductStatus {
  DRAFT           // AI-generated, pending review
  PENDING_REVIEW  // QA passed, awaiting admin approval
  PUBLISHED       // Live on site
  ARCHIVED        // Removed from site
}

model ProductPrice {
  id          String   @id @default(cuid())
  productId   String
  currency    Currency
  amount      Decimal  @db.Decimal(12, 2)
  isDefault   Boolean  @default(false)

  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([productId, currency])
}

enum Currency {
  KRW
  USD
  EUR
  JPY
}

model ProductImage {
  id          String   @id @default(cuid())
  productId   String
  url         String
  altText     String?
  position    Int                              // Display order
  type        ImageType @default(PRODUCT)

  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
}

enum ImageType {
  PRODUCT         // Standard product shot
  DETAIL          // Close-up / material detail
  LIFESTYLE       // Styled / editorial
  MODEL           // On-model
}

model ProductVariant {
  id          String   @id @default(cuid())
  productId   String
  size        String                           // "IT 42" or "One Size"
  color       String?
  stock       Int      @default(0)
  sku         String   @unique

  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
}

// ─── Collection ───
model Collection {
  id          String   @id @default(cuid())
  brandId     String
  name        String                           // "Fall/Winter 2026"
  slug        String   @unique
  season      Season
  year        Int
  narrative   String?                          // AI-generated collection story
  heroImageUrl String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  brand       Brand    @relation(fields: [brandId], references: [id])

  @@index([brandId])
  @@index([season, year])
}

enum Season {
  SS            // Spring/Summer
  PF            // Pre-Fall
  FW            // Fall/Winter
  CR            // Resort/Cruise
  HC            // Haute Couture
}

// ─── Customer ───
model Customer {
  id              String       @id @default(cuid())
  email           String       @unique
  name            String?
  phone           String?
  tier            VipTier      @default(SILVER)
  annualSpend     Decimal      @default(0) @db.Decimal(12, 2)

  // Profile & Preferences
  styleDna        Json?                        // AI-analyzed style profile
  sizeProfile     Json?                        // { tops, bottoms, shoes }
  preferredBrands String[]
  preferredLang   String       @default("ko")

  // Auth
  authProvider    String?
  authProviderId  String?

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  lastActiveAt    DateTime?

  orders          Order[]
  reviews         Review[]
  wishlist        WishlistItem[]
  recommendations Recommendation[]
  addresses       Address[]
  campaignRecipients CampaignRecipient[]

  @@index([tier])
  @@index([email])
}

enum VipTier {
  PLATINUM        // $50,000+/year
  GOLD            // $15,000-$49,999/year
  SILVER          // $3,000-$14,999/year
  STANDARD        // < $3,000/year
}

// ─── Order ───
model Order {
  id              String       @id @default(cuid())
  orderNumber     String       @unique
  customerId      String
  status          OrderStatus  @default(PENDING)
  currency        Currency     @default(KRW)
  subtotal        Decimal      @db.Decimal(12, 2)
  shippingFee     Decimal      @default(0) @db.Decimal(12, 2)
  total           Decimal      @db.Decimal(12, 2)
  paymentMethod   String?
  paymentId       String?                      // PG transaction ID
  shippingAddress Json?
  trackingNumber  String?
  packagingType   PackagingType @default(STANDARD)
  notes           String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  customer        Customer     @relation(fields: [customerId], references: [id])
  items           OrderItem[]

  @@index([customerId])
  @@index([status])
}

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  RETURNED
}

enum PackagingType {
  STANDARD        // Standard luxury packaging
  GIFT            // Gift wrapping
  PREMIUM         // Premium unboxing experience
}

model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  productId   String
  variantSku  String?
  quantity    Int      @default(1)
  unitPrice   Decimal  @db.Decimal(12, 2)
  total       Decimal  @db.Decimal(12, 2)

  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product     Product  @relation(fields: [productId], references: [id])

  @@index([orderId])
}

// ─── Review ───
model Review {
  id              String       @id @default(cuid())
  customerId      String
  productId       String
  rating          Int                          // 1-5
  text            String
  status          ReviewStatus @default(PENDING)

  // AI Analysis
  sentimentScore  Float?                       // -1.0 to 1.0
  sentimentLabel  String?                      // positive/neutral/negative/mixed
  themes          Json?                        // [{ theme, sentiment, evidence }]
  urgency         String?                      // immediate/elevated/standard/low
  aiResponseDraft String?                      // AI-generated response
  aiResponseQa    Json?                        // QA guardian result
  publishedResponse String?                    // Final approved response

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  respondedAt     DateTime?

  customer        Customer     @relation(fields: [customerId], references: [id])
  product         Product      @relation(fields: [productId], references: [id])

  @@index([customerId])
  @@index([productId])
  @@index([status])
}

enum ReviewStatus {
  PENDING         // Awaiting AI analysis
  AI_ANALYZED     // AI response drafted
  APPROVED        // Response approved, published
  ESCALATED       // Sent to human team
}

// ─── Recommendation ───
model Recommendation {
  id              String       @id @default(cuid())
  customerId      String
  context         RecommendationContext
  title           String                       // "Curated for You: Quiet Luxury"
  narrative       String?                      // Editorial intro
  diversityScore  Float?
  noveltyScore    Float?
  expiresAt       DateTime
  createdAt       DateTime     @default(now())

  customer        Customer     @relation(fields: [customerId], references: [id])
  items           RecommendationItem[]

  @@index([customerId])
  @@index([expiresAt])
}

enum RecommendationContext {
  HOMEPAGE
  CATEGORY_BROWSE
  POST_PURCHASE
  CAMPAIGN
  SEASONAL
}

model RecommendationItem {
  id                String   @id @default(cuid())
  recommendationId  String
  productId         String
  position          Int
  matchReason       String
  stylingNote       String?
  confidence        Float
  type              String   @default("curated") // curated/cross_sell/discovery

  recommendation    Recommendation @relation(fields: [recommendationId], references: [id], onDelete: Cascade)
  product           Product        @relation(fields: [productId], references: [id])

  @@index([recommendationId])
}

// ─── Campaign ───
model Campaign {
  id              String         @id @default(cuid())
  name            String
  type            CampaignType
  objective       String
  status          CampaignStatus @default(DRAFT)
  content         Json                         // AI-generated campaign plan
  qaResult        Json?                        // QA guardian result
  budget          Decimal?       @db.Decimal(12, 2)
  startAt         DateTime?
  endAt           DateTime?
  earlyAccessAt   DateTime?                    // Platinum early access
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  recipients      CampaignRecipient[]

  @@index([status])
}

enum CampaignType {
  PRIVATE_SALE
  COLLECTION_LAUNCH
  EXCLUSIVE_EVENT
  BRAND_PARTNERSHIP
}

enum CampaignStatus {
  DRAFT
  AI_GENERATED
  APPROVED
  SCHEDULED
  ACTIVE
  COMPLETED
}

model CampaignRecipient {
  id          String   @id @default(cuid())
  campaignId  String
  customerId  String
  segment     VipTier
  sentAt      DateTime?
  openedAt    DateTime?
  clickedAt   DateTime?
  convertedAt DateTime?

  campaign    Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  customer    Customer @relation(fields: [customerId], references: [id])

  @@unique([campaignId, customerId])
  @@index([campaignId])
}

// ─── Supporting Models ───
model WishlistItem {
  id          String   @id @default(cuid())
  customerId  String
  productId   String
  createdAt   DateTime @default(now())

  customer    Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  product     Product  @relation(fields: [productId], references: [id])

  @@unique([customerId, productId])
}

model Address {
  id          String   @id @default(cuid())
  customerId  String
  label       String?                          // "Home", "Office"
  name        String
  phone       String
  line1       String
  line2       String?
  city        String
  state       String?
  postalCode  String
  country     String   @default("KR")
  isDefault   Boolean  @default(false)

  customer    Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)

  @@index([customerId])
}

// ─── AI Job Tracking ───
model AgentJob {
  id          String       @id @default(cuid())
  type        AgentJobType
  status      JobStatus    @default(QUEUED)
  input       Json                             // Raw input data
  output      Json?                            // Agent output
  qaResult    Json?                            // QA guardian result
  agentsUsed  String[]                         // Which agents were invoked
  error       String?
  startedAt   DateTime?
  completedAt DateTime?
  createdAt   DateTime     @default(now())

  @@index([type, status])
}

enum AgentJobType {
  PRODUCT_LISTING
  RECOMMENDATION
  CAMPAIGN_DESIGN
  REVIEW_RESPONSE
  BRAND_STORY
}

enum JobStatus {
  QUEUED
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
}
```

---

## 2. API Design (tRPC Routers)

### 2.1 Router Structure

```typescript
// server/routers/_app.ts
export const appRouter = router({
  product: productRouter,
  brand: brandRouter,
  collection: collectionRouter,
  customer: customerRouter,
  order: orderRouter,
  review: reviewRouter,
  recommendation: recommendationRouter,
  campaign: campaignRouter,
  agent: agentRouter,         // AI agent triggers
  admin: adminRouter,         // Admin-only operations
});
```

### 2.2 Key Endpoints

#### Product Router
```typescript
product.list         // GET    - Paginated product list with filters
product.getBySlug    // GET    - Single product by slug
product.search       // GET    - Full-text search with facets
product.create       // POST   - Create draft (triggers AI pipeline)
product.update       // PATCH  - Update product
product.publish      // POST   - Publish approved listing
product.archive      // POST   - Archive product
```

#### Customer Router
```typescript
customer.me              // GET    - Current customer profile
customer.updateProfile   // PATCH  - Update preferences, sizes
customer.getStyleDna     // GET    - AI-analyzed style profile
customer.wishlist.list   // GET    - Wishlist items
customer.wishlist.toggle // POST   - Add/remove wishlist item
customer.orders          // GET    - Order history
```

#### Recommendation Router
```typescript
recommendation.getForCustomer   // GET  - Get/generate personalized edit
recommendation.dismiss          // POST - Dismiss a recommendation
recommendation.trackClick       // POST - Track recommendation click
```

#### Agent Router (Admin only)
```typescript
agent.triggerProductListing   // POST - Trigger AI product listing pipeline
agent.triggerReviewResponse   // POST - Trigger AI review analysis
agent.triggerCampaignDesign   // POST - Trigger AI campaign design
agent.triggerBrandStory       // POST - Trigger AI brand story generation
agent.getJobStatus            // GET  - Check agent job status
agent.approveOutput           // POST - Approve AI-generated output
agent.rejectOutput            // POST - Reject with feedback
```

#### Campaign Router (Admin only)
```typescript
campaign.list         // GET    - List campaigns
campaign.create       // POST   - Create campaign brief (triggers AI)
campaign.approve      // POST   - Approve campaign plan
campaign.schedule     // POST   - Schedule for delivery
campaign.getMetrics   // GET    - Campaign performance metrics
```

---

## 3. Search Configuration

### 3.1 Elasticsearch Index Mapping

```json
{
  "settings": {
    "analysis": {
      "analyzer": {
        "korean": {
          "type": "custom",
          "tokenizer": "nori_tokenizer",
          "filter": ["lowercase", "nori_part_of_speech"]
        },
        "brand_autocomplete": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "edge_ngram_filter"]
        }
      },
      "filter": {
        "edge_ngram_filter": {
          "type": "edge_ngram",
          "min_gram": 2,
          "max_gram": 20
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "name":        { "type": "text", "analyzer": "korean" },
      "brand":       { "type": "keyword", "copy_to": "brand_suggest" },
      "brand_suggest": { "type": "text", "analyzer": "brand_autocomplete" },
      "category":    { "type": "keyword" },
      "subcategory": { "type": "keyword" },
      "priceTier":   { "type": "keyword" },
      "price_krw":   { "type": "float" },
      "tags":        { "type": "keyword" },
      "materials":   { "type": "text", "analyzer": "korean" },
      "collection":  { "type": "keyword" },
      "season":      { "type": "keyword" }
    }
  }
}
```

### 3.2 Facet Filters

| Facet | Type | Values |
|-------|------|--------|
| Brand | keyword | Dynamic from catalog |
| Category | keyword | BAGS, RTW, SHOES, ACCESSORIES, JEWELRY, BEAUTY |
| Price Tier | keyword | ACCESSIBLE, CORE, ULTRA |
| Size | keyword | Dynamic per product |
| Color | keyword | Dynamic per product |
| Season | keyword | SS, PF, FW, CR, HC |
| Material | keyword | Top 20 materials |

---

## 4. Background Job Definitions

### 4.1 Queue Configuration

```typescript
// BullMQ queues
const queues = {
  'agent:product-listing':   { concurrency: 3, timeout: 120_000 },
  'agent:review-response':   { concurrency: 5, timeout: 60_000 },
  'agent:recommendation':    { concurrency: 5, timeout: 30_000 },
  'agent:campaign':          { concurrency: 2, timeout: 120_000 },
  'agent:brand-story':       { concurrency: 2, timeout: 90_000 },
  'email:campaign':          { concurrency: 10, timeout: 30_000 },
  'analytics:tier-recalc':   { concurrency: 1, cron: '0 2 * * *' },  // Daily 2AM
  'cache:recommendation':    { concurrency: 5, timeout: 10_000 },
};
```

### 4.2 Job Handlers

| Queue | Trigger | Handler |
|-------|---------|---------|
| `agent:product-listing` | Admin uploads product data | Dispatch curator → creator → QA pipeline |
| `agent:review-response` | New review submitted | Dispatch review-concierge → QA |
| `agent:recommendation` | Customer login / cache miss | Dispatch profile-analyzer → recommender → QA |
| `agent:campaign` | Admin creates campaign brief | Dispatch analyzer → campaign-manager → QA |
| `analytics:tier-recalc` | Daily cron | Recalculate all customer VIP tiers based on annual spend |

---

## 5. Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
ELASTICSEARCH_URL="http://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
KAKAO_CLIENT_ID="..."
KAKAO_CLIENT_SECRET="..."

# Payment
TOSS_PAYMENTS_SECRET_KEY="..."
TOSS_PAYMENTS_CLIENT_KEY="..."
STRIPE_SECRET_KEY="..."
STRIPE_PUBLISHABLE_KEY="..."

# Storage
AWS_S3_BUCKET="..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_CLOUDFRONT_DOMAIN="..."

# AI
ANTHROPIC_API_KEY="..."

# Email
RESEND_API_KEY="..."

# Analytics
POSTHOG_KEY="..."
SENTRY_DSN="..."
```
