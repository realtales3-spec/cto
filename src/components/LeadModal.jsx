import { useState, useEffect } from "react";

const propertyTypes = ["", "Villa", "Apartment", "Land", "Commercial"];
const statusOptions = ["new", "follow_up_due", "viewing_scheduled", "cold", "won", "lost"];

const labels = {
  name: "الاسم",
  phone: "رقم الهاتف",
  area: "المنطقة",
  budget: "الميزانية (د.أ)",
  property_type: "نوع العقار",
  status: "الحالة",
  notes: "ملاحظات",
};

const statusLabels = {
  new: "جديد",
  follow_up_due: "متابعة مطلوبة",
  viewing_scheduled: "معاينة مجدولة",
  cold: "بارد",
  won: "تم البيع",
  lost: "خاسر",
};

const defaultForm = {
  name: "",
  phone: "",
  area: "",
  budget: "",
  property_type: "",
  status: "new",
  notes: "",
};

export default function LeadModal({ isOpen, onClose, onSubmit, lead }) {
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name || "",
        phone: lead.phone || "",
        area: lead.area || "",
        budget: lead.budget || "",
        property_type: lead.property_type || "",
        status: lead.status || "new",
        notes: lead.notes || "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!form.name.trim() || !form.phone.trim() || !form.area.trim()) {
      setError("الاسم، الهاتف، والمنطقة حقول إجبارية");
      setSubmitting(false);
      return;
    }

    try {
      const data = {
        ...form,
        budget: form.budget ? parseFloat(form.budget) : null,
      };
      await onSubmit(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold">
            {lead ? "تعديل العميل" : "إضافة عميل جديد"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{labels.name} *</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{labels.phone} *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={handleChange("phone")}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{labels.area} *</label>
            <input
              type="text"
              value={form.area}
              onChange={handleChange("area")}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{labels.budget}</label>
              <input
                type="number"
                value={form.budget}
                onChange={handleChange("budget")}
                min="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{labels.property_type}</label>
              <select
                value={form.property_type}
                onChange={handleChange("property_type")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="">اختر...</option>
                {propertyTypes.filter(Boolean).map((t) => (
                  <option key={t} value={t}>{t === "Villa" ? "فيلا" : t === "Apartment" ? "شقة" : t === "Land" ? "أرض" : "تجاري"}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{labels.status}</label>
            <select
              value={form.status}
              onChange={handleChange("status")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{statusLabels[s]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{labels.notes}</label>
            <textarea
              value={form.notes}
              onChange={handleChange("notes")}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
            >
              {submitting ? "جاري الحفظ..." : lead ? "حفظ التعديلات" : "إضافة العميل"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}