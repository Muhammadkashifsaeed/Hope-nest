export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center bg-[#F8FAFC] px-4 py-24 dark:bg-[#041711]">
      <div className="flex flex-col items-center gap-3.5 text-center">
        <div
          className="h-9 w-9 animate-spin rounded-full border-2 border-emerald-200 border-t-[#059669] dark:border-emerald-900 dark:border-t-emerald-400"
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-slate-600 dark:text-emerald-100/75">
          Loading HopeNest...
        </p>
      </div>
    </div>
  );
}
