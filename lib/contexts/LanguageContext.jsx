'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  ur: {
    // Common
    search: 'تلاش کریں...',
    export: 'ایکسپورٹ',
    save: 'محفوظ کریں',
    cancel: 'منسوخ',
    edit: 'تبدیل کریں',
    delete: 'حذف کریں',
    add: 'شامل کریں',
    loading: 'لوڈ ہو رہا ہے...',
    noData: 'کوئی ڈیٹا موجود نہیں',
    filter: 'فلٹر...',
    page: 'صفحہ',
    of: 'از',
    total: 'کل',
    records: 'ریکارڈ',
    active: 'فعال',
    inactive: 'غیر فعال',
    logout: 'لاگ آؤٹ',
    
    // Header
    systemTitle: 'پروڈکشن رپورٹنگ سسٹم',
    welcome: 'خوش آمدید',
    
    // Roles
    admin: 'ایڈمن',
    supervisor: 'سپروائزر',
    operator: 'آپریٹر',
    
    // Dashboard
    dashboard: 'ڈیش بورڈ',
    adminDashboard: 'ایڈمن ڈیش بورڈ',
    supervisorDashboard: 'سپروائزر ڈیش بورڈ',
    operatorDashboard: 'آپریٹر ڈیش بورڈ',
    
    // Navigation
    productions: 'پروڈکشن',
    machines: 'مشینز',
    users: 'یوزرز',
    reports: 'رپورٹس',
    
    // Production
    productionManagement: 'پروڈکشن مینجمنٹ',
    newProduction: 'نئی پروڈکشن',
    productionRecord: 'پروڈکشن ریکارڈ',
    recentProduction: 'حالیہ پروڈکشن ریکارڈ',
    myProduction: 'میری پروڈکشن',
    allProductions: 'تمام پروڈکشنز',
    date: 'تاریخ',
    machine: 'مشین',
    product: 'پروڈکٹ',
    pieces: 'پیسز',
    weight: 'وزن',
    weightKg: 'وزن (کلو)',
    operator: 'آپریٹر',
    shift: 'شفٹ',
    morning: 'صبح',
    evening: 'شام',
    night: 'رات',
    totalProductions: 'کل پروڈکشن',
    totalWeight: 'کل وزن',
    morningShift: 'صبح شفٹ',
    eveningShift: 'شام شفٹ',
    nightShift: 'رات شفٹ',
    
    // Machine
    machineManagement: 'مشینز مینجمنٹ',
    newMachine: 'نئی مشین',
    machineName: 'مشین نام',
    code: 'کوڈ',
    tonnage: 'ٹنج',
    status: 'اسٹیٹس',
    location: 'لوکیشن',
    totalMachines: 'کل مشینز',
    activeMachines: 'فعال مشینز',
    inactiveMachines: 'غیر فعال',
    
    // Users
    userManagement: 'یوزرز مینجمنٹ',
    allUsers: 'تمام یوزرز',
    userName: 'نام',
    email: 'ای میل',
    role: 'رول',
    
    // Reports
    reportManagement: 'رپورٹ مینجمنٹ',
    dailyReport: 'روزانہ رپورٹ',
    monthlyReport: 'ماہانہ رپورٹ',
    machineReport: 'مشین رپورٹ',
    operatorReport: 'آپریٹر رپورٹ',
    productionSummary: 'پروڈکشن خلاصہ',
    detailedReport: 'تفصیلی رپورٹ',
    selectDateRange: 'تاریخ منتخب کریں',
    selectMachine: 'مشین منتخب کریں',
    selectOperator: 'آپریٹر منتخب کریں',
    generateReport: 'رپورٹ بنائیں',
    from: 'سے',
    to: 'تک',
    viewAll: 'تمام دیکھیں',
    
    // Messages
    confirmDelete: 'کیا آپ واقعی حذف کرنا چاہتے ہیں؟',
    deleteSuccess: 'کامیابی سے حذف ہو گیا',
    saveSuccess: 'کامیابی سے محفوظ ہو گیا',
    updateSuccess: 'کامیابی سے اپڈیٹ ہو گیا',
    error: 'خرابی',
  },
  
  en: {
    // Common
    search: 'Search...',
    export: 'Export',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    loading: 'Loading...',
    noData: 'No data available',
    filter: 'Filter...',
    page: 'Page',
    of: 'of',
    total: 'Total',
    records: 'Records',
    active: 'Active',
    inactive: 'Inactive',
    logout: 'Logout',
    
    // Header
    systemTitle: 'Production Reporting System',
    welcome: 'Welcome',
    
    // Roles
    admin: 'Admin',
    supervisor: 'Supervisor',
    operator: 'Operator',
    
    // Dashboard
    dashboard: 'Dashboard',
    adminDashboard: 'Admin Dashboard',
    supervisorDashboard: 'Supervisor Dashboard',
    operatorDashboard: 'Operator Dashboard',
    
    // Navigation
    productions: 'Productions',
    machines: 'Machines',
    users: 'Users',
    reports: 'Reports',
    
    // Production
    productionManagement: 'Production Management',
    newProduction: 'New Production',
    productionRecord: 'Production Record',
    recentProduction: 'Recent Production Record',
    myProduction: 'My Production',
    allProductions: 'All Productions',
    date: 'Date',
    machine: 'Machine',
    product: 'Product',
    pieces: 'Pieces',
    weight: 'Weight',
    weightKg: 'Weight (Kg)',
    operator: 'Operator',
    shift: 'Shift',
    morning: 'Morning',
    evening: 'Evening',
    night: 'Night',
    totalProductions: 'Total Productions',
    totalWeight: 'Total Weight',
    morningShift: 'Morning Shift',
    eveningShift: 'Evening Shift',
    nightShift: 'Night Shift',
    
    // Machine
    machineManagement: 'Machine Management',
    newMachine: 'New Machine',
    machineName: 'Machine Name',
    code: 'Code',
    tonnage: 'Tonnage',
    status: 'Status',
    location: 'Location',
    totalMachines: 'Total Machines',
    activeMachines: 'Active Machines',
    inactiveMachines: 'Inactive',
    
    // Users
    userManagement: 'User Management',
    allUsers: 'All Users',
    userName: 'Name',
    email: 'Email',
    role: 'Role',
    
    // Reports
    reportManagement: 'Report Management',
    dailyReport: 'Daily Report',
    monthlyReport: 'Monthly Report',
    machineReport: 'Machine Report',
    operatorReport: 'Operator Report',
    productionSummary: 'Production Summary',
    detailedReport: 'Detailed Report',
    selectDateRange: 'Select Date Range',
    selectMachine: 'Select Machine',
    selectOperator: 'Select Operator',
    generateReport: 'Generate Report',
    from: 'From',
    to: 'To',
    viewAll: 'View All',
    
    // Messages
    confirmDelete: 'Are you sure you want to delete?',
    deleteSuccess: 'Deleted successfully',
    saveSuccess: 'Saved successfully',
    updateSuccess: 'Updated successfully',
    error: 'Error',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ur');
  const [dir, setDir] = useState('rtl');

  useEffect(() => {
    // Load from localStorage
    const savedLang = localStorage.getItem('language') || 'ur';
    setLanguage(savedLang);
    setDir(savedLang === 'ur' ? 'rtl' : 'ltr');
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setDir(lang === 'ur' ? 'rtl' : 'ltr');
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, dir }}>
      <div dir={dir}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
