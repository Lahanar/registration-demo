import { useState } from 'react';
import { RoleSelector } from './components/RoleSelector';
import { TableSelector } from './components/TableSelector';
import { WaiterInterface } from './components/WaiterInterface';
import { KitchenDisplay } from './components/KitchenDisplay';
import { WaiterPickup } from './components/WaiterPickup';
import { Table } from './types/order';

type AppState = 'role-select' | 'table-select' | 'waiter-order' | 'kitchen' | 'waiter-pickup';

function App() {
  const [state, setState] = useState<AppState>('role-select');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const handleRoleSelect = (role: 'waiter' | 'kitchen' | 'pickup') => {
    if (role === 'waiter') {
      setState('table-select');
    } else if (role === 'kitchen') {
      setState('kitchen');
    } else if (role === 'pickup') {
      setState('waiter-pickup');
    }
  };

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    setState('waiter-order');
  };

  const handleBackToRole = () => {
    setSelectedTable(null);
    setState('role-select');
  };

  const handleLogout = () => {
    setSelectedTable(null);
    setState('role-select');
  };

  return (
    <div>
      {state === 'role-select' && <RoleSelector onSelectRole={handleRoleSelect} />}
      {state === 'table-select' && <TableSelector onSelectTable={handleTableSelect} />}
      {state === 'waiter-order' && selectedTable && (
        <WaiterInterface table={selectedTable} onBack={handleBackToRole} onLogout={handleLogout} />
      )}
      {state === 'kitchen' && <KitchenDisplay onLogout={handleLogout} />}
      {state === 'waiter-pickup' && <WaiterPickup onLogout={handleLogout} />}
    </div>
  );
}

export default App;
