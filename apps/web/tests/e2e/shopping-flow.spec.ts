import { test, expect } from "@playwright/test";

test.describe("Luxury Shopping Flow", () => {
  test("homepage loads with luxury branding", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("The Art of")).toBeVisible();
    await expect(page.getByText("Quiet Luxury")).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore the Collection" })).toBeVisible();

    // Verify Maison brand
    await expect(page.getByText("Maison").first()).toBeVisible();

    // Curated edit section
    await expect(page.getByText("Defining Pieces").first()).toBeVisible();
  });

  test("browse products page", async ({ page }) => {
    await page.goto("/products");

    await expect(page.getByText("GG Marmont Small Shoulder Bag")).toBeVisible();
    await expect(page.getByText("Cassette Bag in Intreccio Leather")).toBeVisible();
    await expect(page.getByText("5 pieces")).toBeVisible();
  });

  test("view product detail", async ({ page }) => {
    await page.goto("/products/gucci-gg-marmont-small-shoulder-bag");

    // Product info
    await expect(page.locator("main h1").first()).toContainText("GG Marmont");
    // Price visible (in product detail section, not sticky CTA)
    await expect(page.locator(".text-xl").getByText("$2,350")).toBeVisible();

    // Editorial section
    await expect(page.getByText("The Story")).toBeVisible();

    // Materials accordion
    await expect(page.getByText("Matelasse chevron calfskin").first()).toBeVisible();

    // Reviews section
    await expect(page.getByText("Client Reviews")).toBeVisible();

    // Related products (may not appear if brand has only 1 product)
    // await expect(page.getByText("You May Also Like")).toBeVisible();
  });

  test("add to cart and checkout", async ({ page }) => {
    await page.goto("/products/gucci-gg-marmont-small-shoulder-bag");

    // Add to bag
    await page.getByRole("button", { name: "Add to Bag" }).click();
    await expect(page.getByRole("button", { name: "Added to Bag" })).toBeVisible();

    // Navigate to cart
    await page.goto("/cart");

    // Wait for hydration
    await page.waitForTimeout(500);
    await expect(page.getByText("GG Marmont Small Shoulder Bag").first()).toBeVisible();

    // Proceed to checkout
    await page.getByRole("link", { name: "Proceed to Checkout" }).click();
    await expect(page).toHaveURL("/checkout");

    // Shipping step — fill required fields
    await expect(page.getByText("Shipping Address")).toBeVisible();
    const inputs = page.locator("input[type='text']");
    await inputs.nth(0).fill("Test");      // firstName
    await inputs.nth(1).fill("User");      // lastName
    await inputs.nth(2).fill("123 Test St"); // line1
    await inputs.nth(3).fill("Seoul");     // city
    await inputs.nth(4).fill("06241");     // postalCode
    await inputs.nth(5).fill("010-0000"); // phone
    await page.getByRole("button", { name: "Continue to Payment" }).click();

    // Payment step
    await expect(page.getByText("Credit Card").first()).toBeVisible();

    // Place order
    await page.getByRole("button", { name: /Place Order/ }).click();

    // Confirmation
    await expect(page.getByText("Thank You")).toBeVisible();
    await expect(page.getByText("has been placed")).toBeVisible();
  });

  test("wishlist toggle", async ({ page }) => {
    await page.goto("/products/celine-triomphe-shoulder-bag-shiny-calfskin");

    await page.getByRole("button", { name: "Add to Wishlist" }).click();
    await expect(page.getByRole("button", { name: "In Wishlist" })).toBeVisible();

    await page.getByRole("button", { name: "In Wishlist" }).click();
    await expect(page.getByRole("button", { name: "Add to Wishlist" })).toBeVisible();
  });

  test("brand page shows story", async ({ page }) => {
    await page.goto("/brands/bottega-veneta");

    await expect(page.locator("main h1")).toContainText("Bottega Veneta");
    await expect(page.getByText("When Your Own Initials Are Enough")).toBeVisible();
    await expect(page.getByText(/1966/).first()).toBeVisible();
    await expect(page.getByText("Invisible luxury").first()).toBeVisible();
  });

  test("journal page", async ({ page }) => {
    await page.goto("/journal");

    await expect(page.getByText("Stories of Craft & Culture")).toBeVisible();
    await expect(page.getByText("Featured")).toBeVisible();
  });

  test("admin dashboard", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText("AI Pipeline Queue")).toBeVisible();
    await expect(page.getByText("Pending Reviews").first()).toBeVisible();
  });

  test("admin reviews with AI analysis", async ({ page }) => {
    await page.goto("/dashboard/reviews");

    await expect(page.getByText("Soyeon K.")).toBeVisible();
    await expect(page.getByText("mixed").first()).toBeVisible();
    await expect(page.getByText("product quality").first()).toBeVisible();
    await expect(page.getByText("review-concierge").first()).toBeVisible();
  });
});
