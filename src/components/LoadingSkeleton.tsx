export const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-xl border h-32 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="h-8 bg-gray-200 rounded w-2/3"></div>
  </div>
);

export const SkeletonTable = () => (
  <div className="bg-white p-6 rounded-xl border h-[400px] animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-10 bg-gray-100 rounded mb-4"></div>
    ))}
  </div>
);