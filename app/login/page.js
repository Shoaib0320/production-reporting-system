'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md" dir="rtl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">پروڈکشن رپورٹنگ سسٹم</CardTitle>
          <CardDescription>اپنے اکاؤنٹ میں لاگ ان کریں</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="password">پاس ورڈ</Label>
              <Input
                id="password"
                type="password"
                placeholder="آپ کا پاس ورڈ"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'لاگ ان ہو رہا ہے...' : 'لاگ ان'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
