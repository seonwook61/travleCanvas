import { expect, test } from "@playwright/test";

test("renders the trip creation shell for planning a dated itinerary", async ({ page }) => {
  await page.goto("/trips/new");

  await expect(page.getByRole("heading", { name: "새 trip 만들기" })).toBeVisible();
  await expect(page.getByLabel("trip 제목")).toBeVisible();
  await expect(page.getByLabel("시작일")).toBeVisible();
  await expect(page.getByLabel("종료일")).toBeVisible();
  await expect(page.getByText("saved places에서 가져온 후보", { exact: true })).toBeVisible();
});
