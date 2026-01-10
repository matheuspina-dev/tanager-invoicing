"use client";

import { useState } from "react";
import { updateJob, deleteJob } from "./actions";

export function JobRow({ job }: { job: any }) {
  const [editing, setEditing] = useState(false);

  return (
    <li className="bg-white border rounded-lg p-4">
      {!editing ? (
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-black">{job.description}</p>
            <p className="text-sm text-gray-700">
              Customer: {job.customer.name} - Status: {job.status}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
            >
              Edit
            </button>

            <form action={deleteJob}>
              <input type="hidden" name="id" value={job.id} />
              <button
                type="submit"
                onClick={(e) => {
                  if (!confirm("Delete this job?")) e.preventDefault();
                }}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      ) : (
        <form
          action={async (formData: FormData) => {
            await updateJob(formData);
            setEditing(false);
          }}
          className="space-y-3"
        >
          <input type="hidden" name="id" value={job.id} />

          <input
            name="description"
            defaultValue={job.description}
            className="bg-white p-4 rounded-lg border placeholder-gray-600 text-gray-600 space-y-3 w-full"
          />
          <select
            name="status"
            defaultValue={job.status}
            className="border placeholder-gray-600 text-gray-600 rounded px-3 py-2 w-full"
          >
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-200 px-4 py-2 text-gray-600 rounded hover:bg-gray-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </li>
  );
}
