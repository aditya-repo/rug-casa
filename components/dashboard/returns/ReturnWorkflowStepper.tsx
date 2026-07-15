"use client";

import { formatReturnStatus, getReturnWorkflowSteps, type ReturnStatus, type ReturnType } from "@/lib/api/returns";

type ReturnWorkflowStepperProps = {
  type: ReturnType;
  currentStatus: ReturnStatus;
};

export function ReturnWorkflowStepper({ type, currentStatus }: ReturnWorkflowStepperProps) {
  const steps = getReturnWorkflowSteps(type);
  const currentIndex = steps.indexOf(currentStatus);
  const isRejected = currentStatus === "REJECTED" || currentStatus === "CANCELLED";

  if (isRejected) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
        Request {formatReturnStatus(currentStatus)}
      </p>
    );
  }

  return (
    <ol className="flex flex-wrap items-center gap-2 text-sm">
      {steps.map((step, index) => {
        const isComplete = currentIndex > index;
        const isCurrent = currentIndex === index;

        return (
          <li key={step} className="flex items-center gap-2">
            {index > 0 ? (
              <span
                className={`hidden h-px w-4 sm:block ${isComplete || isCurrent ? "bg-rc-accent" : "bg-neutral-200"}`}
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
              {formatReturnStatus(step)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
