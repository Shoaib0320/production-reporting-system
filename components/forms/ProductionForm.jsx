'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { API } from '@/lib/api';
import { useProductions } from '@/lib/hooks/useProductions';
import { toast } from 'sonner';
import { 
  Calculator, 
  User, 
  Clock, 
  Hash, 
  Clipboard, 
  Settings2,
  Package,
  Weight
} from 'lucide-react';

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = "text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1.5 flex items-center gap-2";
//   const inputStyle = "h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#00A3E1]/20 focus:border-[#00A3E1] transition-all transition-all duration-200";
const inputStyle = "h-12 rounded-xl bg-white border-2 border-gray-300 shadow-sm focus:border-[#00A3E1] focus:ring-4 focus:ring-[#00A3E1]/10 transition-all duration-200 placeholder:text-gray-300 font-semibold text-gray-800";
  return (
    <div className="bg-white overflow-hidden" dir="rtl">
      {/* Header Section */}
      <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[#00A3E1] to-[#007fb1] text-white relative">
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2 sm:gap-3">
            <Settings2 className="h-5 w-5 sm:h-7 sm:w-7 opacity-80" />
            {isEdit ? 'پروڈکشن اپڈیٹ کریں' : 'نئی پروڈکشن داخل کریں'}
          </h2>
          <p className="text-white/70 text-xs sm:text-sm mt-1 font-medium italic hidden sm:block">Enter precise production metrics for quality reporting.</p>
        </div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16 blur-3xl"></div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-5">
          
          {/* Section 1: Machine & Product */}
          <div className="md:col-span-6 space-y-2">
            <Label className={labelStyle}><Hash className="h-3 w-3" /> مشین منتخب کریں</Label>
            <Select onValueChange={(v) => setValue('machineId', v)} defaultValue={initialData?.machineId}>
              <SelectTrigger className={inputStyle}>
                <SelectValue placeholder="مشین منتخب کریں" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-2xl">
                {machines.map((m) => (
                  <SelectItem key={m._id} value={m._id} className="py-3 font-semibold">{m.name} <span className="text-gray-400 text-xs mr-2">— {m.tonnage} Ton</span></SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.machineId && <p className="text-[10px] text-red-500 font-bold">{errors.machineId.message}</p>}
          </div>

          <div className="md:col-span-6 space-y-2">
            <Label className={labelStyle}><Package className="h-3 w-3" /> پروڈکٹ کا نام</Label>
            <Input {...register('productName')} className={inputStyle} placeholder="مثلاً: PVC Fitting 4-inch" />
            {errors.productName && <p className="text-[10px] text-red-500 font-bold">{errors.productName.message}</p>}
          </div>

          {/* Section 2: Quantities & Weights */}
          <div className="col-span-1 md:col-span-4 space-y-2">
            <Label className={labelStyle}><Calculator className="h-3 w-3" /> کنٹریکٹ کوانٹیٹی</Label>
            <Input type="number" {...register('contractQuantity', { valueAsNumber: true })} className={inputStyle} />
          </div>

          <div className="col-span-1 md:col-span-4 space-y-2">
            <Label className={labelStyle}><Weight className="h-3 w-3" /> ایک پیس کا وزن (kg)</Label>
            <Input step="0.001" type="number" {...register('pieceWeight', { valueAsNumber: true })} className={`${inputStyle} text-emerald-600 font-bold`} />
          </div>

          <div className="col-span-1 md:col-span-4 space-y-2">
            <Label className={labelStyle}><Hash className="h-3 w-3" /> کل پیسز</Label>
            <Input type="number" {...register('totalPieces', { valueAsNumber: true })} className={`${inputStyle} text-blue-600 font-black`} />
          </div>

          {/* Auto Calculation Result - High Visibility */}
          <div className="col-span-1 md:col-span-12">
            <div className="bg-blue-50/50 border-2 border-dashed border-blue-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-lg text-white">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase">Total Weight</p>
                  <p className="text-[10px] sm:text-xs text-blue-600 font-medium italic hidden sm:block">بیسڈ آن پیسز اور فی پیس وزن</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-2xl sm:text-3xl font-black text-blue-700 tracking-tighter">{totalWeight.toFixed(3)}</span>
                <span className="text-xs sm:text-sm font-bold text-blue-500 mr-2 uppercase">KG</span>
              </div>
            </div>
          </div>

          {/* Section 3: Personnel & Timing */}
          <div className="col-span-1 md:col-span-6 space-y-2">
            <Label className={labelStyle}><User className="h-3 w-3" /> آپریٹر</Label>
            <Select onValueChange={(v) => setValue('operatorId', v)} defaultValue={initialData?.operatorId}>
              <SelectTrigger className={inputStyle}>
                <SelectValue placeholder="آپریٹر منتخب کریں" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-2xl">
                {operators.map((o) => (
                  <SelectItem key={o._id} value={o._id} className="py-3">{o.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1 md:col-span-6 space-y-2">
            <Label className={labelStyle}><Clock className="h-3 w-3" /> شفٹ</Label>
            <Select onValueChange={(v) => setValue('shift', v)} defaultValue={initialData?.shift || 'morning'}>
              <SelectTrigger className={inputStyle}>
                <SelectValue placeholder="شفٹ منتخب کریں" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-2xl">
                <SelectItem value="morning" className="py-3">صبح (Morning)</SelectItem>
                <SelectItem value="evening" className="py-3">شام (Evening)</SelectItem>
                <SelectItem value="night" className="py-3">رات (Night)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Section 4: Maintenance & Notes */}
          <div className="col-span-1 md:col-span-12 space-y-2">
            <Label className={labelStyle}><Calculator className="h-3 w-3" /> میٹر ریڈنگ (Meter Reading)</Label>
            <Input type="number" {...register('meterReading', { valueAsNumber: true })} className={inputStyle} placeholder="موجودہ میٹر ریڈنگ درج کریں" />
          </div>

          <div className="col-span-1 md:col-span-12 space-y-2">
            <Label className={labelStyle}><Clipboard className="h-3 w-3" /> نوٹس / اضافی معلومات</Label>
            <Textarea 
              {...register('notes')} 
              className="min-h-[80px] sm:min-h-[100px] rounded-xl sm:rounded-2xl bg-gray-50 border-gray-100 focus:bg-white resize-none p-3 sm:p-4 text-sm" 
              placeholder="اگر کوئی خاص بات ہو تو یہاں لکھیں (مثلاً بریک ڈاؤن یا مٹیریل ایشو)..." 
            />
          </div>

          {/* Form Actions */}
          <div className="col-span-1 md:col-span-12 pt-4 sm:pt-6 flex gap-3 sm:gap-4">
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1 h-12 sm:h-14 bg-gradient-to-r from-[#00A3E1] to-[#0089bd] hover:shadow-xl hover:shadow-blue-200 rounded-xl sm:rounded-2xl font-black text-sm sm:text-lg transition-all duration-300 active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  محفوظ ہو رہا ہے...
                </div>
              ) : isEdit ? 'ریکارڈ اپڈیٹ کریں' : 'پروڈکشن محفوظ کریں'}
            </Button>
          </div>

        </div>
      </form>
    </div>
  );
}