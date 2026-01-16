"use client";

import { useEffect, useState } from "react";
import SalesInput from "./_components/SalesInput";
import SalesSummary from "./_components/SalesSummary";
import SalesList from "./_components/SalesList";

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Sale = {
  id: string;
  date: string;
  category: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
  createdAt: Timestamp;
};

type Tab = "input" | "summary";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("input");
  const [sales, setSales] = useState<Sale[]>([]);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    const fetchSales = async () => {
      const q = query(collection(db, "sales"), orderBy("createdAt", "desc"));

      const snapshot = await getDocs(q);

      const data: Sale[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          date: d.date,
          category: d.category,
          productName: d.productName,
          price: d.price,
          quantity: d.quantity,
          total: d.total,
          createdAt: d.createdAt,
        };
      });

      setSales(data);
    };

    fetchSales();
  }, []);

  const handleAddSale = async (sale: Omit<Sale, "id" | "createdAt">) => {
    const now = Timestamp.now();

    const docRef = await addDoc(collection(db, "sales"), {
      ...sale,
      createdAt: now,
    });

    setSales((prev) => [{ id: docRef.id, ...sale, createdAt: now }, ...prev]);
  };

  const handleDeleteSale = async (id: string) => {
    await deleteDoc(doc(db, "sales", id));
    setSales((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <main className="h-screen flex flex-col">
      <header className="flex border-b bg-white">
        <TabButton
          active={activeTab === "input"}
          label="매출 입력"
          onClick={() => setActiveTab("input")}
        />
        <TabButton
          active={activeTab === "summary"}
          label="조회 / 정산"
          onClick={() => setActiveTab("summary")}
        />
      </header>

      <section className="flex-1 overflow-hidden">
        {activeTab === "input" && (
          <div className="h-full">
            <SalesInput onAddSale={handleAddSale} />
          </div>
        )}

        {activeTab === "summary" && (
          <div className="h-full flex">
            <SalesList
              sales={sales}
              onDeleteSale={handleDeleteSale}
              selectedMonth={selectedMonth}
              onChangeMonth={setSelectedMonth}
            />

            <SalesSummary sales={sales} selectedMonth={selectedMonth} />
          </div>
        )}
      </section>
    </main>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-4 text-lg font-medium border-r
        ${
          active
            ? "bg-gray-100 border-t-2 border-t-black"
            : "bg-white text-gray-500"
        }`}
    >
      {label}
    </button>
  );
}
