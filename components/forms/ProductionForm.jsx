'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useProductions } from '@/lib/hooks/useProductions';
import { API } from '@/lib/api';
import { toast } from 'sonner';

const productionSchema = z.object({
  machineId: z.string().min(1, 'مشین منتخب کریں'),
  productName: z.string().min(1, 'پروڈکٹ کا نام ضروری ہے'),
  contractQuantity: z.number().min(1, 'کنٹریکٹ کوانٹیٹی ضروری ہے'),
  pieceWeight: z.number().min(0.001, 'وزن درست کریں'),
  totalPieces: z.number().min(1, 'کل پیسز ضروری ہیں'),
  operatorId: z.string().min(1, 'آپریٹر منتخب کریں'),
  shift: z.enum(['morning', 'evening', 'night']),
  meterReading: z.number().optional(),
  notes: z.string().optional(),
});

export default function ProductionForm({ onSuccess, initialData, isEdit = false }) {
  const [machines, setMachines] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const { createProduction, updateProduction } = useProductions();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productionSchema),
    defaultValues: initialData || {
      shift: 'morning',
    },
  });

  const pieceWeight = watch('pieceWeight') || 0;
  const totalPieces = watch('totalPieces') || 0;
  const totalWeight = pieceWeight * totalPieces;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [machinesRes, operatorsRes] = await Promise.all([
          API.machines.getAll(),
          API.users.getAll('operator'),
        ]);
        setMachines(machinesRes);
        setOperators(operatorsRes);
      } catch (error) {
        toast.error('ڈیٹا لوڈ کرنے میں مسئلہ');
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (isEdit && initialData?._id) {
        await updateProduction(initialData._id, data);
      } else {
        await createProduction(data);
      }
      onSuccess?.();
    } catch (error) {
      // Error handled in hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card dir="rtl">
      <CardHeader>
        <CardTitle>{isEdit ? 'پروڈکشن اپڈیٹ کریں' : 'نئی پروڈکشن داخل کریں'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>مشین</Label>
            <Select onValueChange={(value) => setValue('machineId', value)} defaultValue={initialData?.machineId}>
              <SelectTrigger>
                <SelectValue placeholder="مشین منتخب کریں" />
              </SelectTrigger>
              <SelectContent>
                {machines.map((machine) => (
                  <SelectItem key={machine._id} value={machine._id}>
                    {machine.name} - {machine.tonnage} ٹن
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.machineId && <p className="text-sm text-red-500">{errors.machineId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>پروڈکٹ کا نام</Label>
            <Input {...register('productName')} placeholder="پروڈکٹ کا نام لکھیں" />
            {errors.productName && <p className="text-sm text-red-500">{errors.productName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>کنٹریکٹ کوانٹیٹی</Label>
              <Input
                type="number"
                {...register('contractQuantity', { valueAsNumber: true })}
                placeholder="کنٹریکٹ کوانٹیٹی"
              />
              {errors.contractQuantity && <p className="text-sm text-red-500">{errors.contractQuantity.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>ایک پیس کا وزن</Label>
              <Input
                type="number"
                step="0.001"
                {...register('pieceWeight', { valueAsNumber: true })}
                placeholder="وزن"
              />
              {errors.pieceWeight && <p className="text-sm text-red-500">{errors.pieceWeight.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>کل پیسز</Label>
              <Input
                type="number"
                {...register('totalPieces', { valueAsNumber: true })}
                placeholder="کل پیسز"
              />
              {errors.totalPieces && <p className="text-sm text-red-500">{errors.totalPieces.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>کل وزن</Label>
              <Input
                type="number"
                value={totalWeight.toFixed(3)}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>آپریٹر</Label>
            <Select onValueChange={(value) => setValue('operatorId', value)} defaultValue={initialData?.operatorId}>
              <SelectTrigger>
                <SelectValue placeholder="آپریٹر منتخب کریں" />
              </SelectTrigger>
              <SelectContent>
                {operators.map((operator) => (
                  <SelectItem key={operator._id} value={operator._id}>
                    {operator.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.operatorId && <p className="text-sm text-red-500">{errors.operatorId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>شفٹ</Label>
            <Select onValueChange={(value) => setValue('shift', value)} defaultValue={initialData?.shift || 'morning'}>
              <SelectTrigger>
                <SelectValue placeholder="شفٹ منتخب کریں" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">صبح</SelectItem>
                <SelectItem value="evening">شام</SelectItem>
                <SelectItem value="night">رات</SelectItem>
              </SelectContent>
            </Select>
            {errors.shift && <p className="text-sm text-red-500">{errors.shift.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>میٹر ریڈنگ (اختیاری)</Label>
            <Input
              type="number"
              {...register('meterReading', { valueAsNumber: true })}
              placeholder="میٹر ریڈنگ"
            />
          </div>

          <div className="space-y-2">
            <Label>نوٹس (اختیاری)</Label>
            <Textarea {...register('notes')} placeholder="کوئی خاص نوٹ" />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'محفوظ ہو رہا ہے...' : isEdit ? 'اپڈیٹ کریں' : 'پروڈکشن محفوظ کریں'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
