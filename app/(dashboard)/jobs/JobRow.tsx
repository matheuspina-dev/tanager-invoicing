"use client";

import { useState } from "react";
import { updateJob, deleteJob } from "./actions";

export function JobRow({ job }: { job: any }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusColors: Record<string, string> = {
    OPEN: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    CLOSED: "bg-gray-100 text-gray-800",
  };

  return (
    <li className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {!editing ? (
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-lg text-black">
                {job.description}
              </p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  statusColors[job.status] || "bg-gray-100 text-gray-800"
                }`}
              >
                {job.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Customer:{" "}
              <span className="font-medium text-gray-700">
                {job.customer?.name || "Deleted customer"}
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Edit
            </button>

            <form
              action={async (formData) => {
                setError(null);
                try {
                  await deleteJob(formData);
                } catch (err: unknown) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Failed to delete job",
                  );
                }
              }}
            >
              <input type="hidden" name="id" value={job.id} />
              <button
                type="submit"
                onClick={(e) => {
                  if (!confirm("Delete this job?")) e.preventDefault();
                }}
                className="px-3 py-1 text-sm rounded bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </form>
          </div>

        </div>
      ) : (
        <form
          action={async (formData: FormData) => {
            setError(null);
            try {
              await updateJob(formData);
              setEditing(false);
            } catch (err: unknown) {
              setError(
                err instanceof Error
                  ? err.message
                  : "Failed to update job",
              );
            }
          }}
          className="space-y-4"
        >
          <input type="hidden" name="id" value={job.id} />

          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="font-semibold text-gray-700 text-sm">
              Edit Job
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-xs text-gray-500 hover:underline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-xs text-green-600 font-semibold hover:underline"
              >
                Save
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 font-medium">
                Description
              </label>
              <input
                name="description"
                defaultValue={job.description}
                className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium">
                Status
              </label>
              <select
                name="status"
                defaultValue={job.status}
                className="w-full border rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          </div>
        </form>
      )}
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </li>
  );
}
