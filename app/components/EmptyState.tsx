import type { ReactNode } from "react";

interface EmptyStateProps {
  /** Icon or illustration to show at the top. */
  icon?: ReactNode;
  heading: string;
  /** Optional supporting text shown below the heading. */
  description?: string;
  /** Optional action element (e.g. a button or link). */
  action?: ReactNode;
}

/**
 * Generic empty state for list pages.
 * Renders a centred block with an optional icon, heading, description, and
 * action slot.
 */
export default function EmptyState({
  icon,
  heading,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="mb-4 text-gray-300" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="text-base font-semibold text-gray-900">{heading}</p>
      {description && (
        <p className="mt-1 text-sm text-gray-500 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
