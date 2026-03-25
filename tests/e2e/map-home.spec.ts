import { expect, test } from "@playwright/test";

test("renders the trip-canvas home shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "trip-canvas" })).toBeVisible();
  await expect(page.getByPlaceholder("도쿄, 오사카, 교토 장소 검색")).toBeVisible();
  await expect(page.getByText("저장한 장소", { exact: true })).toBeVisible();
  await expect(page.getByText("지도 캔버스", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "도쿄" })).toBeVisible();
});
