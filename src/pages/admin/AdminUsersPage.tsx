import React, { useState, useEffect } from 'react';
import { Search, Users, Shield, User as UserIcon, RefreshCw, Mail, Calendar } from 'lucide-react';
import { api } from '../../services/api';
import { User, UserRole } from '../../types';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export const AdminUsersPage: React.FC = () => {
  const { success, error } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAdminUsers();
      setUsers(res.users);
    } catch (err: any) {
      error(err.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      success(`User role updated to ${newRole}`);
      loadUsers();
    } catch (err: any) {
      error(err.message || 'Failed to update user role');
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">Customer Accounts</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Manage user accounts, credentials, and access roles.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadUsers}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh
        </Button>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs py-2 pl-9 pr-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FAF92A] text-zinc-900"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-zinc-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">User</th>
                <th className="pb-3">Email Address</th>
                <th className="pb-3">Phone</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Location</th>
                <th className="pb-3 text-right pr-2">Role Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400">
                    Loading customer records...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400">
                    No customers found matching "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover bg-zinc-100 border border-zinc-200"
                        />
                        <span className="font-bold text-zinc-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-zinc-600 font-medium">{u.email}</td>
                    <td className="py-3 text-zinc-500">{u.phone || '—'}</td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-zinc-500">
                      {u.address?.city ? `${u.address.city}, ${u.address.state || u.address.country}` : '—'}
                    </td>
                    <td className="py-3 text-right pr-2">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="text-xs bg-zinc-50 border border-zinc-200 rounded-lg py-1 px-2 font-semibold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#FAF92A] cursor-pointer"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
