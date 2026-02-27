export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      {/* Kamu bisa pakai Spinner atau Skeleton di sini */}
      <div className="relative">
        <div className="size-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
      <p className="text-slate-500 font-medium animate-pulse">Data prepare, please Wait...</p>
    </div>
  );
}