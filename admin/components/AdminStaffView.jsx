import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  UserMinus,
  CalendarCheck,
  Search,
  Plus,
  X,
  Edit2,
  Trash2,
  MoreHorizontal,
  KeyRound,
  FileText,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Download,
  Upload,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Briefcase,
  User,
  BadgeCheck,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';
import ExportDropdown from './ExportDropdown';
import './AdminStaffView.css';

export const initialStaffData = [];

const AdminStaffView = () => {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState(() => {
    try {
      const saved = localStorage.getItem('dzire_staff_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialStaffData;
  });

  const fetchStaff = async () => {
    try {
      const res = await fetch("https://dzire-backend.onrender.com/api/admin/staff");
      const json = await res.json();
      if (json.success && Array.isArray(json.staff)) {
        setStaffList(json.staff);
        try {
          localStorage.setItem('dzire_staff_list', JSON.stringify(json.staff));
        } catch (e) { }
      }
    } catch (err) {
      console.error("Failed to load staff list:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const syncAndSetStaffList = (updater) => {
    setStaffList(prev => {
      const nextList = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem('dzire_staff_list', JSON.stringify(nextList));
      } catch (e) {
        console.error(e);
      }
      return nextList;
    });
  };

  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [selectedTab, setSelectedTab] = useState('All'); // 'All' | 'Active' | 'Inactive'
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [storeFilter, setStoreFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [drawerTab, setDrawerTab] = useState('Overview'); // 'Overview' | 'Attendance' | 'Salary' | 'Roles & Permissions' | 'Documents'
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSectionEditModalOpen, setIsSectionEditModalOpen] = useState(false);
  const [editSectionType, setEditSectionType] = useState('basic'); // 'basic' | 'salary' | 'roles'
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);

  useEffect(() => {
    const handleOutsideClick = () => setActionMenuOpenId(null);
    if (actionMenuOpenId !== null) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [actionMenuOpenId]);

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    role: 'Sales Associate',
    phone: '',
    email: '',
    joinDate: '1 Oct 2026',
    doj: '2026-10-01',
    dob: '1998-01-01',
    gender: 'Male', // 'Male' | 'Female' | 'Other'
    maritalStatus: 'Single', // 'Single' | 'Married'
    aadharCard: '',
    aadharFile: null,
    aadharFileName: '',
    aadharFileSize: '',
    panCard: '',
    panFile: null,
    panFileName: '',
    panFileSize: '',
    previousExperience: '',
    status: 'Active',
    store: 'Offline',
    address: '',
    basicSalary: 20000,
    salaryType: 'Monthly',
    paymentDay: '5th of every month',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    accountHolderName: '',
    bankBranch: '',
    pfEsic: 'Applicable',
    permissions: ['Sales', 'POS'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  const aadharFileInputRef = useRef(null);
  const panFileInputRef = useRef(null);

  const handleAadharFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      const res = await fetch("https://dzire-backend.onrender.com/api/admin/staff/upload", {
        method: "POST",
        body: uploadFormData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          aadharFile: data.fileUrl || data.url,
          aadharFileName: data.filename || file.name,
          aadharFileSize: data.size || `${Math.round(file.size / 1024)} KB`
        }));
        showToast("Aadhaar Card uploaded successfully!");
      } else {
        alert(data.message || "Failed to upload Aadhaar card");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading Aadhaar file");
    }
  };

  const handleRemoveAadharFile = () => {
    setFormData(prev => ({
      ...prev,
      aadharFile: null,
      aadharFileName: '',
      aadharFileSize: ''
    }));
    if (aadharFileInputRef.current) {
      aadharFileInputRef.current.value = '';
    }
  };

  const handlePanFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      const res = await fetch("https://dzire-backend.onrender.com/api/admin/staff/upload", {
        method: "POST",
        body: uploadFormData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          panFile: data.fileUrl || data.url,
          panFileName: data.filename || file.name,
          panFileSize: data.size || `${Math.round(file.size / 1024)} KB`
        }));
        showToast("PAN Card uploaded successfully!");
      } else {
        alert(data.message || "Failed to upload PAN card");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading PAN file");
    }
  };

  const handleRemovePanFile = () => {
    setFormData(prev => ({
      ...prev,
      panFile: null,
      panFileName: '',
      panFileSize: ''
    }));
    if (panFileInputRef.current) {
      panFileInputRef.current.value = '';
    }
  };

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
    sendEmail: true
  });

  // Selected staff object
  const selectedStaff = useMemo(() => {
    return staffList.find(s => s.id === selectedStaffId) || staffList[0];
  }, [staffList, selectedStaffId]);

  // KPI Calculations
  const stats = useMemo(() => {
    const total = staffList.length;
    const active = staffList.filter(s => s.status === 'Active').length;
    const inactive = staffList.filter(s => s.status === 'Inactive').length;
    const onLeave = 0; // Hardcoded or calculated
    const avgAttendance = '92%';
    return { total, active, inactive, onLeave, avgAttendance };
  }, [staffList]);

  // Filtering
  const filteredStaff = useMemo(() => {
    return staffList.filter(staff => {
      // Tab Filter
      if (selectedTab === 'Active' && staff.status !== 'Active') return false;
      if (selectedTab === 'Inactive' && staff.status !== 'Inactive') return false;

      // Status Filter
      if (statusFilter !== 'All' && staff.status !== statusFilter) return false;

      // Role Filter
      if (roleFilter !== 'All' && staff.role !== roleFilter) return false;

      // Store Filter
      if (storeFilter !== 'All' && staff.store !== storeFilter) return false;

      // Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = staff.name.toLowerCase().includes(q);
        const matchRole = staff.role.toLowerCase().includes(q);
        const matchPhone = staff.phone.toLowerCase().includes(q);
        const matchEmail = staff.email.toLowerCase().includes(q);
        if (!matchName && !matchRole && !matchPhone && !matchEmail) return false;
      }

      return true;
    });
  }, [staffList, selectedTab, statusFilter, roleFilter, storeFilter, searchQuery]);

  // Handlers
  const handleSelectStaff = (staff) => {
    setSelectedStaffId(staff.id);
    setSelectedIds([staff.id]);
    setIsDrawerOpen(true);
  };

  const toggleSelectRow = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStaff.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStaff.map(s => s.id));
    }
  };

  const handleToggleStatus = async (staffId) => {
    const staff = staffList.find(s => s.id === staffId);
    if (!staff) return;
    const newStatus = staff.status === 'Active' ? 'Inactive' : 'Active';
    const newRate = newStatus === 'Active' ? '90%' : '—';

    try {
      await fetch(`https://dzire-backend.onrender.com/api/admin/staff/${staffId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, attendanceRate: newRate })
      });
    } catch (e) {
      console.error(e);
    }

    setStaffList(prev => {
      const updated = prev.map(s => {
        if (s.id === staffId) {
          showToast(`Staff member "${s.name}" is now ${newStatus}`);
          return {
            ...s,
            status: newStatus,
            attendanceRate: newRate
          };
        }
        return s;
      });
      try {
        localStorage.setItem('dzire_staff_list', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleDeleteStaff = async (staffToDelete) => {
    if (!staffToDelete) return;
    const confirmDelete = window.confirm(`Are you sure you want to delete staff member "${staffToDelete.name}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      await fetch(`https://dzire-backend.onrender.com/api/admin/staff/${staffToDelete.id}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.error(e);
    }

    setStaffList(prev => {
      const updated = prev.filter(s => s.id !== staffToDelete.id);
      try {
        localStorage.setItem('dzire_staff_list', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    setSelectedIds(prev => prev.filter(id => id !== staffToDelete.id));
    if (selectedStaffId === staffToDelete.id) {
      setSelectedStaffId(null);
    }
    showToast(`Staff member "${staffToDelete.name}" deleted successfully.`);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedIds.length} selected staff member(s)?`);
    if (!confirmDelete) return;

    try {
      await fetch('https://dzire-backend.onrender.com/api/admin/staff/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });
    } catch (e) {
      console.error(e);
    }

    setStaffList(prev => {
      const updated = prev.filter(s => !selectedIds.includes(s.id));
      try {
        localStorage.setItem('dzire_staff_list', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    showToast(`${selectedIds.length} staff member(s) deleted successfully.`);
    setSelectedIds([]);
  };

  const handleOpenAddModal = () => {
    setFormData({
      id: null,
      name: '',
      role: 'Sales Associate',
      phone: '+91 ',
      email: '',
      joinDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      doj: new Date().toISOString().split('T')[0],
      dob: '1998-01-01',
      gender: 'Male',
      maritalStatus: 'Single',
      aadharCard: '',
      aadharFile: null,
      aadharFileName: '',
      aadharFileSize: '',
      panCard: '',
      panFile: null,
      panFileName: '',
      panFileSize: '',
      previousExperience: '',
      status: 'Active',
      store: 'Offline',
      address: '',
      basicSalary: 20000,
      salaryType: 'Monthly',
      paymentDay: '5th of every month',
      bankName: '',
      accountNumber: '',
      ifsc: '',
      accountHolderName: '',
      bankBranch: '',
      pfEsic: 'Applicable',
      permissions: ['Sales', 'POS'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });
    if (aadharFileInputRef.current) aadharFileInputRef.current.value = '';
    if (panFileInputRef.current) panFileInputRef.current.value = '';
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (staff) => {
    setFormData({
      id: staff.id,
      name: staff.name,
      role: staff.role,
      phone: staff.phone,
      email: staff.email,
      joinDate: staff.joinDate || staff.doj || '',
      doj: staff.doj || (staff.joinDate ? (new Date(staff.joinDate).toString() !== 'Invalid Date' ? new Date(staff.joinDate).toISOString().split('T')[0] : '') : ''),
      dob: staff.dob || '',
      gender: staff.gender || 'Male',
      maritalStatus: staff.maritalStatus || 'Single',
      aadharCard: staff.aadharCard || '',
      aadharFile: staff.aadharFile || null,
      aadharFileName: staff.aadharFileName || '',
      aadharFileSize: staff.aadharFileSize || '',
      panCard: staff.panCard || '',
      panFile: staff.panFile || null,
      panFileName: staff.panFileName || '',
      panFileSize: staff.panFileSize || '',
      previousExperience: staff.previousExperience || '',
      status: staff.status,
      store: staff.store || 'Offline',
      address: staff.address || '',
      basicSalary: staff.salary?.numericBasic || 20000,
      salaryType: staff.salary?.type || 'Monthly',
      paymentDay: staff.salary?.paymentDay || '5th of every month',
      bankName: staff.salary?.bankName || '',
      accountNumber: staff.salary?.accountNumber || '',
      ifsc: staff.salary?.ifsc || '',
      accountHolderName: staff.salary?.accountHolderName || '',
      bankBranch: staff.salary?.bankBranch || '',
      pfEsic: staff.salary?.pfEsic || 'Applicable',
      permissions: [...(staff.permissions || [])],
      avatar: staff.avatar
    });
    if (aadharFileInputRef.current) aadharFileInputRef.current.value = '';
    if (panFileInputRef.current) panFileInputRef.current.value = '';
    setIsEditModalOpen(true);
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert('Please fill in all required fields (Name, Email, Phone)');
      return;
    }

    const formattedJoinDate = formData.doj
      ? new Date(formData.doj).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : formData.joinDate;

    const hasBankInfo = Boolean(formData.bankName?.trim() || formData.accountNumber?.trim());

    if (formData.id) {
      // Edit
      const existing = staffList.find(s => s.id === formData.id) || {};
      const payload = {
        name: formData.name,
        role: formData.role,
        phone: formData.phone,
        email: formData.email,
        joinDate: formattedJoinDate,
        doj: formData.doj || existing.doj,
        dob: formData.dob || existing.dob,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        aadharCard: formData.aadharCard,
        aadharFile: formData.aadharFile !== undefined ? formData.aadharFile : existing.aadharFile,
        aadharFileName: formData.aadharFileName || existing.aadharFileName || '',
        aadharFileSize: formData.aadharFileSize || existing.aadharFileSize || '',
        panCard: formData.panCard,
        panFile: formData.panFile !== undefined ? formData.panFile : existing.panFile,
        panFileName: formData.panFileName || existing.panFileName || '',
        panFileSize: formData.panFileSize || existing.panFileSize || '',
        previousExperience: formData.previousExperience,
        status: formData.status,
        store: formData.store,
        address: formData.address,
        permissions: formData.permissions,
        avatar: formData.avatar,
        salary: {
          ...existing.salary,
          type: formData.salaryType,
          basic: `₹${Number(formData.basicSalary).toLocaleString('en-IN')}`,
          numericBasic: Number(formData.basicSalary),
          paymentDay: formData.paymentDay,
          bankName: formData.bankName || '',
          accountNumber: formData.accountNumber || '',
          bankAccount: hasBankInfo
            ? `${formData.bankName ? formData.bankName.split(' ')[0] : 'Bank'} **** ${formData.accountNumber ? formData.accountNumber.slice(-4) : '0000'}`
            : '',
          ifsc: formData.ifsc || '',
          accountHolderName: formData.accountHolderName || '',
          bankBranch: formData.bankBranch || '',
          pfEsic: formData.pfEsic
        },
        documents: [
          (formData.aadharFile || formData.aadharFileName || formData.aadharCard) ? {
            name: formData.aadharFileName || `Aadhaar Card (${(formData.aadharCard || '').slice(-4) || 'Doc'}).pdf`,
            size: formData.aadharFileSize || '1.2 MB',
            type: (formData.aadharFileName?.toLowerCase().endsWith('.png') || formData.aadharFileName?.toLowerCase().endsWith('.jpg') || formData.aadharFileName?.toLowerCase().endsWith('.jpeg')) ? 'IMG' : 'PDF',
            fileUrl: formData.aadharFile
          } : null,
          (formData.panFile || formData.panFileName || formData.panCard) ? {
            name: formData.panFileName || `PAN Card (${formData.panCard || 'Doc'}).pdf`,
            size: formData.panFileSize || '650 KB',
            type: (formData.panFileName?.toLowerCase().endsWith('.png') || formData.panFileName?.toLowerCase().endsWith('.jpg') || formData.panFileName?.toLowerCase().endsWith('.jpeg')) ? 'IMG' : 'PDF',
            fileUrl: formData.panFile
          } : null,
          { name: 'Offer Letter.pdf', size: '800 KB', type: 'PDF' }
        ].filter(Boolean)
      };

      try {
        const res = await fetch(`https://dzire-backend.onrender.com/api/admin/staff/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        const updatedStaff = (data.success && data.staff) ? data.staff : { ...existing, ...payload };
        setStaffList(prev => prev.map(s => s.id === formData.id ? updatedStaff : s));
      } catch (err) {
        console.error(err);
        setStaffList(prev => prev.map(s => s.id === formData.id ? { ...s, ...payload } : s));
      }
      showToast(`Staff member "${formData.name}" updated successfully!`);
    } else {
      // Add
      const newStaff = {
        id: Date.now(),
        name: formData.name,
        role: formData.role,
        phone: formData.phone,
        email: formData.email,
        joinDate: formattedJoinDate,
        doj: formData.doj || new Date().toISOString().split('T')[0],
        dob: formData.dob || '',
        gender: formData.gender || 'Male',
        maritalStatus: formData.maritalStatus || 'Single',
        aadharCard: formData.aadharCard || '',
        aadharFile: formData.aadharFile || null,
        aadharFileName: formData.aadharFileName || '',
        aadharFileSize: formData.aadharFileSize || '',
        panCard: formData.panCard || '',
        panFile: formData.panFile || null,
        panFileName: formData.panFileName || '',
        panFileSize: formData.panFileSize || '',
        previousExperience: formData.previousExperience || '',
        status: formData.status || 'Active',
        attendanceRate: '92%',
        avatar: formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        store: formData.store || 'Offline',
        address: formData.address || 'Staff Quarter, Pune',
        attendance: {
          present: 0,
          absent: 0,
          onLeave: 0,
          halfDay: 0
        },
        salary: {
          type: formData.salaryType || 'Monthly',
          basic: `₹${Number(formData.basicSalary).toLocaleString('en-IN')}`,
          numericBasic: Number(formData.basicSalary),
          startDate: formattedJoinDate,
          paymentDay: formData.paymentDay || '5th of every month',
          bankName: formData.bankName || '',
          accountNumber: formData.accountNumber || '',
          bankAccount: hasBankInfo
            ? `${formData.bankName ? formData.bankName.split(' ')[0] : 'Bank'} **** ${formData.accountNumber ? formData.accountNumber.slice(-4) : '0000'}`
            : '',
          ifsc: formData.ifsc || '',
          accountHolderName: formData.accountHolderName || '',
          bankBranch: formData.bankBranch || '',
          pfEsic: formData.pfEsic || 'Applicable'
        },
        permissions: formData.permissions || ['Sales', 'POS'],
        documents: [
          (formData.aadharFile || formData.aadharFileName || formData.aadharCard) ? {
            name: formData.aadharFileName || `Aadhaar Card (${(formData.aadharCard || '').slice(-4) || 'Doc'}).pdf`,
            size: formData.aadharFileSize || '1.2 MB',
            type: (formData.aadharFileName?.toLowerCase().endsWith('.png') || formData.aadharFileName?.toLowerCase().endsWith('.jpg') || formData.aadharFileName?.toLowerCase().endsWith('.jpeg')) ? 'IMG' : 'PDF',
            fileUrl: formData.aadharFile
          } : null,
          (formData.panFile || formData.panFileName || formData.panCard) ? {
            name: formData.panFileName || `PAN Card (${formData.panCard || 'Doc'}).pdf`,
            size: formData.panFileSize || '650 KB',
            type: (formData.panFileName?.toLowerCase().endsWith('.png') || formData.panFileName?.toLowerCase().endsWith('.jpg') || formData.panFileName?.toLowerCase().endsWith('.jpeg')) ? 'IMG' : 'PDF',
            fileUrl: formData.panFile
          } : null,
          { name: 'Offer Letter.pdf', size: '800 KB', type: 'PDF' }
        ].filter(Boolean)
      };

      try {
        const res = await fetch('https://dzire-backend.onrender.com/api/admin/staff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStaff)
        });
        const data = await res.json();
        const savedStaff = (data.success && data.staff) ? data.staff : newStaff;
        setStaffList(prev => [savedStaff, ...prev]);
        setSelectedStaffId(savedStaff.id);
      } catch (err) {
        console.error(err);
        setStaffList(prev => [newStaff, ...prev]);
        setSelectedStaffId(newStaff.id);
      }
      showToast(`New staff member "${newStaff.name}" added successfully!`);
    }

    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleOpenSectionEdit = (type) => {
    if (!selectedStaff) return;
    setEditSectionType(type);
    setFormData({
      id: selectedStaff.id,
      name: selectedStaff.name,
      role: selectedStaff.role,
      phone: selectedStaff.phone,
      email: selectedStaff.email,
      joinDate: selectedStaff.joinDate,
      status: selectedStaff.status,
      store: selectedStaff.store || 'Pune Store',
      address: selectedStaff.address || '',
      basicSalary: selectedStaff.salary?.numericBasic || 20000,
      salaryType: selectedStaff.salary?.type || 'Monthly',
      paymentDay: selectedStaff.salary?.paymentDay || '5th of every month',
      bankName: selectedStaff.salary?.bankName || '',
      accountNumber: selectedStaff.salary?.accountNumber || '',
      ifsc: selectedStaff.salary?.ifsc || '',
      pfEsic: selectedStaff.salary?.pfEsic || 'Applicable',
      permissions: [...(selectedStaff.permissions || [])],
      avatar: selectedStaff.avatar
    });
    setIsSectionEditModalOpen(true);
  };

  const handleSaveSectionEdit = async (e) => {
    e.preventDefault();
    if (!selectedStaff) return;

    let updatePayload = {};
    if (editSectionType === 'basic') {
      updatePayload = {
        name: formData.name,
        role: formData.role,
        phone: formData.phone,
        email: formData.email,
        joinDate: formData.joinDate,
        store: formData.store,
        address: formData.address
      };
    } else if (editSectionType === 'salary') {
      const hasBankInfo = Boolean(formData.bankName?.trim() || formData.accountNumber?.trim());
      updatePayload = {
        salary: {
          ...selectedStaff.salary,
          type: formData.salaryType,
          basic: `₹${Number(formData.basicSalary).toLocaleString('en-IN')}`,
          numericBasic: Number(formData.basicSalary),
          paymentDay: formData.paymentDay,
          bankName: formData.bankName || '',
          accountNumber: formData.accountNumber || '',
          bankAccount: hasBankInfo
            ? `${formData.bankName ? formData.bankName.split(' ')[0] : 'Bank'} **** ${formData.accountNumber ? formData.accountNumber.slice(-4) : '0000'}`
            : '',
          ifsc: formData.ifsc || '',
          pfEsic: formData.pfEsic
        }
      };
    } else if (editSectionType === 'roles') {
      updatePayload = {
        permissions: formData.permissions
      };
    }

    try {
      const res = await fetch(`https://dzire-backend.onrender.com/api/admin/staff/${selectedStaff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });
      const data = await res.json();
      if (data.success && data.staff) {
        setStaffList(prev => prev.map(s => s.id === selectedStaff.id ? data.staff : s));
      } else {
        setStaffList(prev => prev.map(s => s.id === selectedStaff.id ? { ...s, ...updatePayload } : s));
      }
    } catch (err) {
      console.error(err);
      setStaffList(prev => prev.map(s => s.id === selectedStaff.id ? { ...s, ...updatePayload } : s));
    }

    showToast('Staff details updated successfully!');
    setIsSectionEditModalOpen(false);
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.newPassword) {
      alert('Please enter a password');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (selectedStaff) {
      try {
        await fetch(`https://dzire-backend.onrender.com/api/admin/staff/${selectedStaff.id}/password-reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(passwordForm)
        });
      } catch (e) {
        console.error(e);
      }
    }

    showToast(`Password reset successfully for ${selectedStaff?.name}!`);
    setIsPasswordModalOpen(false);
    setPasswordForm({ newPassword: '', confirmPassword: '', sendEmail: true });
  };

  const handleExport = (format) => {
    showToast(`Exporting staff records as ${format.toUpperCase()}...`);
  };

  const handleUploadDocument = async (e) => {
    const file = e.target.files?.[0];
    if (file && selectedStaff) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        const uploadRes = await fetch("https://dzire-backend.onrender.com/api/admin/staff/upload", {
          method: "POST",
          body: uploadFormData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          const newDoc = {
            name: uploadData.filename || file.name,
            size: uploadData.size || `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            type: (file.name.toLowerCase().endsWith('.png') || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) ? 'IMG' : 'PDF',
            fileUrl: uploadData.fileUrl || uploadData.url
          };
          const updatedDocs = [...(selectedStaff.documents || []), newDoc];

          await fetch(`https://dzire-backend.onrender.com/api/admin/staff/${selectedStaff.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documents: updatedDocs })
          });

          setStaffList(prev => prev.map(s => {
            if (s.id === selectedStaff.id) {
              return {
                ...s,
                documents: updatedDocs
              };
            }
            return s;
          }));
          showToast(`Document "${file.name}" uploaded successfully!`);
        }
      } catch (err) {
        console.error(err);
        showToast("Failed to upload document");
      }
    }
  };

  const togglePermission = (perm) => {
    setFormData(prev => {
      const exists = prev.permissions.includes(perm);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter(p => p !== perm)
          : [...prev.permissions, perm]
      };
    });
  };

  return (
    <div className="staff-view-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="staff-toast">
          <Check size={16} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="staff-header">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            Staff Management
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
            Manage your store team, attendance, roles and salaries.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="staff-header-btn"
        >
          <Plus size={16} />
          <span>Add Staff</span>
        </button>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="staff-stats-grid">
        {/* Card 1: Total Staff */}
        <div className="staff-stat-card">
          <div style={{ width: '42px', height: '42px', minWidth: '42px', borderRadius: '10px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontWeight: '500' }}>
              Total Staff
            </div>
          </div>
        </div>

        {/* Card 2: Active */}
        <div className="staff-stat-card">
          <div style={{ width: '42px', height: '42px', minWidth: '42px', borderRadius: '10px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
            <UserCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
              {stats.active}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontWeight: '500' }}>
              Active
            </div>
          </div>
        </div>

        {/* Card 3: Inactive */}
        <div className="staff-stat-card">
          <div style={{ width: '42px', height: '42px', minWidth: '42px', borderRadius: '10px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
            <UserX size={20} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
              {stats.inactive}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontWeight: '500' }}>
              Inactive
            </div>
          </div>
        </div>

        {/* Card 4: On Leave Today */}
        <div className="staff-stat-card">
          <div style={{ width: '42px', height: '42px', minWidth: '42px', borderRadius: '10px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
            <UserMinus size={20} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
              {stats.onLeave}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontWeight: '500' }}>
              On Leave Today
            </div>
          </div>
        </div>

        {/* Card 5: Avg Attendance */}
        <div className="staff-stat-card">
          <div style={{ width: '42px', height: '42px', minWidth: '42px', borderRadius: '10px', backgroundColor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
            <CalendarCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
              {stats.avgAttendance}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontWeight: '500' }}>
              Avg. Attendance (This Month)
            </div>
          </div>
        </div>
      </div>

      {/* Main Staff Master Table Card */}
      <div className="staff-card-main">
        {/* Filter Tabs */}
        <div className="staff-tabs-bar">
          {[
            { id: 'All', label: `All Staff (${stats.total})` },
            { id: 'Active', label: `Active (${stats.active})` },
            { id: 'Inactive', label: `Inactive (${stats.inactive})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: selectedTab === tab.id ? '2px solid #ff6600' : '2px solid transparent',
                padding: '14px 4px',
                fontSize: '13.5px',
                fontWeight: selectedTab === tab.id ? '700' : '500',
                color: selectedTab === tab.id ? '#ff6600' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="staff-toolbar">
          {/* Search Input */}
          <div className="staff-search-wrap">
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by name, role or phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '38px',
                padding: '0 12px 0 36px',
                fontSize: '13px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                outline: 'none',
                color: '#1e293b',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Dropdowns */}
          <div className="staff-filters-wrap">
            {/* Role */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Role</span>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                style={{
                  padding: '7px 10px',
                  fontSize: '12.5px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All</option>
                <option value="Store Manager">Store Manager</option>
                <option value="Sales Associate">Sales Associate</option>
                <option value="Cashier">Cashier</option>
                <option value="Inventory Executive">Inventory Executive</option>
                <option value="Marketing Associate">Marketing Associate</option>
                <option value="Part-time (Weekend)">Part-time</option>
              </select>
            </div>

            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Status</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  padding: '7px 10px',
                  fontSize: '12.5px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Store */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Store</span>
              <select
                value={storeFilter}
                onChange={e => setStoreFilter(e.target.value)}
                style={{
                  padding: '7px 10px',
                  fontSize: '12.5px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            {/* Bulk Delete Button if items selected */}
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  color: '#dc2626',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecdd3',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fee2e2'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
              >
                <Trash2 size={13} color="#dc2626" />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
            )}

            {/* Export Button */}
            <ExportDropdown onExport={handleExport} />
          </div>
        </div>

        {/* Table */}
        <div className="staff-table-wrap">
          <table className="staff-table">
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', fontSize: '12px', fontWeight: '600', color: '#64748b', backgroundColor: '#fafbfc' }}>
                <th style={{ padding: '12px 16px', width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredStaff.length && filteredStaff.length > 0}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer', accentColor: '#ff6600' }}
                  />
                </th>
                <th style={{ padding: '12px 14px', minWidth: '160px' }}>Name</th>
                <th style={{ padding: '12px 14px', minWidth: '130px' }}>Role</th>
                <th style={{ padding: '12px 14px', minWidth: '120px' }}>Phone</th>
                <th style={{ padding: '12px 14px', minWidth: '160px' }}>Email</th>
                <th style={{ padding: '12px 14px', minWidth: '100px' }}>Join Date</th>
                <th style={{ padding: '12px 14px', minWidth: '90px' }}>Status</th>
                <th style={{ padding: '12px 14px', minWidth: '120px' }}>Attendance <br /><span style={{ fontSize: '10px', fontWeight: 'normal', color: '#94a3b8' }}>(This Month)</span></th>
                <th style={{ padding: '12px 16px', minWidth: '80px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '14px' }}>
                    No staff members match the current filters.
                  </td>
                </tr>
              ) : (
                filteredStaff.map(staff => {
                  const isSelected = selectedStaffId === staff.id;
                  const isChecked = selectedIds.includes(staff.id);

                  return (
                    <tr
                      key={staff.id}
                      onClick={() => navigate(`/admin/staff/${staff.id}`)}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectRow(staff.id)}
                          style={{ cursor: 'pointer', accentColor: '#ff6600' }}
                        />
                      </td>

                      {/* Name & Avatar */}
                      <td style={{ padding: '12px 14px' }}>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/staff/${staff.id}`);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                          title="Click to view & edit full profile"
                        >
                          <img
                            src={staff.avatar}
                            alt={staff.name}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '1px solid #e2e8f0'
                            }}
                          />
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '700',
                              color: '#0f172a',
                              transition: 'color 0.15s ease'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.color = '#ff6600';
                              e.currentTarget.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.color = '#0f172a';
                              e.currentTarget.style.textDecoration = 'none';
                            }}
                          >
                            {staff.name}
                          </span>
                        </div>
                      </td>

                      {/* Role */}
                      <td style={{ padding: '12px 14px', fontSize: '12.5px', color: '#475569' }}>
                        {staff.role}
                      </td>

                      {/* Phone */}
                      <td style={{ padding: '12px 14px', fontSize: '12.5px', color: '#475569' }}>
                        {staff.phone}
                      </td>

                      {/* Email */}
                      <td style={{ padding: '12px 14px', fontSize: '12.5px', color: '#475569' }}>
                        {staff.email}
                      </td>

                      {/* Join Date */}
                      <td style={{ padding: '12px 14px', fontSize: '12.5px', color: '#475569', whiteSpace: 'nowrap' }}>
                        {staff.joinDate}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '11.5px',
                          fontWeight: '600',
                          backgroundColor: staff.status === 'Active' ? '#dcfce7' : '#fee2e2',
                          color: staff.status === 'Active' ? '#15803d' : '#b91c1c'
                        }}>
                          {staff.status}
                        </span>
                      </td>

                      {/* Attendance */}
                      <td style={{ padding: '12px 14px', fontSize: '12.5px', fontWeight: '600', color: staff.attendanceRate !== '—' ? '#0f172a' : '#94a3b8' }}>
                        {staff.attendanceRate}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 16px', textAlign: 'center', position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setActionMenuOpenId(actionMenuOpenId === staff.id ? null : staff.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px'
                          }}
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {/* Action Dropdown Menu */}
                        {actionMenuOpenId === staff.id && (
                          <div style={{
                            position: 'absolute',
                            right: '16px',
                            top: '36px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                            zIndex: 50,
                            minWidth: '175px',
                            padding: '6px 0',
                            textAlign: 'left'
                          }}>
                            <button
                              onClick={() => {
                                navigate(`/admin/staff/${staff.id}`);
                                setActionMenuOpenId(null);
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 14px',
                                background: 'none',
                                border: 'none',
                                fontSize: '12.5px',
                                color: '#ff6600',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff7ed'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Eye size={13} />
                              <span>View & Edit Profile</span>
                            </button>

                            <button
                              onClick={() => {
                                handleOpenEditModal(staff);
                                setActionMenuOpenId(null);
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 14px',
                                background: 'none',
                                border: 'none',
                                fontSize: '12.5px',
                                color: '#334155',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Edit2 size={13} />
                              <span>Quick Edit</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedStaffId(staff.id);
                                setIsPasswordModalOpen(true);
                                setActionMenuOpenId(null);
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 14px',
                                background: 'none',
                                border: 'none',
                                fontSize: '12.5px',
                                color: '#334155',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <KeyRound size={13} />
                              <span>Reset Password</span>
                            </button>

                            <button
                              onClick={() => {
                                handleToggleStatus(staff.id);
                                setActionMenuOpenId(null);
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 14px',
                                background: 'none',
                                border: 'none',
                                fontSize: '12.5px',
                                color: staff.status === 'Active' ? '#f59e0b' : '#22c55e',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <AlertCircle size={13} />
                              <span>{staff.status === 'Active' ? 'Deactivate Staff' : 'Activate Staff'}</span>
                            </button>

                            <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }} />

                            <button
                              onClick={() => {
                                handleDeleteStaff(staff);
                                setActionMenuOpenId(null);
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 14px',
                                background: 'none',
                                border: 'none',
                                fontSize: '12.5px',
                                color: '#dc2626',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Trash2 size={13} color="#dc2626" />
                              <span>Delete Staff</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="staff-pagination">
          <div style={{ fontSize: '12.5px', color: '#64748b' }}>
            Showing 1-{filteredStaff.length} of {filteredStaff.length} staff
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                disabled
                style={{
                  width: '28px',
                  height: '28px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'not-allowed'
                }}
              >
                <ChevronLeft size={14} />
              </button>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: '1px solid #ff6600',
                backgroundColor: '#ffffff',
                color: '#ff6600',
                fontSize: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                1
              </div>
              <button
                disabled
                style={{
                  width: '28px',
                  height: '28px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'not-allowed'
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <select
              style={{
                padding: '5px 8px',
                fontSize: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                color: '#475569',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* MODAL 1: Add / Edit Staff Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div
          onClick={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
          }}
          className="staff-modal-overlay"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="staff-modal-box"
          >
            {/* Modal Header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafbfc' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                  {isEditModalOpen ? 'Edit Staff Member' : 'Add New Staff Member'}
                </h2>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                  Enter personal, KYC, employment, experience & bank details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveStaff} style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* SECTION 1: Personal Details */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <User size={16} color="#ff6600" />
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    1. Personal Information
                  </span>
                </div>

                <div className="staff-modal-grid-2" style={{ marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                      Full Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patil"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                      Designation / Role <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff', cursor: 'pointer' }}
                    >
                      <option value="Store Manager">Store Manager</option>
                      <option value="Sales Associate">Sales Associate</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Inventory Executive">Inventory Executive</option>
                      <option value="Marketing Associate">Marketing Associate</option>
                      <option value="Part-time (Weekend)">Part-time (Weekend)</option>
                    </select>
                  </div>
                </div>

                <div className="staff-modal-grid-3" style={{ marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                      Gender (लिंग) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={formData.gender || 'Male'}
                      onChange={e => setFormData({ ...formData, gender: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff', cursor: 'pointer' }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                      Marital Status <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={formData.maritalStatus || 'Single'}
                      onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff', cursor: 'pointer' }}
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                      Date of Birth (DOB) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dob || ''}
                      onChange={e => setFormData({ ...formData, dob: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff' }}
                    />
                  </div>
                </div>

                <div className="staff-modal-grid-2">
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                      Phone Number <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                      Email Address <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ramesh@dzire.in"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Identity & KYC Documents */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} color="#ff6600" />
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      2. Identity & KYC Documents
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Enter numbers & upload copies</span>
                </div>

                <div className="staff-modal-grid-2">
                  {/* Aadhaar Card Box */}
                  <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
                        Aadhaar Card (आधार कार्ड)
                      </label>
                      {formData.aadharFileName && (
                        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <CheckCircle2 size={13} /> Uploaded
                        </span>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        maxLength={14}
                        placeholder="e.g. 4582 9182 3410"
                        value={formData.aadharCard || ''}
                        onChange={e => setFormData({ ...formData, aadharCard: e.target.value })}
                        style={{ width: '100%', padding: '8px 11px', fontSize: '12.5px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', letterSpacing: '0.04em', backgroundColor: '#ffffff' }}
                      />
                      <span style={{ fontSize: '10.5px', color: '#64748b', marginTop: '3px', display: 'block' }}>12-digit Indian Aadhaar number</span>
                    </div>

                    {/* Aadhaar Upload Box */}
                    <input
                      ref={aadharFileInputRef}
                      type="file"
                      accept=".pdf,image/*,.png,.jpg,.jpeg"
                      onChange={handleAadharFileSelect}
                      style={{ display: 'none' }}
                    />

                    {!formData.aadharFileName ? (
                      <div
                        onClick={() => aadharFileInputRef.current?.click()}
                        style={{
                          border: '1.5px dashed #cbd5e1',
                          borderRadius: '8px',
                          padding: '12px 10px',
                          textAlign: 'center',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff6600'; e.currentTarget.style.backgroundColor = '#fff7ed'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#ffffff'; }}
                      >
                        <UploadCloud size={22} color="#ff6600" />
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>
                          Upload Aadhaar Card
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                          PDF, PNG, JPG (Max 10MB)
                        </span>
                      </div>
                    ) : (
                      <div style={{
                        padding: '10px 12px',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                          <FileText size={18} color="#16a34a" style={{ flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#14532d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }} title={formData.aadharFileName}>
                              {formData.aadharFileName}
                            </div>
                            <div style={{ fontSize: '10.5px', color: '#15803d' }}>
                              {formData.aadharFileSize || 'Document attached'}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={() => aadharFileInputRef.current?.click()}
                            style={{ padding: '3px 7px', fontSize: '11px', fontWeight: '600', color: '#166534', backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveAadharFile}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '3px', display: 'flex' }}
                            title="Remove Aadhaar file"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PAN Card Box */}
                  <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
                        PAN Card (पैन कार्ड)
                      </label>
                      {formData.panFileName && (
                        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <CheckCircle2 size={13} /> Uploaded
                        </span>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="e.g. ABCDE1234F"
                        value={formData.panCard || ''}
                        onChange={e => setFormData({ ...formData, panCard: e.target.value.toUpperCase() })}
                        style={{ width: '100%', padding: '8px 11px', fontSize: '12.5px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: '#ffffff' }}
                      />
                      <span style={{ fontSize: '10.5px', color: '#64748b', marginTop: '3px', display: 'block' }}>10-digit Permanent Account Number</span>
                    </div>

                    {/* PAN Upload Box */}
                    <input
                      ref={panFileInputRef}
                      type="file"
                      accept=".pdf,image/*,.png,.jpg,.jpeg"
                      onChange={handlePanFileSelect}
                      style={{ display: 'none' }}
                    />

                    {!formData.panFileName ? (
                      <div
                        onClick={() => panFileInputRef.current?.click()}
                        style={{
                          border: '1.5px dashed #cbd5e1',
                          borderRadius: '8px',
                          padding: '12px 10px',
                          textAlign: 'center',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff6600'; e.currentTarget.style.backgroundColor = '#fff7ed'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#ffffff'; }}
                      >
                        <UploadCloud size={22} color="#ff6600" />
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>
                          Upload PAN Card
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                          PDF, PNG, JPG (Max 10MB)
                        </span>
                      </div>
                    ) : (
                      <div style={{
                        padding: '10px 12px',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                          <FileText size={18} color="#16a34a" style={{ flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#14532d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }} title={formData.panFileName}>
                              {formData.panFileName}
                            </div>
                            <div style={{ fontSize: '10.5px', color: '#15803d' }}>
                              {formData.panFileSize || 'Document attached'}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={() => panFileInputRef.current?.click()}
                            style={{ padding: '3px 7px', fontSize: '11px', fontWeight: '600', color: '#166534', backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={handleRemovePanFile}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '3px', display: 'flex' }}
                            title="Remove PAN file"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Joining & Experience */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <Briefcase size={16} color="#ff6600" />
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    3. Joining & Work Experience
                  </span>
                </div>

                <div className="staff-modal-grid-2" style={{ marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                      Date of Joining (DOJ) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.doj || ''}
                      onChange={e => setFormData({ ...formData, doj: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                      Store / Channel
                    </label>
                    <select
                      value={formData.store}
                      onChange={e => setFormData({ ...formData, store: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff', cursor: 'pointer' }}
                    >
                      <option value="Offline">Offline</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                </div>

                <div className="staff-modal-grid-2fr">
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                      Previous Experience
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2 Years at Puma Store / 3 Years Retail Sales / Fresher"
                      value={formData.previousExperience || ''}
                      onChange={e => setFormData({ ...formData, previousExperience: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                      Basic Salary (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="20000"
                      value={formData.basicSalary}
                      onChange={e => setFormData({ ...formData, basicSalary: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Bank Details */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <Building2 size={16} color="#ff6600" />
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    4. Bank Details (बैंक खाता विवरण)
                  </span>
                </div>

                <div className="staff-modal-grid-2" style={{ marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter bank name"
                      value={formData.bankName || ''}
                      onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                      Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter account number"
                      value={formData.accountNumber || ''}
                      onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div className="staff-modal-grid-2">
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter IFSC code"
                      value={formData.ifsc || ''}
                      onChange={e => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', textTransform: 'uppercase' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter account holder name"
                      value={formData.accountHolderName || ''}
                      onChange={e => setFormData({ ...formData, accountHolderName: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: Address & Permissions */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <ShieldCheck size={16} color="#ff6600" />
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    5. Address & Module Permissions
                  </span>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                    Residential Address
                  </label>
                  <textarea
                    rows="2"
                    placeholder="A-302, Kothrud, Pune, Maharashtra - 411038"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                {/* Permissions Checkbox Grid */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
                    Module Permissions
                  </label>
                  <div className="staff-permissions-grid">
                    {['Sales', 'Inventory', 'POS', 'Reports'].map(p => (
                      <label key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(p)}
                          onChange={() => togglePermission(p)}
                          style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                        />
                        <span>{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="staff-modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  style={{ padding: '9px 18px', backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 24px', backgroundColor: '#ff6600', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', color: '#ffffff', cursor: 'pointer', boxShadow: '0 2px 6px rgba(255,102,0,0.3)' }}
                >
                  {isEditModalOpen ? 'Save Changes' : 'Create Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Reset Password Modal */}
      {isPasswordModalOpen && selectedStaff && (
        <div
          onClick={() => setIsPasswordModalOpen(false)}
          className="staff-modal-overlay"
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '440px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={18} color="#ff6600" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                  Reset Password
                </h3>
              </div>
              <button onClick={() => setIsPasswordModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                Set a new password for <strong>{selectedStaff.name}</strong> ({selectedStaff.email}).
              </p>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new strong password"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={passwordForm.sendEmail}
                  onChange={e => setPasswordForm({ ...passwordForm, sendEmail: e.target.checked })}
                  style={{ accentColor: '#ff6600' }}
                />
                <span>Email new credentials to {selectedStaff.email}</span>
              </label>

              <div className="staff-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  style={{ padding: '8px 14px', backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '12.5px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', backgroundColor: '#ff6600', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: '700', color: '#ffffff', cursor: 'pointer' }}
                >
                  Confirm Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Section Quick Edit Modal */}
      {isSectionEditModalOpen && selectedStaff && (
        <div
          onClick={() => setIsSectionEditModalOpen(false)}
          className="staff-modal-overlay"
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                {editSectionType === 'basic' && 'Edit Basic Information'}
                {editSectionType === 'salary' && 'Edit Salary & Bank Details'}
                {editSectionType === 'roles' && 'Edit Module Permissions'}
              </h3>
              <button onClick={() => setIsSectionEditModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSectionEdit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {editSectionType === 'basic' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Full Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Role</label>
                    <input type="text" required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                  </div>
                  <div className="staff-modal-grid-2">
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Phone</label>
                      <input type="text" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Email</label>
                      <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Store / Channel</label>
                    <select
                      value={formData.store}
                      onChange={e => setFormData({ ...formData, store: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#ffffff' }}
                    >
                      <option value="Offline">Offline</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Address</label>
                    <textarea rows="2" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                  </div>
                </>
              )}

              {editSectionType === 'salary' && (
                <>
                  <div className="staff-modal-grid-2">
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Basic Salary (₹)</label>
                      <input type="number" required value={formData.basicSalary} onChange={e => setFormData({ ...formData, basicSalary: e.target.value })} style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Salary Type</label>
                      <select value={formData.salaryType} onChange={e => setFormData({ ...formData, salaryType: e.target.value })} style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#fff' }}>
                        <option value="Monthly">Monthly</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Hourly">Hourly</option>
                      </select>
                    </div>
                  </div>
                  <div className="staff-modal-grid-2">
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Bank Name</label>
                      <input type="text" value={formData.bankName} onChange={e => setFormData({ ...formData, bankName: e.target.value })} style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Account Number</label>
                      <input type="text" value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                    </div>
                  </div>
                </>
              )}

              {editSectionType === 'roles' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Select Active Permissions</label>
                  <div className="staff-permissions-grid">
                    {['Sales', 'Inventory', 'POS', 'Reports', 'Discounts', 'Website'].map(p => (
                      <label key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                        <input type="checkbox" checked={formData.permissions.includes(p)} onChange={() => togglePermission(p)} style={{ accentColor: '#ff6600' }} />
                        <span>{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="staff-modal-footer">
                <button type="button" onClick={() => setIsSectionEditModalOpen(false)} style={{ padding: '8px 14px', backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '12.5px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 18px', backgroundColor: '#ff6600', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: '700', color: '#ffffff', cursor: 'pointer' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaffView;
