const statusConfig = {
  new: { label: "جديد", class: "bg-blue-100 text-blue-800" },
  follow_up_due: { label: "متابعة مطلوبة", class: "bg-amber-100 text-amber-800" },
  viewing_scheduled: { label: "معاينة مجدولة", class: "bg-green-100 text-green-800" },
  cold: { label: "بارد", class: "bg-gray-100 text-gray-600" },
  won: { label: "تم البيع", class: "bg-teal-100 text-teal-800" },
  lost: { label: "خاسر", class: "bg-red-100 text-red-800" },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, class: "bg-gray-100 text-gray-600" };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
      {config.label}
    </span>
  );
}