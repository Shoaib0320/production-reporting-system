'use client';

import { useState, useEffect } from 'react';
import { API } from '@/lib/api';
import { toast } from 'sonner';

export function useProductions(initialFilters = {}) {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState(initialFilters);

  const fetchProductions = async (newFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentFilters = newFilters || filters;
      const response = await API.productions.getAll(currentFilters);
      
      setProductions(response.data || response);
      if (response.pagination) {
        setPagination(response.pagination);
      }
      setFilters(currentFilters);
    } catch (error) {
      const message = error.response?.data?.error || 'ڈیٹا لوڈ کرنے میں مسئلہ';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const createProduction = async (data) => {
    try {
      setLoading(true);
      const production = await API.productions.create(data);
      toast.success('پروڈکشن کامیابی سے محفوظ ہو گئی');
      await fetchProductions();
      return production;
    } catch (error) {
      const message = error.response?.data?.error || 'پروڈکشن محفوظ نہیں ہو سکی';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduction = async (id, data) => {
    try {
      setLoading(true);
      const production = await API.productions.update(id, data);
      toast.success('پروڈکشن اپڈیٹ ہو گئی');
      await fetchProductions();
      return production;
    } catch (error) {
      const message = error.response?.data?.error || 'اپڈیٹ ناکام ہو گئی';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduction = async (id) => {
    try {
      setLoading(true);
      await API.productions.delete(id);
      toast.success('پروڈکشن ڈیلیٹ ہو گئی');
      await fetchProductions();
    } catch (error) {
      const message = error.response?.data?.error || 'ڈیلیٹ ناکام ہو گئی';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  return {
    productions,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    fetchProductions,
    createProduction,
    updateProduction,
    deleteProduction,
  };
}
