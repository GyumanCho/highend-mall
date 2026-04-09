"use client";

import { useState, useEffect } from "react";
import type { PipelineType } from "@/lib/agents/types";

interface AiPipelineModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly pipeline: PipelineType;
  readonly title: string;
  readonly children: React.ReactNode;
}

interface JobState {
  readonly id: string | null;
  readonly status: "idle" | "submitting" | "processing" | "completed" | "failed";
  readonly progress: number;
  readonly currentAgent: string | null;
  readonly output: unknown | null;
  readonly qaScore: number | null;
  readonly error: string | null;
}

export function AiPipelineModal({
  isOpen,
  onClose,
  pipeline,
  title,
  children,
}: AiPipelineModalProps) {
  const [job, setJob] = useState<JobState>({
    id: null,
    status: "idle",
    progress: 0,
    currentAgent: null,
    output: null,
    qaScore: null,
    error: null,
  });

  // Poll job status
  useEffect(() => {
    if (!job.id || job.status === "completed" || job.status === "failed") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/agents/jobs/${job.id}`);
        const data = await res.json();
        if (data.success) {
          const j = data.data;
          setJob({
            id: j.id,
            status: j.status === "COMPLETED" ? "completed" : j.status === "FAILED" ? "failed" : "processing",
            progress: j.progress,
            currentAgent: j.currentAgent,
            output: j.output,
            qaScore: j.qaScore,
            error: j.error,
          });
        }
      } catch {
        // Polling error, retry on next interval
      }
    }, 500);

    return () => clearInterval(interval);
  }, [job.id, job.status]);

  async function handleSubmit(formData: Record<string, unknown>) {
    setJob({ ...job, status: "submitting" });

    try {
      const res = await fetch("/api/agents/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pipeline, input: formData }),
      });
      const data = await res.json();

      if (data.success) {
        setJob({
          id: data.data.jobId,
          status: "processing",
          progress: 0,
          currentAgent: null,
          output: null,
          qaScore: null,
          error: null,
        });
      } else {
        setJob({ ...job, status: "failed", error: data.error });
      }
    } catch {
      setJob({ ...job, status: "failed", error: "Network error" });
    }
  }

  function handleReset() {
    setJob({ id: null, status: "idle", progress: 0, currentAgent: null, output: null, qaScore: null, error: null });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-xs text-neutral-400 mt-1">Pipeline: {pipeline}</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-2xl leading-none">
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {job.status === "idle" && (
            <PipelineForm onSubmit={handleSubmit}>{children}</PipelineForm>
          )}

          {(job.status === "submitting" || job.status === "processing") && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-neutral-200 border-t-blue-600 animate-spin" />
              <p className="text-sm font-medium mb-2">
                {job.status === "submitting" ? "Dispatching..." : `Running: ${job.currentAgent ?? "initializing"}`}
              </p>
              <div className="w-full max-w-xs mx-auto h-2 bg-neutral-200 rounded-full overflow-hidden mt-4">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
              <p className="text-xs text-neutral-400 mt-2">{job.progress}%</p>
            </div>
          )}

          {job.status === "completed" && (
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-50 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                    <path strokeLinecap="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-green-700">Pipeline Completed</p>
                {job.qaScore !== null && (
                  <p className="text-xs text-neutral-500 mt-1">
                    QA Score: <span className="font-medium text-green-600">{(job.qaScore * 100).toFixed(0)}%</span>
                  </p>
                )}
              </div>

              {/* Output Preview */}
              <div className="bg-neutral-50 rounded p-4 mb-6 max-h-60 overflow-y-auto">
                <p className="text-xs font-medium text-neutral-500 mb-2">Output Preview</p>
                <pre className="text-xs text-neutral-700 whitespace-pre-wrap">
                  {JSON.stringify(job.output, null, 2)}
                </pre>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-green-600 text-white py-2.5 text-sm rounded hover:bg-green-700"
                >
                  Approve & Publish
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-white text-neutral-600 py-2.5 text-sm rounded border border-neutral-200 hover:border-neutral-400"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}

          {job.status === "failed" && (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-50 flex items-center justify-center">
                <span className="text-red-600 text-xl">!</span>
              </div>
              <p className="text-sm font-medium text-red-700 mb-2">Pipeline Failed</p>
              <p className="text-xs text-neutral-500 mb-6">{job.error}</p>
              <button
                onClick={handleReset}
                className="bg-neutral-900 text-white px-6 py-2.5 text-sm rounded hover:bg-neutral-800"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PipelineForm({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: (data: Record<string, unknown>) => void;
}) {
  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    onSubmit(data);
  }

  return <form onSubmit={handleFormSubmit}>{children}</form>;
}
