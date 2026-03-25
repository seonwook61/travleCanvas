import { expect, test } from "@playwright/test";

test("renders the public read-only shared trip page", async ({ page }) => {
  await page.goto("/share/demo");

  await expect(page.getByRole("heading", { name: "교토 & 오사카 봄 여행" })).toBeVisible();
  await expect(page.getByText("읽기 전용 여행 공유", { exact: true })).toBeVisible();
  await expect(page.getByText("저장한 장소 하이라이트", { exact: true })).toBeVisible();
  await expect(page.getByText("루트 보드", { exact: true })).toBeVisible();
});
