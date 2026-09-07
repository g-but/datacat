'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Submission {
  id: string;
  data: Record<string, unknown>;
  submittedAt: string;
}

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { formId } = params;
  const { token } = useAuth();

  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (!formId || !token) return;

    const fetchSubmissions = async () => {
      setLoading(true);
      const url = new URL(`/api/v1/submissions/form/${formId}`, window.location.origin);
      if (search) url.searchParams.append('search', search);
      if (startDate) url.searchParams.append('startDate', startDate.toISOString());
      if (endDate) url.searchParams.append('endDate', endDate.toISOString());

      try {
        const res = await fetch(url.toString(), {
          headers: { 'x-auth-token': token },
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to fetch submissions.');
        }
        const data = await res.json();
        setSubmissions(data.submissions);
        setTotal(data.pagination?.total ?? data.submissions.length);
        // A filter that succeeds clears the previous failure; without this the
        // page stayed on its error forever, with no way back.
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchSubmissions();
    }, 500); // Debounce search input

    return () => clearTimeout(debounceFetch);
  }, [formId, token, search, startDate, endDate]);

  // Union of every row's keys: two submissions of the same form can carry
  // different fields once the form is edited, and indexing cells by each row's
  // own keys silently shifted values under the wrong column.
  const dataColumns = Array.from(new Set(submissions.flatMap((s) => Object.keys(s.data))));
  const tableHeaders = ['Submitted At', ...dataColumns];

  const downloadCSV = () => {
    const escapeCell = (value: unknown) => JSON.stringify(value == null ? '' : String(value));
    const csvRows = [
      tableHeaders.map(escapeCell).join(','),
      ...submissions.map((sub) =>
        [
          escapeCell(new Date(sub.submittedAt).toLocaleString()),
          ...dataColumns.map((column) => escapeCell(sub.data[column] ?? '')),
        ].join(','),
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${formId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Form Submissions</h1>

        {/* Filter and Export Controls — always mounted. Unmounting them while
            loading stole focus from the search box on every debounced keystroke,
            and left an error state with no way to change the filters. */}
        <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <input
            type="search"
            placeholder="Search submissions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow block w-full pl-4 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          />
          <div className="flex items-center gap-2">
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date || undefined)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
              className="w-full pl-4 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            />
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date || undefined)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End Date"
              className="w-full pl-4 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            />
          </div>
          <button
            onClick={downloadCSV}
            disabled={submissions.length === 0}
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Download CSV
          </button>
        </div>

        {error ? (
          <div className="py-16 text-center text-red-500">Error: {error}</div>
        ) : loading ? (
          <div className="py-16 text-center text-gray-500">Loading submissions...</div>
        ) : submissions.length > 0 ? (
          <>
            {total > submissions.length && (
              // Never a silent cap: say so when the export and table hold less
              // than the filter matched.
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                Showing the {submissions.length} most recent of {total} matching submissions — the
                CSV export covers these {submissions.length}. Narrow the filters to see the rest.
              </p>
            )}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {tableHeaders.map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {header.replace(/_/g, ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(submission.submittedAt).toLocaleString()}
                      </td>
                      {dataColumns.map((column) => (
                        <td
                          key={column}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
                        >
                          {submission.data[column] == null ? '' : String(submission.data[column])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">
              {search || startDate || endDate
                ? 'No submissions match these filters.'
                : 'This form has no submissions yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionsPage;
