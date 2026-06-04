// frontend/src/components/analytics/PhylogeneticTree.tsx

import { useEffect, useState } from "react";

interface TreeNodeData {
  id: string;
  children: TreeNodeData[];
}

function TreeNode({
  node,
  depth = 0,
}: {
  node: TreeNodeData;
  depth?: number;
}) {
  const [expanded, setExpanded] =
    useState(depth < 2);

  return (
    <div className="ml-2">
      <div
        className="
        flex
        cursor-pointer
        items-center
        gap-2
        rounded
        px-2
        py-1
        hover:bg-slate-800
        "
        onClick={() =>
          setExpanded(!expanded)
        }
      >
        {node.children.length > 0 ? (
          <span
            className="
            text-cyan-400
            "
          >
            {expanded ? "▼" : "▶"}
          </span>
        ) : (
          <span
            className="
            w-4
            text-slate-600
            "
          >
            •
          </span>
        )}

        <span
          className="
          font-mono
          text-xs
          text-slate-300
          "
        >
          {node.id.slice(0, 8)}
        </span>

        <span
          className="
          rounded
          bg-slate-700
          px-2
          py-0.5
          text-[10px]
          text-slate-200
          "
        >
          {node.children.length}
        </span>
      </div>

      {expanded &&
        node.children.length > 0 && (
          <div
            className="
            ml-4
            border-l
            border-slate-700
            pl-2
            "
          >
            {node.children.map(
              (child) => (
                <TreeNode
                  key={child.id}
                  node={child}
                  depth={
                    depth + 1
                  }
                />
              ),
            )}
          </div>
        )}
    </div>
  );
}

export default function PhylogeneticTree() {
  const [trees, setTrees] =
    useState<TreeNodeData[]>(
      [],
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const load = async () => {

      try {

        const response =
          await fetch(
            "http://localhost:8000/api/lineage/tree",
          );

        const text =
          await response.text();

        const data =
          JSON.parse(text);

        setTrees(data);

      } catch (error) {

        console.error(
          "Failed to load phylogenetic tree",
          error,
        );

      } finally {

        setLoading(false);

      }

    };

    load();
  }, []);

  if (loading) {
    return (
      <div
        className="
        rounded-xl
        border
        border-slate-800
        bg-slate-900
        p-4
        "
      >
        Loading tree...
      </div>
    );
  }

  return (
    <div
      className="
      rounded-xl
      border
      border-slate-800
      bg-slate-900
      p-4
      "
    >
      <h3
        className="
        mb-4
        text-lg
        font-semibold
        text-cyan-400
        "
      >
        Phylogenetic Tree
      </h3>

      {trees.length === 0 ? (
        <div
          className="
          text-sm
          text-slate-400
          "
        >
          No lineage data available
        </div>
      ) : (
        <div
          className="
          max-h-212
          overflow-auto
          "
        >
          {trees.map((tree) => (
            <TreeNode
              key={tree.id}
              node={tree}
            />
          ))}
        </div>
      )}
    </div>
  );
}