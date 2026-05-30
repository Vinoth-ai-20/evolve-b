import type { ReactNode } from "react";

import Card from "./Card";

interface PanelProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function Panel({
  title,
  children,
  actions,
}: PanelProps) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">

        <h2
          className="
          text-lg
          font-semibold
          text-white
          "
        >
          {title}
        </h2>

        {actions}
      </div>

      {children}
    </Card>
  );
}