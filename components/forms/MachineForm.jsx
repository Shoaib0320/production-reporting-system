'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { API } from '@/lib/api';
import { toast } from 'sonner';

const machineSchema = z.object({
  name: z.string().min(1, 'مشین کا نام ضروری ہے'),
  tonnage: z.number().min(1, 'ٹن ضروری ہے'),
  code: z.string().min(1, 'کوڈ ضرور ی ہے'),
  description: z.string().optional(),
});

export default function MachineForm({ onSuccess, initialData, isEdit = false }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(machineSchema),
    defaultValues: initialData || {},
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (isEdit && initialData?._id) {
        await API.machines.update(initialData._id, data);
        toast.success('مشین اپڈیٹ ہو گئی');
      } else {
        await API.machines.create(data);
        toast.success('مشین شامل ہو گئی');
      }
      onSuccess?.();
    } catch (error) {
      const message = error.response?.data?.error || 'مشین محفوظ نہیں ہو سکی';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card dir="rtl">
      <CardHeader>
        <CardTitle>{isEdit ? 'مشین اپڈیٹ کریں' : 'نئی مشین شامل کریں'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>مشین کا نام</Label>
            <Input {...register('name')} placeholder="مشین کا نام" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>ٹنیج</Label>
            <Input
              type="number"
              {...register('tonnage', { valueAsNumber: true })}
              placeholder="ٹن میں"
            />
            {errors.tonnage && <p className="text-sm text-red-500">{errors.tonnage.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>کوڈ</Label>
            <Input {...register('code')} placeholder="مشین کا کوڈ" />
            {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>تفصیل (اختیاری)</Label>
            <Textarea {...register('description')} placeholder="مشین کی تفصیل" />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'محفوظ ہو رہا ہے...' : isEdit ? 'اپڈیٹ کریں' : 'مشین شامل کریں'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
