import React from 'react';
import { Users, ChefHat, Package } from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (role: 'waiter' | 'kitchen' | 'pickup') => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  const roles = [
    {
      id: 'waiter',
      name: 'Waiter/Waitress',
      description: 'Take orders from customers',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      description: 'Prepare food and manage tickets',
      icon: ChefHat,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'pickup',
      name: 'Pickup Staff',
      description: 'Deliver food to tables',
      icon: Package,
      color: 'from-green-500 to-green-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">Order Management System</h1>
          <p className="text-xl text-slate-400">Noodle Shop Kitchen & Service</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon as any;
            return (
              <button
                key={role.id}
                onClick={() => onSelectRole(role.id as any)}
                className="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-center">
                  <div className={`flex justify-center mb-6`}>
                    <div className={`bg-gradient-to-br ${role.color} p-4 rounded-2xl`}>
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{role.name}</h3>
                  <p className="text-slate-400 mb-6">{role.description}</p>

                  <div className="inline-block px-6 py-2 bg-white text-slate-900 font-semibold rounded-lg group-hover:bg-slate-100 transition-colors">
                    Select
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-12 text-center text-slate-400">
          <p className="text-sm">Select your role to continue</p>
        </div>
      </div>
    </div>
  );
};
