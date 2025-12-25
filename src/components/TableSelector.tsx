import React, { useEffect, useState } from 'react';
import { fetchTables } from '../utils/orderService';
import { Table } from '../types/order';
import { Grid3x3, Users } from 'lucide-react';

interface TableSelectorProps {
  onSelectTable: (table: Table) => void;
}

export const TableSelector: React.FC<TableSelectorProps> = ({ onSelectTable }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTables = async () => {
      try {
        const data = await fetchTables();
        setTables(data);
      } catch (error) {
        console.error('Failed to load tables:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTables();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading tables...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <Grid3x3 className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-slate-900">Select Table</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => onSelectTable(table)}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 p-6 border-2 border-transparent hover:border-blue-500 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center group-hover:from-blue-200 transition-colors">
                  <Grid3x3 className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">Table {table.table_number}</div>
                  <div className="flex items-center justify-center gap-1 text-slate-600 text-sm">
                    <Users className="w-4 h-4" />
                    <span>Seats {table.capacity}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
