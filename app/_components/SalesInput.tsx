"use client";

import { useState } from "react";
import { Sale } from "../page";

const categories = [
  { key: "fabric", label: "패브릭" },
  { key: "accessory", label: "악세사리" },
  { key: "ceramic", label: "도자기" },
  { key: "wood", label: "우드" },
] as const;

export default function SalesInput({
  onAddSale,
}: {
  onAddSale: (sale: Omit<Sale, "id" | "createdAt">) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);
  const [category, setCategory] = useState<string>("fabric");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSaved, setIsSaved] = useState(false);

  const total = price * quantity;

  const handleSave = () => {
    if (!price) return;

    onAddSale({
      date,
      category,
      productName,
      price,
      quantity,
      total,
    });

    setProductName("");
    setPrice(0);
    setQuantity(1);

    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  return (
    <aside className="h-full">
      <div className="max-w-2xl mx-auto p-6 mt-8">
        <div className="space-y-4">
          <Field label="날짜">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
            />
          </Field>

          <Field label="카테고리">
            <div className="flex gap-2">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`flex-1 py-3 border rounded
                    ${category === c.key ? "bg-black text-white" : "bg-white"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="제품명">
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="제품명 입력"
              className="input"
            />
          </Field>

          <Field label="가격">
            <input
              type="number"
              value={price || ""}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="가격 입력"
              className="input"
            />
          </Field>

          <Field label="수량">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 border rounded"
              >
                −
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 border rounded"
              >
                +
              </button>
            </div>
          </Field>

          <div className="text-2xl font-semiBold pt-8">
            합계: {total.toLocaleString()}원
          </div>

          <button
            onClick={handleSave}
            disabled={price <= 0 || isSaved}
            className="w-full py-3 bg-black text-white rounded
             disabled:opacity-40 transition"
          >
            {isSaved ? (
              <span className="inline-flex items-center gap-2">
                저장되었습니다
                <span>✓</span>
              </span>
            ) : (
              "저장"
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
