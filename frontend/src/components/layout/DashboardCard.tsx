interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function DashboardCard({
  title,
  subtitle,
  children,
  className = "",
}: DashboardCardProps) {
  return (
    <div
      className={`         rounded-2xl
        border
        border-slate-800
        bg-slate-900/80
        backdrop-blur
        shadow-lg
        flex
        flex-col
        ${className}
      `}
    > <div className="border-b border-slate-800 px-5 py-4"> <h3 className="text-lg font-semibold text-slate-100">
      {title} </h3>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="p-5 flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
