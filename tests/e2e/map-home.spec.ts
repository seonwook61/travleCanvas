import { expect, test } from "@playwright/test";

test("renders the trip-canvas home shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "trip-canvas" })).toBeVisible();
  await expect(page.getByPlaceholder("도쿄, 오사카, 교토 장소 검색")).toBeVisible();
  await expect(page.getByText("저장한 장소", { exact: true })).toBeVisible();
  await expect(page.getByText("지도 캔버스", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "도쿄" }).first()).toBeVisible();
  await expect(page.getByText("저장 후보", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "로그인 후 저장" }).first()).toBeVisible();
});

test("routes unauthenticated users to sign in when saving a place", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "로그인 후 저장" }).first().click();

  await expect(page).toHaveURL(/\/auth\/sign-in\?next=/);
  await expect(page.getByRole("heading", { name: "나만의 일본 여행 캔버스를 저장하세요" })).toBeVisible();
});
