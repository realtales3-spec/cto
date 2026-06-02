import { useState } from "react";

const statusOptions = [
  { value: "", label: "جميع الحالات" },
  { value: "new", label: "جديد" },
  { value: "follow_up_due", label: "متابعة مطلوبة" },
  { value: "viewing_scheduled", label: "معاينة مجدولة" },
  { value: "cold", label: "بارد" },
  { value: "won", label: "تم البيع" },
  { value: "lost", label: "خاسر" },
];

export default function FilterBar({ onFilterChange }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    onFilterChange({ search: val, status });
  };

  const handleStatusChange = (e) => {
    const val = e.target.value;
    setStatus(val);
    onFilterChange({ search, status: val });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="بحث بالاسم أو رقم الهاتف..."
          className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
        />
      </div>
      <select
        value={status}
        onChange={handleStatusChange}
        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}