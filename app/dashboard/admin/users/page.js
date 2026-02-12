 'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import DetailModal from '@/components/shared/DetailModal';
import { useAuth } from '@/lib/hooks/useAuth';
import { API } from '@/lib/api';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await API.users.getAll();
        setUsers(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <div className="p-6" dir="rtl">
            <Card>
              <CardHeader>
                <CardTitle>یوزرز</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div>لوڈ ہو رہا ہے...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>نام</TableHead>
                        <TableHead>ای میل</TableHead>
                        <TableHead>فون</TableHead>
                        <TableHead>رول</TableHead>
                        <TableHead>اسٹیٹس</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u._id}>
                          <TableCell>{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>{u.phone}</TableCell>
                          <TableCell>{u.role}</TableCell>
                          <TableCell className="flex items-center gap-2">
                            <span>{u.isActive ? 'Active' : 'Inactive'}</span>
                            <Button size="sm" variant="ghost" onClick={() => { setSelectedUser(u); setModalOpen(true); }}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {users.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">کوئی یوزر نہیں</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
            <DetailModal open={modalOpen} onOpenChange={setModalOpen} title={selectedUser?.name}>
              {selectedUser ? (
                <div className="space-y-2">
                  <div><strong>ای میل:</strong> {selectedUser.email}</div>
                  <div><strong>فون:</strong> {selectedUser.phone}</div>
                  <div><strong>رول:</strong> {selectedUser.role}</div>
                  <div><strong>Active:</strong> {selectedUser.isActive ? 'Yes' : 'No'}</div>
                  <div><strong>Created:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</div>
                </div>
              ) : (
                <div>Loading...</div>
              )}
            </DetailModal>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
 

