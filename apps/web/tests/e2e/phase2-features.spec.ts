import { test, expect } from "@playwright/test";

test.describe("Phase 2 Features", () => {
  test("search modal opens and finds products", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Search").first().click();
    await expect(page.getByPlaceholder("Search brands, products, materials...")).toBeVisible();
    await page.fill('input[placeholder="Search brands, products, materials..."]', "gucci");
    await expect(page.locator("[href='/brands/gucci']").first()).toBeVisible();
    await page.keyboard.press("Escape");
  });

  test("login page shows demo accounts", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Welcome" })).toBeVisible();
    await expect(page.getByText("Demo Accounts")).toBeVisible();
    await expect(page.getByText("Soyeon Kim").first()).toBeVisible();
  });

  test("account sub-pages load", async ({ page }) => {
    await page.goto("/account/orders");
    await expect(page.getByText("Order History")).toBeVisible();

    await page.goto("/account/addresses");
    await expect(page.getByRole("heading", { name: "Addresses" })).toBeVisible();

    await page.goto("/account/preferences");
    await expect(page.getByRole("heading", { name: "Preferences" })).toBeVisible();

    await page.goto("/account/size-profile");
    await expect(page.getByRole("heading", { name: "Size Profile" })).toBeVisible();
  });

  test("collections page loads", async ({ page }) => {
    await page.goto("/collections");
    await expect(page.getByRole("heading", { name: "Collections" })).toBeVisible();
    await expect(page.getByText("The Art of Quiet Luxury")).toBeVisible();
  });

  test("admin orders page", async ({ page }) => {
    await page.goto("/dashboard/orders");
    await expect(page.getByRole("heading", { name: /Orders/ })).toBeVisible();
    await expect(page.getByText("Revenue:")).toBeVisible();
  });

  test("admin churn detection", async ({ page }) => {
    await page.goto("/dashboard/churn");
    await expect(page.getByRole("heading", { name: "Churn Detection" })).toBeVisible();
    await expect(page.getByText("Critical Risk")).toBeVisible();
    await expect(page.getByText("Eunji Hwang")).toBeVisible();
  });

  test("admin settings page", async ({ page }) => {
    await page.goto("/dashboard/settings");
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
    await expect(page.getByText("VIP Tier Thresholds")).toBeVisible();
    await expect(page.getByText("AI Agent Configuration")).toBeVisible();
  });

  test("admin product AI pipeline modal", async ({ page }) => {
    await page.goto("/dashboard/products");
    await page.getByRole("button", { name: "+ New Product (AI Pipeline)" }).click();
    await expect(page.getByText("New Product — AI Pipeline")).toBeVisible();
  });

  test("notification bell dropdown", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Notifications").first().click();
    await expect(page.getByText("Mark all read")).toBeVisible();
  });
});
