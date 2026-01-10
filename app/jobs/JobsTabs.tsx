"use client";

import { useState } from "react";
import { JobRow } from "./JobRow";

export default function JobsTabs({ jobs }: { jobs: any[] }) {
  const [filter, setFilter] = useState<"ALL" | "OPEN_IN_PROGRESS" | "CLOSED">(
    "OPEN_IN_PROGRESS"
  );

  const filteredJobs = jobs.filter((job) => {
    if (filter === "ALL") return true;
    if (filter === "OPEN_IN_PROGRESS")
      return job.status === "OPEN" || job.status === "IN_PROGRESS";
    if (filter === "CLOSED") return job.status === "CLOSED";
    return false;
  });

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded cursor-pointer ${
            filter === "OPEN_IN_PROGRESS"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          onClick={() => setFilter("OPEN_IN_PROGRESS")}
        >
          Open / In Progress
        </button>
        <button
          className={`px-4 py-2 rounded cursor-pointer ${
            filter === "CLOSED"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          onClick={() => setFilter("CLOSED")}
        >
          Closed
        </button>
        <button
          className={`px-4 py-2 rounded cursor-pointer ${
            filter === "ALL"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          onClick={() => setFilter("ALL")}
        >
          All
        </button>
      </div>

      {/* Jobs List */}
      <ul className="space-y-3">
        {filteredJobs.map((job) => (
          <JobRow key={job.id} job={job} />
        ))}
      </ul>
    </div>
  );
}
