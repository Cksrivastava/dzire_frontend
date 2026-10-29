import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
  Check,
  KeyRound,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Download,
  Upload,
  FileText,
  CalendarCheck,
  CreditCard,
  User,
  Trash2,
  AlertCircle,
  Plus,
  Lock,
  Camera,
  Briefcase,
  Layers,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  ChevronDown,
  CalendarDays,
  UserCheck,
  UserX,
  Coffee,
  HelpCircle
} from 'lucide-react';
import { initialStaffData } from '../components/AdminStaffView';
import './AdminStaffProfile.css';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to get initial attendance overrides
const getInitialAttendance = (staffId) => {
  try {
    const saved = localStorage.getItem(`dzire_staff_attendance_${staffId}`);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  // Clean attendance
  return {};
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'Present':
      return {
        bg: '#ecfdf5',
        border: '#a7f3d0',
        color: '#047857',
        dot: '#10b981',
        label: 'Present',
        category: 'Working Day (Full Pay)'
      };
    case 'Paid Leave':
      return {
        bg: '#f5f3ff',
        border: '#ddd6fe',
        color: '#6d28d9',
        dot: '#8b5cf6',
        label: 'Paid Leave (PL)',
        category: 'Approved Paid Leave'
      };
    case 'Unpaid Leave':
      return {
        bg: '#fff7ed',
        border: '#fed7aa',
        color: '#c2410c',
        dot: '#f97316',
        label: 'Unpaid Leave (LWP)',
        category: 'Leave Without Pay'
      };
    case 'Absent':
      return {
        bg: '#fff1f2',
        border: '#fecdd3',
        color: '#be123c',
        dot: '#f43f5e',
        label: 'Absent',
        category: 'Unapproved Absence'
      };
    case 'Sunday':
      return {
        bg: '#f1f5f9',
        border: '#cbd5e1',
        color: '#475569',
        dot: '#64748b',
        label: 'Sunday (Weekly Off)',
        category: 'Weekly Off / Paid Holiday'
      };
    case 'Half Day':
      return {
        bg: '#fefce8',
        border: '#fef08a',
        color: '#a16207',
        dot: '#eab308',
        label: 'Half Day',
        category: 'Half Day Shift (0.5 Pay)'
      };
    default:
      return {
        bg: '#f8fafc',
        border: '#e2e8f0',
        color: '#475569',
        dot: '#94a3b8',
        label: status,
        category: 'Other'
      };
  }
};

const AdminStaffProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Load staff list from localStorage or initial
  const [staffList, setStaffList] = useState(() => {
    try {
      const saved = localStorage.getItem('dzire_staff_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialStaffData;
  });

  const staffIdNum = parseInt(id) || id;
  const currentStaff = staffList.find(s => String(s.id) === String(id)) || staffList[0] || initialStaffData[0];

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'attendance' | 'salary' | 'roles' | 'documents'
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(currentStaff);
  const [toastMessage, setToastMessage] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '', sendEmail: true });

  const fetchStaffProfile = async () => {
    try {
      const res = await fetch(`https://dzire-backend.onrender.com/api/admin/staff/${id}`);
      const json = await res.json();
      if (json.success && json.staff) {
        setFormData(json.staff);
        if (json.staff.attendanceMap) {
          setAttendanceMap(json.staff.attendanceMap);
        }
      }
    } catch (err) {
      console.error("Failed to load staff profile:", err);
    }
  };

  useEffect(() => {
    fetchStaffProfile();
  }, [id]);

  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [rolesForm, setRolesForm] = useState({
    role: currentStaff?.role || 'Store Manager',
    permissions: currentStaff?.permissions ? [...currentStaff.permissions] : []
  });

  // Attendance & Leaves State
  const [selectedMonth, setSelectedMonth] = useState('2026-10'); // Default October 2026
  const [attendanceFilter, setAttendanceFilter] = useState('ALL'); // 'ALL' | 'Present' | 'Paid Leave' | 'Unpaid Leave' | 'Absent' | 'Sunday' | 'Half Day'
  const [attendanceMap, setAttendanceMap] = useState(() => getInitialAttendance(staffIdNum));
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    fromDate: '2026-10-07',
    toDate: '2026-10-07',
    status: 'Paid Leave',
    notes: 'Casual Leave',
    deduction: ''
  });
  const [editingDayDate, setEditingDayDate] = useState(null);
  const [editingDayNotes, setEditingDayNotes] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (currentStaff) {
      setFormData(currentStaff);
      setAttendanceMap(getInitialAttendance(currentStaff.id));
    }
  }, [id, currentStaff]);

  // Generate date list for the selected month
  const monthDays = useMemo(() => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = parseInt(yearStr);
    const monthIndex = parseInt(monthStr) - 1; // 0-indexed
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();
    
    const days = [];
    for (let d = totalDays; d >= 1; d--) {
      const dateObj = new Date(year, monthIndex, d);
      const dayOfWeek = dateObj.getDay(); // 0 is Sunday
      const isSunday = dayOfWeek === 0;
      const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayName = dayNames[dayOfWeek];
      const formattedDate = `${String(d).padStart(2, '0')} ${monthNames[monthIndex].slice(0, 3)} ${year}`;
      
      const custom = attendanceMap[dateKey];
      let status = isSunday ? 'Sunday' : 'Present';
      let notes = isSunday ? 'Weekly Off / Sunday' : '';
      let deduction = 0;
      
      if (custom && custom.status) {
        status = custom.status;
        notes = custom.notes !== undefined ? custom.notes : (status === 'Sunday' ? 'Weekly Off / Sunday' : '');
        deduction = custom.deduction !== undefined ? (Number(custom.deduction) || 0) : 0;
      }
      
      days.push({
        dateKey,
        day: d,
        dateObj,
        formattedDate,
        dayName,
        isSunday,
        status,
        notes,
        deduction
      });
    }
    return days;
  }, [selectedMonth, attendanceMap]);

  // Compute live attendance statistics for selected month
  const attendanceStats = useMemo(() => {
    return {
      totalDays: monthDays.length,
      present: monthDays.filter(d => d.status === 'Present').length,
      paidLeave: monthDays.filter(d => d.status === 'Paid Leave').length,
      unpaidLeave: monthDays.filter(d => d.status === 'Unpaid Leave').length,
      absent: monthDays.filter(d => d.status === 'Absent').length,
      sunday: monthDays.filter(d => d.status === 'Sunday').length,
      halfDay: monthDays.filter(d => d.status === 'Half Day').length,
    };
  }, [monthDays]);

  const workingDays = attendanceStats.totalDays - attendanceStats.sunday;
  const attendanceRatePct = workingDays > 0 
    ? Math.round(((attendanceStats.present + attendanceStats.paidLeave + attendanceStats.halfDay * 0.5) / workingDays) * 100) 
    : 100;

  const payableDays = attendanceStats.present + attendanceStats.paidLeave + attendanceStats.sunday + (attendanceStats.halfDay * 0.5);

  // Staff Base Salary & Absent Deduction Calculations
  const basicSalary = useMemo(() => {
    if (formData?.salary?.numericBasic) return Number(formData.salary.numericBasic);
    if (typeof formData?.salary?.basic === 'string') {
      const parsed = parseInt(formData.salary.basic.replace(/[^0-9]/g, ''));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 25000;
  }, [formData?.salary]);

  // Total salary deducted from absent entries in current month
  const totalAbsentDeductions = useMemo(() => {
    return monthDays.reduce((sum, day) => {
      if (day.status === 'Absent' && day.deduction) {
        return sum + (Number(day.deduction) || 0);
      }
      return sum;
    }, 0);
  }, [monthDays]);

  // Net Estimated Salary after absent deductions
  const netPayout = Math.max(0, basicSalary - totalAbsentDeductions);

  const filteredDays = useMemo(() => {
    return monthDays.filter(day => {
      if (attendanceFilter === 'ALL') return true;
      return day.status === attendanceFilter;
    });
  }, [monthDays, attendanceFilter]);

  // Update specific day status & deduction
  const handleUpdateDayStatus = (dateKey, newStatus, newNotes, newDeduction) => {
    const defaultNote = newStatus === 'Sunday' ? 'Weekly Off / Sunday' : '';
    const current = attendanceMap[dateKey] || {};
    let deduction = current.deduction || 0;

    if (newDeduction !== undefined) {
      deduction = Number(newDeduction) || 0;
    } else if (newStatus !== 'Absent') {
      deduction = 0;
    }

    const updatedMap = {
      ...attendanceMap,
      [dateKey]: {
        status: newStatus,
        notes: newNotes !== undefined ? newNotes : (current.notes || defaultNote),
        deduction: deduction
      }
    };
    setAttendanceMap(updatedMap);
    try {
      localStorage.setItem(`dzire_staff_attendance_${formData.id || id}`, JSON.stringify(updatedMap));
      if (formData?.id || id) {
        fetch(`https://dzire-backend.onrender.com/api/admin/staff/${formData.id || id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attendanceMap: updatedMap })
        }).catch(console.error);
      }
    } catch (e) {
      console.error(e);
    }
    showToast(`Updated ${dateKey} to ${newStatus}`);
  };

  // Directly update manual deduction for an absent day
  const handleUpdateDayDeduction = (dateKey, deductionAmount) => {
    const numericVal = deductionAmount === '' ? 0 : Math.max(0, Number(deductionAmount) || 0);
    const current = attendanceMap[dateKey] || { status: 'Absent', notes: '' };
    const updatedMap = {
      ...attendanceMap,
      [dateKey]: {
        ...current,
        status: current.status || 'Absent',
        deduction: numericVal
      }
    };
    setAttendanceMap(updatedMap);
    try {
      localStorage.setItem(`dzire_staff_attendance_${formData.id || id}`, JSON.stringify(updatedMap));
      if (formData?.id || id) {
        fetch(`https://dzire-backend.onrender.com/api/admin/staff/${formData.id || id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attendanceMap: updatedMap })
        }).catch(console.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveLeaveModal = (e) => {
    e.preventDefault();
    const start = new Date(leaveForm.fromDate);
    const end = new Date(leaveForm.toDate || leaveForm.fromDate);
    
    if (start > end) {
      alert('From Date cannot be after To Date.');
      return;
    }
    
    const newMap = { ...attendanceMap };
    const current = new Date(start);
    let count = 0;
    const deductionPerDay = leaveForm.status === 'Absent' ? (Math.max(0, Number(leaveForm.deduction) || 0)) : 0;
    
    while (current <= end) {
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      const d = String(current.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${d}`;
      newMap[key] = {
        status: leaveForm.status,
        notes: leaveForm.notes || leaveForm.status,
        deduction: deductionPerDay
      };
      current.setDate(current.getDate() + 1);
      count++;
    }
    
    setAttendanceMap(newMap);
    try {
      localStorage.setItem(`dzire_staff_attendance_${formData.id || id}`, JSON.stringify(newMap));
      if (formData?.id || id) {
        fetch(`https://dzire-backend.onrender.com/api/admin/staff/${formData.id || id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attendanceMap: newMap })
        }).catch(console.error);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLeaveModalOpen(false);
    showToast(`Marked "${leaveForm.status}" for ${count} day(s)!`);
  };

  const handleExportAttendanceReport = () => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    const monthName = monthNames[parseInt(monthStr) - 1];
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += `Staff Attendance & Leave Report - ${formData.name} (${formData.role})\r\n`;
    csvContent += `Month,${monthName} ${yearStr}\r\n`;
    csvContent += `Total Days,${attendanceStats.totalDays},Present Days,${attendanceStats.present},Paid Leaves (PL),${attendanceStats.paidLeave},Unpaid Leaves (LWP),${attendanceStats.unpaidLeave},Absent Days,${attendanceStats.absent},Sundays / Offs,${attendanceStats.sunday},Net Payable Days,${payableDays},Attendance Rate,${attendanceRatePct}%\r\n`;
    csvContent += `Monthly Basic Salary,INR ${basicSalary},Total Absent Deductions,INR ${totalAbsentDeductions},Net Salary Payout,INR ${netPayout}\r\n\r\n`;
    csvContent += 'Date,Day,Status,Duty / Leave Category,Remarks,Salary Deduction (INR)\r\n';
    
    monthDays.forEach(d => {
      const badge = getStatusBadge(d.status);
      const ded = d.status === 'Absent' ? (d.deduction || 0) : 0;
      csvContent += `"${d.formattedDate}","${d.dayName}","${d.status}","${badge.category}","${d.notes || '-'}","${ded}"\r\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_${formData.name.replace(/\s+/g, '_')}_${monthName}_${yearStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Attendance report for ${monthName} exported!`);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        const res = await fetch("https://dzire-backend.onrender.com/api/admin/staff/upload", {
          method: "POST",
          body: uploadFormData,
        });
        const data = await res.json();
        if (data.success) {
          const avatarUrl = data.fileUrl || data.url;
          setFormData(prev => ({ ...prev, avatar: avatarUrl }));
          if (formData?.id || id) {
            await fetch(`https://dzire-backend.onrender.com/api/admin/staff/${formData.id || id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ avatar: avatarUrl })
            });
          }
          showToast('Profile photo updated successfully!');
        } else {
          alert(data.message || 'Failed to upload photo');
        }
      } catch (err) {
        console.error(err);
        showToast('Error uploading avatar');
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name?.trim() || !formData.email?.trim() || !formData.phone?.trim()) {
      alert('Name, email and phone number are required.');
      return;
    }

    const payload = {
      ...formData,
      salary: {
        ...formData.salary,
        basic: typeof formData.salary?.basic === 'string' && formData.salary.basic.startsWith('₹')
          ? formData.salary.basic
          : `₹${Number(formData.salary?.numericBasic || 25000).toLocaleString('en-IN')}`
      }
    };

    try {
      await fetch(`https://dzire-backend.onrender.com/api/admin/staff/${formData.id || id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error(e);
    }

    setFormData(payload);
    setIsEditing(false);
    showToast(`Staff details for "${formData.name}" saved successfully!`);
  };

  const handleToggleStatus = async () => {
    const newStatus = formData.status === 'Active' ? 'Inactive' : 'Active';
    const updated = { ...formData, status: newStatus };
    setFormData(updated);

    try {
      await fetch(`https://dzire-backend.onrender.com/api/admin/staff/${formData.id || id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.error(e);
    }
    showToast(`Status updated to ${newStatus}`);
  };

  const handleDeleteStaff = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete staff member "${formData.name}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      await fetch(`https://dzire-backend.onrender.com/api/admin/staff/${formData.id || id}`, {
        method: 'DELETE'
      });
      const updatedList = staffList.filter(s => String(s.id) !== String(id));
      localStorage.setItem('dzire_staff_list', JSON.stringify(updatedList));
      localStorage.removeItem(`dzire_staff_attendance_${id}`);
    } catch (e) {
      console.error(e);
    }
    navigate('/admin/staff');
  };

  const togglePermission = (perm) => {
    setFormData(prev => {
      const currentPerms = prev.permissions || [];
      const exists = currentPerms.includes(perm);
      return {
        ...prev,
        permissions: exists ? currentPerms.filter(p => p !== perm) : [...currentPerms, perm]
      };
    });
  };

  const handleUploadDocument = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        const res = await fetch("https://dzire-backend.onrender.com/api/admin/staff/upload", {
          method: "POST",
          body: uploadFormData,
        });
        const uploadData = await res.json();
        if (uploadData.success) {
          const newDoc = {
            name: uploadData.filename || file.name,
            size: uploadData.size || `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            type: (file.name.toLowerCase().endsWith('.png') || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) ? 'IMG' : 'PDF',
            fileUrl: uploadData.fileUrl || uploadData.url
          };
          const updatedDocs = [...(formData.documents || []), newDoc];
          setFormData(prev => ({
            ...prev,
            documents: updatedDocs
          }));
          if (formData?.id || id) {
            await fetch(`https://dzire-backend.onrender.com/api/admin/staff/${formData.id || id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ documents: updatedDocs })
            });
          }
          showToast(`Document "${file.name}" attached successfully!`);
        }
      } catch (err) {
        console.error(err);
        showToast("Error uploading document");
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.newPassword) {
      alert('Password cannot be empty');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData?.id || id) {
      try {
        await fetch(`https://dzire-backend.onrender.com/api/admin/staff/${formData.id || id}/password-reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(passwordForm)
        });
      } catch (e) {
        console.error(e);
      }
    }

    showToast(`Password reset link sent to ${formData.email}!`);
    setIsPasswordModalOpen(false);
    setPasswordForm({ newPassword: '', confirmPassword: '', sendEmail: true });
  };

  const handleOpenRolesModal = () => {
    setRolesForm({
      role: formData.role || 'Store Manager',
      permissions: formData.permissions ? [...formData.permissions] : []
    });
    setIsRolesModalOpen(true);
  };

  const toggleModalPermission = (permKey) => {
    setRolesForm(prev => {
      const perms = prev.permissions || [];
      const exists = perms.includes(permKey);
      return {
        ...prev,
        permissions: exists ? perms.filter(p => p !== permKey) : [...perms, permKey]
      };
    });
  };

  const handleSelectAllPermissions = () => {
    setRolesForm(prev => ({
      ...prev,
      permissions: ['Sales', 'Inventory', 'POS', 'Reports', 'Discounts', 'Website']
    }));
  };

  const handleClearAllPermissions = () => {
    setRolesForm(prev => ({
      ...prev,
      permissions: []
    }));
  };

  const handleSaveRolesModal = async (e) => {
    if (e) e.preventDefault();
    if (!rolesForm.role.trim()) {
      alert('Please specify a role.');
      return;
    }

    const updated = {
      ...formData,
      role: rolesForm.role,
      permissions: [...rolesForm.permissions]
    };
    setFormData(updated);

    if (formData?.id || id) {
      try {
        await fetch(`https://dzire-backend.onrender.com/api/admin/staff/${formData.id || id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: rolesForm.role, permissions: rolesForm.permissions })
        });
      } catch (err) {
        console.error(err);
      }
    }

    setIsRolesModalOpen(false);
    showToast(`Roles & permissions updated for "${formData.name}"!`);
  };

  return (
    <AdminLayout>
      <div className="staff-profile-container">
        {/* Toast */}
        {toastMessage && (
          <div className="staff-profile-toast">
            <Check size={16} color="#22c55e" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Back Link */}
        <div style={{ marginBottom: '18px' }}>
          <button
            onClick={() => navigate('/admin/staff')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '6px 0'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ff6600'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
          >
            <ArrowLeft size={16} />
            <span>Back to Staff Management</span>
          </button>
        </div>

        {/* Main Staff Profile Card Header */}
        <div className="staff-profile-header-card">
          {/* Left: Avatar & Info */}
          <div className="staff-profile-header-left">
            <div style={{ position: 'relative' }}>
              <img
                src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={formData.name}
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `3px solid ${formData.status === 'Active' ? '#22c55e' : '#ef4444'}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              />
              <label
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  backgroundColor: '#ff6600',
                  color: '#ffffff',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px solid #ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}
                title="Change Photo"
              >
                <Camera size={13} />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
              </label>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
                  {formData.name}
                </h1>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  backgroundColor: formData.status === 'Active' ? '#dcfce7' : '#fee2e2',
                  color: formData.status === 'Active' ? '#15803d' : '#b91c1c'
                }}>
                  {formData.status}
                </span>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  backgroundColor: '#f1f5f9',
                  color: '#475569'
                }}>
                  {formData.store || 'Offline'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#64748b', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>{formData.role}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={13} />
                  {formData.phone}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={13} />
                  {formData.email}
                </span>
              </div>

              {/* Permissions Pills preview in header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600' }}>Permissions:</span>
                {(formData.permissions || []).length > 0 ? (
                  (formData.permissions || []).map(perm => (
                    <span
                      key={perm}
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe'
                      }}
                    >
                      {perm}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '11.5px', color: '#94a3b8', fontStyle: 'italic' }}>No permissions assigned</span>
                )}
                <button
                  type="button"
                  onClick={handleOpenRolesModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ff6600',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="staff-profile-header-actions">
            <button
              onClick={handleToggleStatus}
              style={{
                padding: '9px 16px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: formData.status === 'Active' ? '#ef4444' : '#16a34a',
                cursor: 'pointer'
              }}
            >
              {formData.status === 'Active' ? 'Deactivate' : 'Activate'}
            </button>

            <button
              onClick={handleDeleteStaff}
              style={{
                padding: '9px 16px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecdd3',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#dc2626',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fee2e2'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
            >
              <Trash2 size={14} color="#dc2626" />
              <span>Delete</span>
            </button>

            <button
              onClick={handleOpenRolesModal}
              style={{
                padding: '9px 16px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#fff7ed';
                e.currentTarget.style.borderColor = '#fdba74';
                e.currentTarget.style.color = '#c2410c';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.color = '#334155';
              }}
            >
              <ShieldCheck size={14} color="#ff6600" />
              <span>Roles & Permissions</span>
            </button>

            <button
              onClick={() => setIsPasswordModalOpen(true)}
              style={{
                padding: '9px 16px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <KeyRound size={14} color="#ff6600" />
              <span>Reset Password</span>
            </button>

            {isEditing ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    setFormData(currentStaff);
                    setIsEditing(false);
                  }}
                  style={{
                    padding: '9px 16px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    padding: '9px 20px',
                    backgroundColor: '#ff6600',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(255, 102, 0, 0.3)'
                  }}
                >
                  <Save size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '9px 20px',
                  backgroundColor: '#ff6600',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(255, 102, 0, 0.3)'
                }}
              >
                <Edit2 size={14} />
                <span>Edit Details</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="staff-profile-tabs-strip">
          {[
            { id: 'profile', label: 'Basic Info & Store' },
            { id: 'attendance', label: 'Attendance & Leaves' },
            { id: 'salary', label: 'Salary & Compensation' },
            { id: 'documents', label: 'KYC & Documents' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="staff-profile-tab-btn"
              style={{
                borderBottom: activeTab === tab.id ? '2px solid #ff6600' : '2px solid transparent',
                fontWeight: activeTab === tab.id ? '700' : '500',
                color: activeTab === tab.id ? '#ff6600' : '#64748b'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: BASIC INFO & STORE */}
        {activeTab === 'profile' && (
          <div className="staff-profile-grid-2fr">
            {/* Left Card: General Fields */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 18px 0', fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                Personal & Employment Information
              </h3>

              <div className="staff-profile-grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                    />
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', padding: '8px 0' }}>
                      {formData.name}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Designation / Role
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff' }}
                    >
                      <option value="Store Manager">Store Manager</option>
                      <option value="Sales Associate">Sales Associate</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Inventory Executive">Inventory Executive</option>
                      <option value="Marketing Associate">Marketing Associate</option>
                      <option value="Part-time (Weekend)">Part-time (Weekend)</option>
                    </select>
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', padding: '8px 0' }}>
                      {formData.role}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Contact Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                    />
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', padding: '8px 0' }}>
                      {formData.phone}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Official Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                    />
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', padding: '8px 0' }}>
                      {formData.email}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Gender (लिंग)
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.gender || 'Male'}
                      onChange={e => setFormData({ ...formData, gender: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff' }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', padding: '8px 0' }}>
                      {formData.gender || 'Male'}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Marital Status
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.maritalStatus || 'Single'}
                      onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff' }}
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                    </select>
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', padding: '8px 0' }}>
                      {formData.maritalStatus || 'Single'}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Date of Birth (DOB)
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.dob || ''}
                      onChange={e => setFormData({ ...formData, dob: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff' }}
                    />
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', padding: '8px 0' }}>
                      {formData.dob || 'Not specified'}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Date of Joining (DOJ)
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.doj || ''}
                      onChange={e => setFormData({
                        ...formData,
                        doj: e.target.value,
                        joinDate: e.target.value ? new Date(e.target.value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : formData.joinDate
                      })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff' }}
                    />
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', padding: '8px 0' }}>
                      {formData.joinDate || formData.doj || 'Not specified'}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Store / Channel Assignment
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.store || 'Offline'}
                      onChange={e => setFormData({ ...formData, store: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff' }}
                    >
                      <option value="Offline">Offline</option>
                      <option value="Online">Online</option>
                    </select>
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', padding: '8px 0' }}>
                      {formData.store || 'Offline'}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Previous Experience
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      placeholder="e.g. 2 Years at Decathlon Store"
                      value={formData.previousExperience || ''}
                      onChange={e => setFormData({ ...formData, previousExperience: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                    />
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', padding: '8px 0' }}>
                      {formData.previousExperience || 'Fresher / None specified'}
                    </div>
                  )}
                </div>
              </div>

              {/* KYC Identification Card */}
              <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={15} color="#ff6600" />
                  <span>Identity & KYC Details</span>
                </div>
                <div className="staff-profile-grid-2">
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>
                      Aadhaar Card Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        placeholder="e.g. 4582 9182 3410"
                        value={formData.aadharCard || ''}
                        onChange={e => setFormData({ ...formData, aadharCard: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                      />
                    ) : (
                      <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a', letterSpacing: '0.04em' }}>
                        {formData.aadharCard || 'Not provided'}
                      </div>
                    )}
                    {(formData.aadharFileName || (formData.documents || []).find(d => d.name?.toLowerCase().includes('aadhaar'))) && (
                      <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>
                        <CheckCircle size={12} color="#16a34a" />
                        <span>Attached: {formData.aadharFileName || (formData.documents || []).find(d => d.name?.toLowerCase().includes('aadhaar'))?.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>
                      PAN Card Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        placeholder="e.g. ABCDE1234F"
                        value={formData.panCard || ''}
                        onChange={e => setFormData({ ...formData, panCard: e.target.value.toUpperCase() })}
                        style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', textTransform: 'uppercase' }}
                      />
                    ) : (
                      <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a', letterSpacing: '0.05em' }}>
                        {formData.panCard || 'Not provided'}
                      </div>
                    )}
                    {(formData.panFileName || (formData.documents || []).find(d => d.name?.toLowerCase().includes('pan'))) && (
                      <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>
                        <CheckCircle size={12} color="#16a34a" />
                        <span>Attached: {formData.panFileName || (formData.documents || []).find(d => d.name?.toLowerCase().includes('pan'))?.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '18px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                  Residential Address
                </label>
                {isEditing ? (
                  <textarea
                    rows="3"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', resize: 'vertical' }}
                  />
                ) : (
                  <div style={{ fontSize: '13.5px', color: '#334155', padding: '8px 0', lineHeight: 1.5 }}>
                    {formData.address || 'Not specified'}
                  </div>
                )}
              </div>
            </div>

            {/* Right Card: Quick Overview Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                  Attendance Snapshot ({monthNames[parseInt(selectedMonth.split('-')[1]) - 1]})
                </h4>
                <div style={{ backgroundColor: '#f0fdf4', padding: '12px 14px', borderRadius: '10px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#15803d' }}>
                      {attendanceRatePct}%
                    </div>
                    <div style={{ fontSize: '11px', color: '#166534', fontWeight: '500' }}>
                      {monthNames[parseInt(selectedMonth.split('-')[1]) - 1]} Attendance Rate
                    </div>
                  </div>
                  <CalendarCheck size={26} color="#16a34a" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  <div style={{ backgroundColor: '#f0fdf4', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #dcfce7' }}>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#15803d' }}>{attendanceStats.present}</div>
                    <div style={{ fontSize: '11px', color: '#166534', fontWeight: '600' }}>Present Days</div>
                  </div>
                  <div style={{ backgroundColor: '#f5f3ff', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #ede9fe' }}>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#7c3aed' }}>{attendanceStats.paidLeave}</div>
                    <div style={{ fontSize: '11px', color: '#6d28d9', fontWeight: '600' }}>Paid Leaves (PL)</div>
                  </div>
                  <div style={{ backgroundColor: '#fff7ed', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #ffedd5' }}>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#ea580c' }}>{attendanceStats.unpaidLeave}</div>
                    <div style={{ fontSize: '11px', color: '#c2410c', fontWeight: '600' }}>Unpaid (LWP)</div>
                  </div>
                  <div style={{ backgroundColor: '#fff1f2', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #ffe4e6' }}>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#e11d48' }}>{attendanceStats.absent}</div>
                    <div style={{ fontSize: '11px', color: '#be123c', fontWeight: '600' }}>Absent Days</div>
                  </div>
                </div>
                
                <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                  <span style={{ color: '#64748b' }}>Sundays / Offs: <strong>{attendanceStats.sunday}</strong></span>
                  <span style={{ color: totalAbsentDeductions > 0 ? '#be123c' : '#0f172a', fontWeight: '700' }}>
                    {totalAbsentDeductions > 0 ? `Deduction: -₹${totalAbsentDeductions.toLocaleString('en-IN')}` : `Payable: ${payableDays} Days`}
                  </span>
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                  Active Permissions
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(formData.permissions || ['Sales', 'POS']).map(perm => (
                    <span
                      key={perm}
                      style={{
                        padding: '5px 12px',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '12px',
                        border: '1px solid #dbeafe'
                      }}
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE & LEAVES (NO CLOCK IN/OUT, DATE-WISE SUNDAY AUTO-MARK, PAID/UNPAID LEAVES, ABSENT) */}
        {activeTab === 'attendance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Toolbar & Summary Header */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                      Monthly Attendance & Leave Register
                    </h3>
                    <span style={{ padding: '3px 10px', backgroundColor: '#eff6ff', color: '#1e40af', fontSize: '12px', fontWeight: '700', borderRadius: '20px', border: '1px solid #bfdbfe' }}>
                      {formData.name}
                    </span>
                  </div>
                  <p style={{ margin: '5px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Date-wise automated record. Sundays are marked as Weekly Off, other days default to Present. Track Paid Leaves (PL), Unpaid Leaves (LWP), and Absent entries.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Month Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <Calendar size={14} color="#64748b" />
                    <select
                      value={selectedMonth}
                      onChange={e => setSelectedMonth(e.target.value)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#0f172a',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="2026-10">October 2026</option>
                      <option value="2026-09">September 2026</option>
                      <option value="2026-08">August 2026</option>
                      <option value="2026-07">July 2026</option>
                      <option value="2026-06">June 2026</option>
                    </select>
                  </div>

                  {/* Mark Leave / Attendance Button */}
                  <button
                    onClick={() => {
                      setLeaveForm({
                        fromDate: `${selectedMonth}-01`,
                        toDate: `${selectedMonth}-01`,
                        status: 'Paid Leave',
                        notes: 'Casual Leave',
                        deduction: ''
                      });
                      setIsLeaveModalOpen(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      backgroundColor: '#ff6600',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(255, 102, 0, 0.25)'
                    }}
                  >
                    <Plus size={14} />
                    <span>Mark Leave / Record</span>
                  </button>

                  {/* Export CSV Report */}
                  <button
                    onClick={handleExportAttendanceReport}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: '600',
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={14} />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>



              {/* Monthly Salary & Deductions Live Summary Strip */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                marginBottom: '16px',
                padding: '14px 18px',
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #e2e8f0'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Monthly Base Salary</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                    ₹{basicSalary.toLocaleString('en-IN')}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Absent Days</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: attendanceStats.absent > 0 ? '#be123c' : '#0f172a', marginTop: '2px' }}>
                    {attendanceStats.absent} {attendanceStats.absent === 1 ? 'Day' : 'Days'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#be123c', fontWeight: '700', textTransform: 'uppercase' }}>Total Absent Deduction</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#be123c', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>-₹{totalAbsentDeductions.toLocaleString('en-IN')}</span>
                    {totalAbsentDeductions > 0 && (
                      <span style={{ fontSize: '10px', padding: '1px 6px', backgroundColor: '#ffe4e6', color: '#be123c', borderRadius: '4px', fontWeight: '700' }}>
                        Deducted
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#15803d', fontWeight: '700', textTransform: 'uppercase' }}>Net Estimated Salary</div>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: '#15803d', marginTop: '2px' }}>
                    ₹{netPayout.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Status Filter Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginRight: '4px' }}>Filter:</span>
                {[
                  { id: 'ALL', label: 'All Days', count: attendanceStats.totalDays },
                  { id: 'Present', label: 'Present', count: attendanceStats.present, color: '#15803d', bg: '#dcfce7' },
                  { id: 'Paid Leave', label: 'Paid Leaves (PL)', count: attendanceStats.paidLeave, color: '#7c3aed', bg: '#ede9fe' },
                  { id: 'Unpaid Leave', label: 'Unpaid (LWP)', count: attendanceStats.unpaidLeave, color: '#c2410c', bg: '#ffedd5' },
                  { id: 'Absent', label: 'Absent', count: attendanceStats.absent, color: '#be123c', bg: '#ffe4e6' },
                  { id: 'Sunday', label: 'Sundays / Offs', count: attendanceStats.sunday, color: '#334155', bg: '#f1f5f9' },
                  { id: 'Half Day', label: 'Half Day', count: attendanceStats.halfDay, color: '#a16207', bg: '#fef3c7' }
                ].map(tab => {
                  const isActive = attendanceFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setAttendanceFilter(tab.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: isActive ? '1px solid #ff6600' : '1px solid #e2e8f0',
                        backgroundColor: isActive ? '#fff7ed' : '#ffffff',
                        color: isActive ? '#ff6600' : '#475569',
                        fontSize: '12px',
                        fontWeight: isActive ? '700' : '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{tab.label}</span>
                      <span style={{
                        padding: '1px 6px',
                        borderRadius: '10px',
                        fontSize: '10.5px',
                        backgroundColor: tab.bg || (isActive ? '#ff6600' : '#f1f5f9'),
                        color: tab.color || (isActive ? '#ffffff' : '#64748b'),
                        fontWeight: '700'
                      }}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Attendance Table */}
              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#475569', backgroundColor: '#f8fafc', fontSize: '12px', fontWeight: '700' }}>
                      <th style={{ padding: '12px 16px' }}>Date</th>
                      <th style={{ padding: '12px 16px' }}>Day</th>
                      <th style={{ padding: '12px 16px' }}>Attendance Status</th>
                      <th style={{ padding: '12px 16px' }}>Duty / Leave Category</th>
                      <th style={{ padding: '12px 16px' }}>Remarks / Reason</th>
                      <th style={{ padding: '12px 16px', minWidth: '150px' }}>Salary Deduction (₹)</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Change Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDays.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                          No attendance records matching the selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredDays.map(row => {
                        const badge = getStatusBadge(row.status);
                        const isEditingThisNote = editingDayDate === row.dateKey;

                        return (
                          <tr
                            key={row.dateKey}
                            style={{
                              borderBottom: '1px solid #f1f5f9',
                              backgroundColor: row.isSunday && row.status === 'Sunday' ? '#fafbfc' : '#ffffff',
                              transition: 'background-color 0.1s ease'
                            }}
                          >
                            {/* 1. Date */}
                            <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0f172a' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>{row.formattedDate}</span>
                                {row.formattedDate.startsWith('07 Oct 2026') && (
                                  <span style={{ padding: '1px 6px', backgroundColor: '#ffedd5', color: '#c2410c', fontSize: '10px', borderRadius: '4px', fontWeight: '700' }}>
                                    Today
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 2. Day */}
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{
                                fontWeight: row.isSunday ? '800' : '600',
                                color: row.isSunday ? '#475569' : '#334155'
                              }}>
                                {row.dayName}
                              </span>
                            </td>

                            {/* 3. Status Badge */}
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                backgroundColor: badge.bg,
                                color: badge.color,
                                border: `1px solid ${badge.border}`
                              }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: badge.dot }} />
                                <span>{badge.label}</span>
                              </span>
                            </td>

                            {/* 4. Category */}
                            <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '12px', fontWeight: '500' }}>
                              {badge.category}
                            </td>

                            {/* 5. Remarks */}
                            <td style={{ padding: '12px 16px' }}>
                              {isEditingThisNote ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <input
                                    type="text"
                                    value={editingDayNotes}
                                    onChange={e => setEditingDayNotes(e.target.value)}
                                    placeholder="Enter reason / note..."
                                    style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', width: '180px' }}
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => {
                                      handleUpdateDayStatus(row.dateKey, row.status, editingDayNotes);
                                      setEditingDayDate(null);
                                    }}
                                    style={{ padding: '4px 8px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingDayDate(null)}
                                    style={{ padding: '4px 6px', backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div
                                  onClick={() => {
                                    setEditingDayDate(row.dateKey);
                                    setEditingDayNotes(row.notes || '');
                                  }}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: row.notes ? '#334155' : '#94a3b8',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    padding: '2px 6px',
                                    borderRadius: '4px'
                                  }}
                                  title="Click to edit reason"
                                >
                                  <span>{row.notes || 'Add note...'}</span>
                                  <Edit2 size={11} color="#94a3b8" />
                                </div>
                              )}
                            </td>

                            {/* 6. Salary Deduction (Placed right next to Remarks / Reason) */}
                            <td style={{ padding: '12px 16px' }}>
                              {row.status === 'Absent' ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <div style={{
                                    position: 'relative',
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                  }}>
                                    <span style={{
                                      position: 'absolute',
                                      left: '8px',
                                      fontSize: '12px',
                                      fontWeight: '700',
                                      color: '#be123c',
                                      pointerEvents: 'none'
                                    }}>₹</span>
                                    <input
                                      type="number"
                                      min="0"
                                      step="50"
                                      placeholder="0"
                                      value={row.deduction !== undefined && row.deduction !== null ? row.deduction : ''}
                                      onChange={e => {
                                        const val = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0);
                                        handleUpdateDayDeduction(row.dateKey, val);
                                      }}
                                      style={{
                                        padding: '5px 8px 5px 20px',
                                        fontSize: '12.5px',
                                        fontWeight: '700',
                                        color: '#be123c',
                                        border: '1px solid #fecdd3',
                                        backgroundColor: '#fff1f2',
                                        borderRadius: '6px',
                                        outline: 'none',
                                        width: '100px',
                                        transition: 'border-color 0.2s, box-shadow 0.2s'
                                      }}
                                      onFocus={e => e.target.style.borderColor = '#e11d48'}
                                      onBlur={e => e.target.style.borderColor = '#fecdd3'}
                                      title="Enter salary deduction amount for this absent day"
                                    />
                                  </div>
                                  {Number(row.deduction) > 0 && (
                                    <span style={{
                                      fontSize: '10px',
                                      color: '#be123c',
                                      backgroundColor: '#ffe4e6',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      fontWeight: '700',
                                      whiteSpace: 'nowrap'
                                    }}>
                                      Deducted
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>—</span>
                              )}
                            </td>

                            {/* 7. Quick Action / Change Status */}
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <select
                                value={row.status}
                                onChange={e => handleUpdateDayStatus(row.dateKey, e.target.value)}
                                style={{
                                  padding: '5px 10px',
                                  fontSize: '11.5px',
                                  fontWeight: '600',
                                  borderRadius: '6px',
                                  border: '1px solid #cbd5e1',
                                  backgroundColor: '#ffffff',
                                  color: '#0f172a',
                                  outline: 'none',
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="Present">Present (Working)</option>
                                <option value="Paid Leave">Paid Leave (PL)</option>
                                <option value="Unpaid Leave">Unpaid Leave (LWP)</option>
                                <option value="Absent">Absent</option>
                                <option value="Sunday">Sunday (Weekly Off)</option>
                                <option value="Half Day">Half Day</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Leave / Attendance Modal */}
            {isLeaveModalOpen && (
              <div
                onClick={() => setIsLeaveModalOpen(false)}
                className="staff-profile-modal-overlay"
              >
                <div
                  onClick={e => e.stopPropagation()}
                  className="staff-profile-modal-box"
                >
                  <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CalendarCheck size={18} color="#ff6600" />
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                        Mark Leave / Attendance Record
                      </h3>
                    </div>
                    <button onClick={() => setIsLeaveModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveLeaveModal} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                      Mark leave or update attendance for <strong>{formData.name}</strong>.
                    </p>

                    <div className="staff-profile-grid-2" style={{ gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                          From Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={leaveForm.fromDate}
                          onChange={e => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                          style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                          To Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={leaveForm.toDate}
                          onChange={e => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                          style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                        Attendance Status / Type *
                      </label>
                      <select
                        value={leaveForm.status}
                        onChange={e => setLeaveForm({ ...leaveForm, status: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', backgroundColor: '#ffffff' }}
                      >
                        <option value="Paid Leave">Paid Leave (PL - Full Pay)</option>
                        <option value="Unpaid Leave">Unpaid Leave (LWP - Salary Deducted)</option>
                        <option value="Absent">Absent (Uninformed / Loss of Pay)</option>
                        <option value="Present">Present (Working Day)</option>
                        <option value="Half Day">Half Day (0.5 Day)</option>
                        <option value="Sunday">Sunday (Weekly Off)</option>
                      </select>
                    </div>

                    {leaveForm.status === 'Absent' && (
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#be123c', marginBottom: '5px' }}>
                          Salary Deduction per Day (₹)
                        </label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <span style={{ position: 'absolute', left: '10px', fontWeight: '700', color: '#be123c' }}>₹</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="e.g. 800"
                            value={leaveForm.deduction || ''}
                            onChange={e => setLeaveForm({ ...leaveForm, deduction: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '8px 12px 8px 24px',
                              fontSize: '13px',
                              border: '1px solid #fecdd3',
                              borderRadius: '6px',
                              outline: 'none',
                              backgroundColor: '#fff1f2',
                              fontWeight: '700',
                              color: '#be123c'
                            }}
                          />
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#9f1239' }}>
                          This deduction amount will be deducted per absent day from monthly salary payout.
                        </p>
                      </div>
                    )}

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                        Reason / Remarks
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sick Leave, Casual Leave, Family Emergency, Unannounced"
                        value={leaveForm.notes}
                        onChange={e => setLeaveForm({ ...leaveForm, notes: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                      />
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {['Casual Leave', 'Sick Leave', 'Medical Emergency', 'Festival Off', 'Personal Work', 'Uninformed'].map(preset => (
                          <button
                            type="button"
                            key={preset}
                            onClick={() => setLeaveForm({ ...leaveForm, notes: preset })}
                            style={{
                              padding: '2px 8px',
                              backgroundColor: '#f1f5f9',
                              border: '1px solid #e2e8f0',
                              borderRadius: '4px',
                              fontSize: '11px',
                              color: '#475569',
                              cursor: 'pointer'
                            }}
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="staff-profile-modal-footer">
                      <button
                        type="button"
                        onClick={() => setIsLeaveModalOpen(false)}
                        style={{ padding: '8px 14px', backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '12.5px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{ padding: '8px 18px', backgroundColor: '#ff6600', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: '700', color: '#ffffff', cursor: 'pointer', boxShadow: '0 2px 6px rgba(255,102,0,0.25)' }}
                      >
                        Apply & Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SALARY & COMPENSATION */}
        {activeTab === 'salary' && (
          <div className="staff-profile-grid-2fr">
            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ margin: '0 0 18px 0', fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                Salary Structure & Bank Payout Details
              </h3>

              <div className="staff-profile-grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Monthly Basic Salary (₹)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.salary?.numericBasic || 25000}
                      onChange={e => setFormData({
                        ...formData,
                        salary: { ...formData.salary, numericBasic: parseInt(e.target.value) || 0, basic: `₹${Number(e.target.value).toLocaleString('en-IN')}` }
                      })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                    />
                  ) : (
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', padding: '6px 0' }}>
                      {formData.salary?.basic || '₹25,000'}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Salary Type
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.salary?.type || 'Monthly'}
                      onChange={e => setFormData({
                        ...formData,
                        salary: { ...formData.salary, type: e.target.value }
                      })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff' }}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Hourly">Hourly</option>
                    </select>
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', padding: '8px 0' }}>
                      {formData.salary?.type || 'Monthly'}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Payment Disbursement Day
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.salary?.paymentDay || '5th of every month'}
                      onChange={e => setFormData({
                        ...formData,
                        salary: { ...formData.salary, paymentDay: e.target.value }
                      })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                    />
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', padding: '8px 0' }}>
                      {formData.salary?.paymentDay || '5th of every month'}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    PF / ESIC Status
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.salary?.pfEsic || 'Applicable'}
                      onChange={e => setFormData({
                        ...formData,
                        salary: { ...formData.salary, pfEsic: e.target.value }
                      })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff' }}
                    >
                      <option value="Applicable">Applicable</option>
                      <option value="Not Applicable">Not Applicable</option>
                    </select>
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', padding: '8px 0' }}>
                      {formData.salary?.pfEsic || 'Applicable'}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Bank Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      placeholder="Enter bank name"
                      value={formData.salary?.bankName || ''}
                      onChange={e => setFormData({
                        ...formData,
                        salary: { ...formData.salary, bankName: e.target.value }
                      })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                    />
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: formData.salary?.bankName ? '#0f172a' : '#94a3b8', padding: '8px 0' }}>
                      {formData.salary?.bankName || 'Not specified'}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Account Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      placeholder="Enter account number"
                      value={formData.salary?.accountNumber || ''}
                      onChange={e => setFormData({
                        ...formData,
                        salary: { ...formData.salary, accountNumber: e.target.value }
                      })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                    />
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: formData.salary?.accountNumber ? '#0f172a' : '#94a3b8', padding: '8px 0' }}>
                      {formData.salary?.accountNumber || 'Not specified'}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    IFSC Code
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      placeholder="Enter IFSC code"
                      value={formData.salary?.ifsc || ''}
                      onChange={e => setFormData({
                        ...formData,
                        salary: { ...formData.salary, ifsc: e.target.value.toUpperCase() }
                      })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', textTransform: 'uppercase' }}
                    />
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: formData.salary?.ifsc ? '#0f172a' : '#94a3b8', padding: '8px 0' }}>
                      {formData.salary?.ifsc || 'Not specified'}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Account Holder Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      placeholder="Enter account holder name"
                      value={formData.salary?.accountHolderName || ''}
                      onChange={e => setFormData({
                        ...formData,
                        salary: { ...formData.salary, accountHolderName: e.target.value }
                      })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                    />
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: formData.salary?.accountHolderName ? '#0f172a' : '#94a3b8', padding: '8px 0' }}>
                      {formData.salary?.accountHolderName || 'Not specified'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payout Card */}
            <div style={{ backgroundColor: '#fff7ed', borderRadius: '14px', border: '1px solid #fed7aa', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#9a3412' }}>
                Upcoming Payout ({monthNames[parseInt(selectedMonth.split('-')[1]) - 1]})
              </h4>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#64748b', marginBottom: '6px' }}>
                  <span>Base Salary:</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{basicSalary.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: totalAbsentDeductions > 0 ? '#be123c' : '#64748b', marginBottom: '6px' }}>
                  <span>Absent Deduction ({attendanceStats.absent} days):</span>
                  <span style={{ fontWeight: '700' }}>
                    {totalAbsentDeductions > 0 ? `-₹${totalAbsentDeductions.toLocaleString('en-IN')}` : '₹0'}
                  </span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px dashed #fed7aa', margin: '8px 0' }} />
                <div style={{ fontSize: '12px', color: '#c2410c' }}>Net Estimated Payout</div>
                <div style={{ fontSize: '26px', fontWeight: '900', color: '#7c2d12', marginTop: '2px' }}>
                  ₹{netPayout.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11.5px', color: '#9a3412', marginTop: '4px' }}>
                  Cycle: {monthNames[parseInt(selectedMonth.split('-')[1]) - 1]} {selectedMonth.split('-')[0]}
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #fed7aa', margin: 0 }} />

              <button
                onClick={() => showToast(`Generated Salary Slip for ${formData.name}: Base ₹${basicSalary.toLocaleString('en-IN')}, Absent Deduction -₹${totalAbsentDeductions.toLocaleString('en-IN')}, Net Payout ₹${netPayout.toLocaleString('en-IN')}`)}
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#ff6600',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 6px rgba(255,102,0,0.25)'
                }}
              >
                <FileSpreadsheet size={15} />
                <span>Generate Salary Slip</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: KYC & DOCUMENTS */}
        {activeTab === 'documents' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                  Uploaded Documents & Proofs
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                  Verified government identity and employment documentation.
                </p>
              </div>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: '#ff6600',
                color: '#ffffff',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}>
                <Upload size={14} />
                <span>Upload Document</span>
                <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleUploadDocument} style={{ display: 'none' }} />
              </label>
            </div>

            <div className="staff-profile-grid-3">
              {(formData.documents || []).map((doc, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={28} color="#ef4444" />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{doc.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>PDF • {doc.size}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast(`Downloading ${doc.name}...`)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#3b82f6',
                      cursor: 'pointer',
                      padding: '6px'
                    }}
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Password Reset Modal */}
        {isPasswordModalOpen && (
          <div
            onClick={() => setIsPasswordModalOpen(false)}
            className="staff-profile-modal-overlay"
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

              <form onSubmit={handleResetPassword} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                  Enter a new password for <strong>{formData.name}</strong> ({formData.email}).
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password"
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
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                  />
                </div>

                <div className="staff-profile-modal-footer">
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
        {/* Roles & Permissions Edit Modal */}
        {isRolesModalOpen && (
          <div
            onClick={() => setIsRolesModalOpen(false)}
            className="staff-profile-modal-overlay"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="staff-profile-modal-box"
            >
              {/* Modal Header */}
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafbfc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={20} color="#ff6600" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                      Roles & Permissions
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                      Assign designation & module access for <strong>{formData.name}</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRolesModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSaveRolesModal} style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Role Designation Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
                    Select Staff Role <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={rolesForm.role}
                    onChange={e => setRolesForm({ ...rolesForm, role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '13.5px',
                      fontWeight: '600',
                      border: '1.5px solid #d1d5db',
                      borderRadius: '8px',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      color: '#0f172a'
                    }}
                  >
                    <option value="Store Manager">Store Manager</option>
                    <option value="Sales Associate">Sales Associate</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Inventory Executive">Inventory Executive</option>
                    <option value="Marketing Associate">Marketing Associate</option>
                    <option value="Store Supervisor">Store Supervisor</option>
                    <option value="Part-time (Weekend)">Part-time (Weekend)</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Admin / Super Admin">Admin / Super Admin</option>
                  </select>
                  <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    This role will be displayed on profile, staff list, and audit logs.
                  </span>
                </div>

                {/* Permissions Checkbox Grid */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', margin: 0 }}>
                      Module Permissions ({(rolesForm.permissions || []).length} assigned)
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={handleSelectAllPermissions}
                        style={{ background: 'none', border: 'none', color: '#ff6600', fontSize: '12px', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                      >
                        Select All
                      </button>
                      <span style={{ color: '#cbd5e1' }}>|</span>
                      <button
                        type="button"
                        onClick={handleClearAllPermissions}
                        style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="staff-profile-grid-roles" style={{ gap: '10px' }}>
                    {[
                      { name: 'Sales & Billing', key: 'Sales', desc: 'Bills, invoices & sales' },
                      { name: 'Inventory & Stock', key: 'Inventory', desc: 'Stock counts & warehouse' },
                      { name: 'Point of Sale (POS)', key: 'POS', desc: 'Terminal POS & barcode' },
                      { name: 'Reports & Analytics', key: 'Reports', desc: 'Profit/loss, GST & registers' },
                      { name: 'Discounts & Offers', key: 'Discounts', desc: 'Coupons & promotional deals' },
                      { name: 'Website Management', key: 'Website', desc: 'Storefront banners & catalog' }
                    ].map(item => {
                      const isChecked = (rolesForm.permissions || []).includes(item.key);
                      return (
                        <div
                          key={item.key}
                          onClick={() => toggleModalPermission(item.key)}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '10px',
                            border: isChecked ? '1.5px solid #ff6600' : '1px solid #e2e8f0',
                            backgroundColor: isChecked ? '#fff7ed' : '#ffffff',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleModalPermission(item.key)}
                            style={{ accentColor: '#ff6600', marginTop: '2px', cursor: 'pointer' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '12.5px', fontWeight: '700', color: isChecked ? '#9a3412' : '#0f172a' }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>
                              {item.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="staff-profile-modal-footer">
                  <button
                    type="button"
                    onClick={() => setIsRolesModalOpen(false)}
                    style={{
                      padding: '9px 16px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '9px 20px',
                      backgroundColor: '#ff6600',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(255, 102, 0, 0.3)'
                    }}
                  >
                    <Check size={14} />
                    <span>Save Roles & Permissions</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminStaffProfile;
