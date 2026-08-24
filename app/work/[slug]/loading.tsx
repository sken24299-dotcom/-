export default function WorkLoading() {
  return (
    <main className="min-h-screen bg-background px-5 pb-20 pt-32 text-foreground" role="status" aria-label="正在加载作品案例">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="h-3 w-40 animate-pulse rounded-full bg-muted" />
        <div className="mt-10 h-24 max-w-4xl animate-pulse rounded-[18px] bg-muted sm:h-32" />
        <div className="mt-7 h-20 max-w-2xl animate-pulse rounded-[16px] bg-muted" />
        <div className="mt-14 aspect-video animate-pulse rounded-[18px] border border-border bg-card" />
      </div>
      <span className="sr-only">加载中</span>
    </main>
  );
}
