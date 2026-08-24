export default function AdminLoading() {
  return (
    <div className="space-y-5" role="status" aria-label="正在加载管理后台">
      <div className="h-56 animate-pulse rounded-[18px] border border-border bg-card" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-44 animate-pulse rounded-[16px] border border-border bg-card" />)}
      </div>
      <div className="h-80 animate-pulse rounded-[18px] border border-border bg-card" />
      <span className="sr-only">加载中</span>
    </div>
  );
}
