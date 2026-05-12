"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  Plus, X, Save, Trash2, Calendar, 
  Tag, Layers, Users, Sparkles, 
  Percent, IndianRupee, Info, Check 
} from 'lucide-react';
import { useNavigation } from '@/contexts/NavigationContext';
import { offersApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface AdminOfferFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminOfferForm: React.FC<AdminOfferFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const { categories, genders, occasions, collections } = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, control, watch, formState: { errors }, setValue } = useForm({
    defaultValues: initialData || {
      title: '',
      code: '',
      description: '',
      discount_type: 'PERCENTAGE',
      discount_value: 0,
      min_purchase: 0,
      max_discount: 0,
      expiry_date: '',
      is_active: true,
      is_one_time: initialData?.is_one_time || false,
      category_ids: [],
      gender_ids: [],
      collection_ids: [],
      occasion_ids: []
    }
  });

  const discountType = watch('discount_type');

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      let response;
      if (initialData?.id) {
        response = await offersApi.adminUpdateOffer(initialData.id, data);
      } else {
        response = await offersApi.adminCreateOffer(data);
      }

      if (response.success) {
        onSuccess();
      } else {
        setError(response.message || 'Failed to save offer');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const MultiSelect = ({ label, items, selectedIds, onToggle, icon: Icon }: any) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-white/5 border border-white/10 min-h-[50px]">
        {items.map((item: any) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                isSelected 
                  ? "bg-[#D4AF37] border-[#D4AF37] text-black" 
                  : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"
              )}
            >
              {item.name}
              {isSelected && <Check className="w-3 h-3 inline-block ml-2" />}
            </button>
          );
        })}
        {items.length === 0 && <span className="text-[10px] text-white/20 italic">No data available</span>}
      </div>
    </div>
  );

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 bg-zinc-950 border border-white/10 p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center pb-6 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {initialData ? 'Edit Luxury Offer' : 'Create New Luxury Offer'}
          </h2>
          <p className="text-white/40 text-xs mt-1">Configure premium discounts for your customers.</p>
        </div>
        <button type="button" onClick={onCancel} className="p-2 text-white/20 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
          <Info className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Basic Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Offer Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
              placeholder="e.g. Diwali Dhamaka Sale"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Coupon Code</label>
            <input
              {...register('code', { required: 'Code is required' })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-mono text-[#D4AF37] focus:border-[#D4AF37] outline-none uppercase"
              placeholder="e.g. DIWALI50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Discount Type</label>
              <select
                {...register('discount_type')}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] outline-none appearance-none"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Discount Value</label>
              <div className="relative">
                <input
                  type="number"
                  {...register('discount_value', { required: true, min: 1 })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">
                  {discountType === 'PERCENTAGE' ? <Percent className="w-4 h-4" /> : <IndianRupee className="w-4 h-4" />}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Min Purchase</label>
              <input
                type="number"
                {...register('min_purchase')}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Expiry Date</label>
              <div className="relative">
                <input
                  type="date"
                  {...register('expiry_date', { required: 'Expiry date is required' })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] outline-none appearance-none"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-[#D4AF37]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">One-time Offer</p>
                <p className="text-[10px] text-white/40 mt-0.5">Limit usage to once per customer</p>
              </div>
            </div>
            <Controller
              name="is_one_time"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={cn(
                    "w-12 h-6 rounded-full p-1 transition-all duration-300 outline-none",
                    field.value ? "bg-[#D4AF37]" : "bg-white/10"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-lg",
                    field.value ? "translate-x-6" : "translate-x-0"
                  )} />
                </button>
              )}
            />
          </div>
        </div>

        {/* Right Column: Targeting */}
        <div className="space-y-6">
          <Controller
            name="category_ids"
            control={control}
            render={({ field }) => (
              <MultiSelect
                label="Applicable Categories"
                items={categories}
                selectedIds={field.value}
                onToggle={(id: number) => {
                  const newValue = field.value.includes(id) 
                    ? field.value.filter((i: number) => i !== id) 
                    : [...field.value, id];
                  field.onChange(newValue);
                }}
                icon={Layers}
              />
            )}
          />

          <Controller
            name="gender_ids"
            control={control}
            render={({ field }) => (
              <MultiSelect
                label="Target Genders"
                items={genders}
                selectedIds={field.value}
                onToggle={(id: number) => {
                  const newValue = field.value.includes(id) 
                    ? field.value.filter((i: number) => i !== id) 
                    : [...field.value, id];
                  field.onChange(newValue);
                }}
                icon={Users}
              />
            )}
          />

          <Controller
            name="collection_ids"
            control={control}
            render={({ field }) => (
              <MultiSelect
                label="Target Collections"
                items={collections}
                selectedIds={field.value}
                onToggle={(id: number) => {
                  const newValue = field.value.includes(id) 
                    ? field.value.filter((i: number) => i !== id) 
                    : [...field.value, id];
                  field.onChange(newValue);
                }}
                icon={Sparkles}
              />
            )}
          />
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          disabled={isSubmitting}
          className="px-8 py-2.5 bg-[#D4AF37] text-black rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {initialData ? 'Update Offer' : 'Launch Offer'}
        </button>
      </div>
    </motion.form>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
