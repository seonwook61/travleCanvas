import { ArrowLeft, LogIn } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function signInWithGoogle() {
  "use server";

  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://localhost:3000";
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error || !data.url) {
    redirect("/auth/sign-in?error=oauth_start_failed");
  }

  redirect(data.url);
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const error =
    typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : null;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#eef6ff_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center justify-center">
        <Card className="w-full max-w-2xl rounded-[32px] border border-white/70 bg-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur">
          <CardHeader className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft className="size-4" />
              홈으로 돌아가기
            </Link>
            <Badge className="bg-emerald-100 text-emerald-700">저장 시 로그인</Badge>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                나만의 일본 여행 캔버스를 저장하세요
              </h1>
              <p className="text-base leading-7 text-slate-600">
                장소 라이브러리, trip 생성, 읽기 전용 공유 링크는 로그인 이후에만 사용할 수
                있습니다. MVP에서는 Google OAuth만 지원합니다.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={signInWithGoogle}>
              <Button type="submit" className="w-full rounded-2xl py-6 text-base">
                <LogIn className="mr-2 size-4" />
                Google로 계속하기
              </Button>
            </form>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                로그인 시작 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
              </div>
            ) : null}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
              기본 정책: 검색과 탐색은 로그인 없이 가능하지만, 저장한 장소와 여행 상세 공유는
              계정에 안전하게 보관됩니다.
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
