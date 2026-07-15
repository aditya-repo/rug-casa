"use client";

import { formatOrderStatus, ORDER_WORKFLOW, type OrderStatus } from "@/lib/api/orders";

type OrderWorkflowStepperProps = {
  currentStatus: OrderStatus;
};

export function OrderWorkflowStepper({ currentStatus }: OrderWorkflowStepperProps) {
  const currentIndex = ORDER_WORKFLOW.indexOf(currentStatus);

  return (
    <ol className="flex flex-wrap items-center gap-2 text-sm">
      {ORDER_WORKFLOW.map((step, index) => {
        const isComplete = currentIndex > index;
        const isCurrent = currentIndex === index;
        const isUpcoming = currentIndex < index;

        return (
          <li key={step} className="flex items-center gap-2">
            {index > 0 ? (
              <span
                className={`hidden h-px w-6 sm:block ${isComplete || isCurrent ? "bg-rc-accent" : "bg-neutral-200"}`}
                aria-hidden
              />
            ) : null}
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                isCurrent
                  ? "bg-rc-navy text-white"
                  : isComplete
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-neutral-100 text-neutral-500"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                  isCurrent
                    ? "bg-white/20"
                    : isComplete
                      ? "bg-emerald-600 text-white"
                      : "bg-neutral-200 text-neutral-500"
                }`}
              >
                {isComplete ? "✓" : index + 1}
              </span>
              {formatOrderStatus(step)}
            </span>
            {isUpcoming && index === ORDER_WORKFLOW.length - 1 ? null : null}
          </li>
        );
      })}
    </ol>
  );
}
