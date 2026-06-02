import { useState, useMemo } from "react";
import { format, parseISO, isPast, isToday } from "date-fns";
import { arSA } from "date-fns/locale";
import StatusBadge from "./StatusBadge";

export default function LeadTable({ leads, onEdit, onFollowUpDone, onDelete }) {
  const [sortField, setSortField] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    return [...leads].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (!aVal) return 1;
      if (!bVal) return -1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [leads, sortField, sortDir]);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-blue-600 ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const getFollowupUrgency = (dateStr) => {
    if (!dateStr) return "";
    const date = parseISO(dateStr);
    if (isPast(date)) return "text-red-600 font-semibold";
    if (isToday(date)) return "text-amber-600 font-semibold";
    return "text-gray-500";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return format(parseISO(dateStr), "dd MMM yyyy", { locale: arSA });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-right px-4 py-3 font-medium text-gray-600 cursor-pointer" onClick={() => handleSort("name")}>
              <SortIcon field="name" /> الاسم
            </th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">الهاتف</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600 cursor-pointer" onClick={() => handleSort("area")}>
              <SortIcon field="area" /> المنطقة
            </th>
            <th className="text-right px-4 py-3 font-medium text-gray-600 cursor-pointer" onClick={() => handleSort("budget")}>
              <SortIcon field="budget" /> الميزانية
            </th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">نوع العقار</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600 cursor-pointer" onClick={() => handleSort("status")}>
              <SortIcon field="status" /> الحالة
            </th>
            <th className="text-right px-4 py-3 font-medium text-gray-600 cursor-pointer" onClick={() => handleSort("next_followup")}>
              <SortIcon field="next_followup" /> المتابعة القادمة
            </th>
            <th className="text-center px-4 py-3 font-medium text-gray-600">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-12 text-gray-400">
                لا يوجد عملاء بعد. أضف عميلاً جديداً للبدء.
              </td>
            </tr>
          ) : (
            sorted.map((lead) => (
              <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium">{lead.name}</td>
                <td className="px-4 py-3 text-gray-600 ltr text-left" dir="ltr">{lead.phone}</td>
                <td className="px-4 py-3 text-gray-600">{lead.area}</td>
                <td className="px-4 py-3 text-gray-600">
                  {lead.budget ? `${Number(lead.budget).toLocaleString()} د.أ` : "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">{lead.property_type || "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className={`px-4 py-3 ${getFollowupUrgency(lead.next_followup)}`}>
                  {formatDate(lead.next_followup)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onFollowUpDone(lead.id)}
                      title="تمت المتابعة"
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEdit(lead)}
                      title="تعديل"
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}