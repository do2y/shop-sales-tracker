import { Sale } from "../page";
import { useState } from "react";

const categories = [
  { key: "fabric", label: "패브릭" },
  { key: "accessory", label: "악세사리" },
  { key: "ceramic", label: "도자기" },
  { key: "wood", label: "우드" },
];

export default function SalesSummary({
  sales,
  selectedMonth,
}: {
  sales: Sale[];
  selectedMonth: string;
}) {
  const [showBars, setShowBars] = useState(false);
  const monthlySales = sales.filter(
    (s) => s.date.slice(0, 7) === selectedMonth
  );

  const totals = categories.map((c) => ({
    label: c.label,
    total: monthlySales
      .filter((s) => s.category === c.key)
      .reduce((sum, s) => sum + s.total, 0),
  }));

  const grandTotal = totals.reduce((s, c) => s + c.total, 0);

  const bars = totals.map((c) => ({
    ...c,
    ratio: grandTotal ? (c.total / grandTotal) * 100 : 0,
  }));

  const [year, month] = selectedMonth.split("-");

  return (
    <div className="w-1/2 p-8 bg-white h-full">
      <h2 className="text-4xl font-semiBold tracking-tight mb-6 mt-10">
        {year}년 {Number(month)}월 정산
      </h2>

      {totals.map((c) => (
        <div
          key={c.label}
          className="flex justify-between border-b py-2 text-lg"
        >
          <span>{c.label}</span>
          <span>{c.total.toLocaleString()}원</span>
        </div>
      ))}
      <div className="flex justify-between pt-4 text-xl font-bold">
        <span>총합</span>
        <span>{grandTotal.toLocaleString()}원</span>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowBars((v) => !v)}
          className="text-sm text-gray-600 underline"
        >
          {showBars ? "비율 숨기기 ▲ " : "판매 비율 보기 ▼ "}
        </button>
      </div>

      {showBars && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md">
          <div className="grid grid-cols-4 gap-4 items-end">
            {bars.map((b) => (
              <div key={b.label} className="flex flex-col items-center">
                <span className="text-xs text-gray-600 mb-2">
                  {b.ratio.toFixed(0)}%
                </span>

                <div className="w-12 h-30 bg-gray-200 rounded-sm flex items-end">
                  <div
                    className="w-full bg-gray-400 rounded-sm transition-all"
                    style={{ height: `${b.ratio}%` }}
                  />
                </div>

                <span className="text-xs text-gray-600 mt-2">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
