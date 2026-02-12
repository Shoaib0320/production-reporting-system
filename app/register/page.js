'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const { register: registerUser, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'operator',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md" dir="rtl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">رجسٹریشن</CardTitle>
          <CardDescription>نیا اکاؤنٹ بنائیں</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">نام</Label>
              <Input
                id="name"
                placeholder="آپ کا نام"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">ای میل</Label>
              <Input
                id="email"
                type="email"
                placeholder="آپ کا ای میل"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">فون نمبر</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="آپ کا فون نمبر"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">پاس ورڈ</Label>
              <Input
                id="password"
                type="password"
                placeholder="پاس ورڈ (کم از کم 6 حروف)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label>رول</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operator">آپریٹر</SelectItem>
                  <SelectItem value="supervisor">سپروائزر</SelectItem>
                  <SelectItem value="admin">ایڈمن</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'رجسٹر ہو رہا ہے...' : 'رجسٹر کریں'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
