"use client";

import { useState } from "react";
import { Sale } from "../page";

const getDayLabel = (dateString: string) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[new Date(dateString).getDay()];
};

export default function SalesList({
  sales,
  onDeleteSale,
  selectedMonth,
  onChangeMonth,
}: {
  sales: Sale[];
  onDeleteSale: (id: string) => void;
  selectedMonth: string;
  onChangeMonth: (month: string) => void;
}) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const monthlySales = sales
    .filter((sale) => sale.date.slice(0, 7) === selectedMonth)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <aside className="w-1/2 border-r bg-white p-6 overflow-y-auto">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => onChangeMonth(e.target.value)}
          className="border px-2 py-1 rounded text-sm mb-4 mt-10"
        />

        {monthlySales.length === 0 && (
          <p className="text-gray-400">매출이 없습니다.</p>
        )}

        <ul className="space-y-3">
          {monthlySales.map((sale) => (
            <li
              key={sale.id}
              className="flex justify-between items-center border rounded p-3"
            >
              <div>
                <div className="text-m font-medium">
                  [{sale.category}] {sale.productName || "상품"} ×{" "}
                  {sale.quantity}
                </div>
                <div className="text-xs text-gray-500">
                  {sale.date} ({getDayLabel(sale.date)})
                </div>
              </div>

              <div className="text-m font-medium flex items-center gap-4">
                <span>{sale.total.toLocaleString()}원</span>
                <button
                  onClick={() => setDeleteTargetId(sale.id)}
                  className="text-sm text-red-500 underline hover:text-black mr-3"
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {deleteTargetId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-180 shadow-lg">
            <p className="text-3xl font-light mb-8 ml-2">
              매출 내역을 삭제할까요?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-5 py-3 text-m rounded bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={() => {
                  onDeleteSale(deleteTargetId);
                  setDeleteTargetId(null);
                }}
                className="px-5 py-3 text-m rounded bg-red-500 text-white"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
