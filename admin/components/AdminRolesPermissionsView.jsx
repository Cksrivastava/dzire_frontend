import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  Users,
  UserCheck,
  Key,
  Plus,
  Search,
  MoreHorizontal,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Store,
  RotateCcw,
  Receipt,
  Boxes,
  ShoppingBag,
  UserSquare2,
  Megaphone,
  Handshake,
  Users2,
  CreditCard,
  BarChart3,
  Settings,
  Edit2,
  Trash2,
  Copy,
  Eye,
  AlertCircle,
  PackageSearch
} from 'lucide-react';
import './AdminRolesPermissions.css';

export const initialRolesData = [
  {
    id: 1,
    name: 'Super Admin',
    icon: '👑',
    iconColor: '#f59e0b',
    iconBg: '#fef3c7',
    type: 'System',
    description: 'Full access to all modules and settings.',
    staffCount: 1,
    status: 'Active',
    permissions: {
      dashboard: ['create_kpi', 'view_dashboard', 'manage_kpi', 'delete_kpi'],
      sales: ['create_orders', 'view_orders', 'view_pos', 'edit_orders', 'process_returns', 'cancel_orders', 'delete_orders'],
      inventory: ['create_products', 'view_products', 'view_defective', 'update_stock', 'edit_products', 'delete_products'],
      purchase: ['create_po', 'view_po', 'view_invoices', 'approve_po', 'payment_out', 'delete_po'],
      customers: ['create_customers', 'view_customers', 'edit_customers', 'manage_credits', 'issue_refunds', 'delete_customers'],
      marketing: ['create_coupons', 'create_banners', 'view_offers', 'edit_banners', 'collaborations', 'delete_coupons'],
      website: ['create_blogs', 'create_events', 'view_website_content', 'manage_blogs', 'manage_categories', 'delete_blogs'],
      staff: ['create_staff', 'view_staff', 'view_attendance', 'manage_staff', 'manage_attendance', 'manage_salaries', 'manage_roles', 'delete_staff'],
      finance: ['create_expenses', 'view_reports', 'gst_reports', 'profit_loss', 'export_data', 'delete_records'],
      settings: ['create_api_keys', 'view_settings', 'audit_logs', 'store_settings', 'payment_gateways', 'shipping_settings', 'delete_backups']
    }
  },
  {
    id: 2,
    name: 'Store Manager',
    icon: '🏪',
    iconColor: '#2563eb',
    iconBg: '#eff6ff',
    type: 'System',
    description: 'Manages store operations, staff, inventory and sales.',
    staffCount: 2,
    status: 'Active',
    permissions: {
      dashboard: ['view_dashboard'],
      sales: ['view_orders', 'create_orders', 'edit_orders', 'cancel_orders', 'view_pos', 'process_returns'],
      inventory: ['view_products', 'update_stock', 'edit_products', 'view_defective'],
      purchase: ['view_po', 'create_po', 'view_invoices'],
      customers: ['view_customers', 'edit_customers', 'manage_credits'],
      marketing: ['view_offers', 'create_coupons'],
      staff: ['view_staff', 'view_attendance', 'manage_attendance'],
      finance: ['view_reports'],
      settings: []
    }
  },
  {
    id: 3,
    name: 'Sales Associate',
    icon: '👤',
    iconColor: '#0284c7',
    iconBg: '#e0f2fe',
    type: 'System',
    description: 'Handles POS and in-store customer orders.',
    staffCount: 2,
    status: 'Active',
    permissions: {
      dashboard: ['view_dashboard'],
      sales: ['view_orders', 'create_orders', 'view_pos', 'process_returns'],
      inventory: ['view_products'],
      purchase: [],
      customers: ['view_customers'],
      marketing: ['view_offers'],
      staff: [],
      finance: [],
      settings: []
    }
  },
  {
    id: 4,
    name: 'Inventory Executive',
    icon: '📦',
    iconColor: '#ea580c',
    iconBg: '#ffedd5',
    type: 'Custom',
    description: 'Manages inventory, stock adjustments, purchase orders.',
    staffCount: 1,
    status: 'Active',
    permissions: {
      dashboard: ['view_dashboard'],
      sales: ['view_orders'],
      inventory: ['view_products', 'update_stock', 'create_products', 'edit_products', 'view_defective'],
      purchase: ['view_po', 'create_po', 'view_invoices'],
      customers: [],
      marketing: [],
      staff: [],
      finance: ['view_reports'],
      settings: []
    }
  },
  {
    id: 5,
    name: 'Marketing Executive',
    icon: '📢',
    iconColor: '#3b82f6',
    iconBg: '#dbeafe',
    type: 'Custom',
    description: 'Manages offers, coupons, collaborations and content.',
    staffCount: 1,
    status: 'Active',
    permissions: {
      dashboard: ['view_dashboard'],
      sales: ['view_orders'],
      inventory: ['view_products'],
      purchase: [],
      customers: ['view_customers'],
      marketing: ['view_offers', 'create_coupons', 'edit_banners', 'collaborations'],
      staff: [],
      finance: ['view_reports'],
      settings: []
    }
  },
  {
    id: 6,
    name: 'Viewer (Reports Only)',
    icon: '📈',
    iconColor: '#16a34a',
    iconBg: '#dcfce7',
    type: 'Custom',
    description: 'Read-only access to reports and dashboards.',
    staffCount: 1,
    status: 'Active',
    permissions: {
      dashboard: ['view_dashboard'],
      sales: ['view_orders'],
      inventory: ['view_products'],
      purchase: [],
      customers: ['view_customers'],
      marketing: [],
      staff: [],
      finance: ['view_reports', 'gst_reports', 'profit_loss'],
      settings: []
    }
  }
];

export const crudCategories = [
  {
    type: 'create',
    label: 'Create Permissions (Add & Generate)',
    badgeLabel: 'CREATE',
    shortLabel: 'C',
    desc: 'Create new records, add items, generate vouchers & orders',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    badgeBg: '#dcfce7',
    badgeColor: '#15803d',
    icon: Plus
  },
  {
    type: 'read',
    label: 'Read Permissions (View & Inspect)',
    badgeLabel: 'READ',
    shortLabel: 'R',
    desc: 'Read & inspect lists, view details, audit records & view reports',
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    badgeBg: '#e0f2fe',
    badgeColor: '#0369a1',
    icon: Eye
  },
  {
    type: 'update',
    label: 'Update / Write Permissions (Edit & Modify)',
    badgeLabel: 'UPDATE / WRITE',
    shortLabel: 'U',
    desc: 'Edit existing records, modify prices, update status & approve records',
    color: '#ea580c',
    bg: '#fff7ed',
    border: '#fed7aa',
    badgeBg: '#ffedd5',
    badgeColor: '#c2410c',
    icon: Edit2
  },
  {
    type: 'delete',
    label: 'Delete Permissions (Delete & Remove)',
    badgeLabel: 'DELETE',
    shortLabel: 'D',
    desc: 'Cancel, remove, purge and permanently delete records',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecdd3',
    badgeBg: '#fee2e2',
    badgeColor: '#b91c1c',
    icon: Trash2
  }
];

export const moduleDefinitions = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    permissions: [
      { id: 'create_kpi', label: 'Create Custom KPIs', accessType: 'create', desc: 'Add and configure custom metric widgets & KPI cards' },
      { id: 'view_dashboard', label: 'View Dashboard & KPIs', accessType: 'read', desc: 'Read & view overall store metrics, revenue charts, and KPIs' },
      { id: 'manage_kpi', label: 'Edit Dashboard Layout', accessType: 'update', desc: 'Modify metric layout, filters, widgets and display order' },
      { id: 'delete_kpi', label: 'Delete KPI Widgets', accessType: 'delete', desc: 'Remove metric cards and custom widget configurations' }
    ]
  },
  {
    id: 'sales',
    label: 'Sales & POS',
    icon: ShoppingCart,
    permissions: [
      { id: 'create_orders', label: 'Create Orders & Bills', accessType: 'create', desc: 'Create & place new customer sales orders and generate bills' },
      { id: 'view_orders', label: 'View Orders', accessType: 'read', desc: 'Read & inspect online order list and order tracking details' },
      { id: 'view_pos', label: 'View POS / Store Sales', accessType: 'read', desc: 'Read POS registers and past store transaction history' },
      { id: 'edit_orders', label: 'Edit & Update Orders', accessType: 'update', desc: 'Modify order items, status, address before dispatch' },
      { id: 'process_returns', label: 'Process Returns & Exchanges', accessType: 'update', desc: 'Approve and handle customer return/exchange requests' },
      { id: 'cancel_orders', label: 'Cancel Active Orders', accessType: 'delete', desc: 'Cancel confirmed customer sales orders' },
      { id: 'delete_orders', label: 'Delete Order Records', accessType: 'delete', desc: 'Permanently delete cancelled or invalid order records' }
    ]
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Boxes,
    permissions: [
      { id: 'create_products', label: 'Create / Add Products', accessType: 'create', desc: 'Create new catalog products, SKUs, variants and barcodes' },
      { id: 'view_products', label: 'View Products & Stock', accessType: 'read', desc: 'Read catalog items, prices, and warehouse stock levels' },
      { id: 'view_defective', label: 'View Defective Stock', accessType: 'read', desc: 'Inspect damaged or defective item inventory' },
      { id: 'update_stock', label: 'Update Stock Quantities', accessType: 'update', desc: 'Write stock adjustments, replenishment, and counts' },
      { id: 'edit_products', label: 'Edit Products & Prices', accessType: 'update', desc: 'Modify product title, description, categories, and MRP' },
      { id: 'delete_products', label: 'Delete Catalog Products', accessType: 'delete', desc: 'Permanently remove products from the catalog' }
    ]
  },
  {
    id: 'purchase',
    label: 'Purchase & Vendor',
    icon: ShoppingBag,
    permissions: [
      { id: 'create_po', label: 'Create Purchase Orders', accessType: 'create', desc: 'Write and generate procurement orders for suppliers' },
      { id: 'view_po', label: 'View Purchase Orders', accessType: 'read', desc: 'Read supplier purchase orders and delivery estimates' },
      { id: 'view_invoices', label: 'View Purchase Invoices', accessType: 'read', desc: 'Audit inbound supplier bills and tax invoices' },
      { id: 'approve_po', label: 'Approve & Update POs', accessType: 'update', desc: 'Authorize procurement orders and high-value supplies' },
      { id: 'payment_out', label: 'Update Supplier Payments', accessType: 'update', desc: 'Disburse and record payments made to suppliers' },
      { id: 'delete_po', label: 'Delete Purchase Orders', accessType: 'delete', desc: 'Cancel and permanently delete supplier purchase orders' }
    ]
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: UserSquare2,
    permissions: [
      { id: 'create_customers', label: 'Create Customer Accounts', accessType: 'create', desc: 'Add new customer profiles and addresses' },
      { id: 'view_customers', label: 'View Customers Directory', accessType: 'read', desc: 'Read customer profiles, order history, and contact details' },
      { id: 'edit_customers', label: 'Edit Customer Profiles', accessType: 'update', desc: 'Update customer contact info, addresses, and tags' },
      { id: 'manage_credits', label: 'Update Store Credits', accessType: 'update', desc: 'Credit and debit store wallet balances' },
      { id: 'issue_refunds', label: 'Process Customer Refunds', accessType: 'update', desc: 'Process and approve direct customer bank refunds' },
      { id: 'delete_customers', label: 'Delete Customer Profiles', accessType: 'delete', desc: 'Permanently remove customer accounts and data' }
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing & Promos',
    icon: Megaphone,
    permissions: [
      { id: 'create_coupons', label: 'Create Promo Coupons', accessType: 'create', desc: 'Write & launch discount codes, rules, and limits' },
      { id: 'create_banners', label: 'Create Marketing Banners', accessType: 'create', desc: 'Upload and launch new homepage slider promotions' },
      { id: 'view_offers', label: 'View Offers & Discounts', accessType: 'read', desc: 'Read storefront coupons, banners, and ongoing deals' },
      { id: 'edit_banners', label: 'Edit Banners & Promotions', accessType: 'update', desc: 'Modify campaign rules, links, and promotional banners' },
      { id: 'collaborations', label: 'Manage Collaborations', accessType: 'update', desc: 'Update influencer and promotional partner campaigns' },
      { id: 'delete_coupons', label: 'Delete Coupons & Offers', accessType: 'delete', desc: 'Permanently remove expired or cancelled coupons' }
    ]
  },
  {
    id: 'website',
    label: 'Website Management',
    icon: PackageSearch,
    permissions: [
      { id: 'create_blogs', label: 'Create Blog Posts & Guides', accessType: 'create', desc: 'Draft and write new articles and trek stories' },
      { id: 'create_events', label: 'Create Events & Workshops', accessType: 'create', desc: 'Schedule and list outdoor workshops and treks' },
      { id: 'view_website_content', label: 'View Website Content', accessType: 'read', desc: 'Read online catalog, blogs, and events' },
      { id: 'manage_blogs', label: 'Edit & Publish Articles', accessType: 'update', desc: 'Modify blog content, SEO tags, and publish status' },
      { id: 'manage_categories', label: 'Edit Store Categories', accessType: 'update', desc: 'Add and organize online store category taxonomy' },
      { id: 'delete_blogs', label: 'Delete Articles & Events', accessType: 'delete', desc: 'Permanently delete blog posts and event listings' }
    ]
  },
  {
    id: 'staff',
    label: 'Staff & HR',
    icon: Users2,
    permissions: [
      { id: 'create_staff', label: 'Create / Add Staff', accessType: 'create', desc: 'Add new staff employee records and contact details' },
      { id: 'view_staff', label: 'View Staff Directory', accessType: 'read', desc: 'Read staff member profiles and store assignments' },
      { id: 'view_attendance', label: 'View Attendance Logs', accessType: 'read', desc: 'Read daily staff timesheets and monthly attendance' },
      { id: 'manage_staff', label: 'Edit Staff Details', accessType: 'update', desc: 'Update employee records, designations, and contacts' },
      { id: 'manage_attendance', label: 'Update Leaves & Attendance', accessType: 'update', desc: 'Mark leaves, approve timesheets, and adjust attendance' },
      { id: 'manage_salaries', label: 'Update Salaries & Payouts', accessType: 'update', desc: 'Configure salary structures and generate payslips' },
      { id: 'manage_roles', label: 'Update Roles & Permissions', accessType: 'update', desc: 'Create and modify administrative roles and privileges' },
      { id: 'delete_staff', label: 'Delete Staff Members', accessType: 'delete', desc: 'Permanently remove staff records from system' }
    ]
  },
  {
    id: 'finance',
    label: 'Finance & Reports',
    icon: BarChart3,
    permissions: [
      { id: 'create_expenses', label: 'Create Expense Records', accessType: 'create', desc: 'Record new expenditures and journal accounts' },
      { id: 'view_reports', label: 'View Sales & Revenue Reports', accessType: 'read', desc: 'Read daily, weekly, and monthly sales summaries' },
      { id: 'gst_reports', label: 'View GST & Tax Reports', accessType: 'read', desc: 'Read B2B/B2C GST filings and tax liability sheets' },
      { id: 'profit_loss', label: 'View Profit & Loss Statements', accessType: 'read', desc: 'Read net profit margins, COGS, and expense summaries' },
      { id: 'export_data', label: 'Export & Update Ledgers', accessType: 'update', desc: 'Download Excel and PDF accounting ledgers' },
      { id: 'delete_records', label: 'Delete Draft Accounting Records', accessType: 'delete', desc: 'Purge draft or void financial journal entries' }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    permissions: [
      { id: 'create_api_keys', label: 'Generate API Keys', accessType: 'create', desc: 'Generate webhooks and third-party developer API credentials' },
      { id: 'view_settings', label: 'View Store Configuration', accessType: 'read', desc: 'Read business profile, active gateways, and shipping rates' },
      { id: 'audit_logs', label: 'View Audit Logs', accessType: 'read', desc: 'Inspect security logs and administrative action history' },
      { id: 'store_settings', label: 'Edit Store Details', accessType: 'update', desc: 'Modify store address, legal entity, and tax information' },
      { id: 'payment_gateways', label: 'Configure Payment Gateways', accessType: 'update', desc: 'Update Razorpay, Stripe, and UPI credentials' },
      { id: 'shipping_settings', label: 'Configure Shipping Partners', accessType: 'update', desc: 'Modify courier partners, Shiprocket keys, and rates' },
      { id: 'delete_backups', label: 'Delete Backups & Logs', accessType: 'delete', desc: 'Purge system logs and temporary cache backups' }
    ]
  }
];

const AdminRolesPermissionsView = () => {
  const navigate = useNavigate();

  // Load from localStorage or initial
  const [rolesList, setRolesList] = useState(() => {
    try {
      const saved = localStorage.getItem('dzire_roles_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Guarantee Super Admin has full CRUD permissions
          const superAdminPerms = initialRolesData[0].permissions;
          return parsed.map(role => {
            if (role.id === 1 || role.name === 'Super Admin') {
              return { ...role, permissions: { ...superAdminPerms } };
            }
            return role;
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
    return initialRolesData;
  });

  const [staffList, setStaffList] = useState([]);

  const fetchRoles = async () => {
    try {
      const res = await fetch("https://dzire-backend.onrender.com/api/admin/roles");
      const json = await res.json();
      if (json.success && Array.isArray(json.roles)) {
        setRolesList(json.roles);
        try {
          localStorage.setItem('dzire_roles_data', JSON.stringify(json.roles));
        } catch (e) { }
      }
    } catch (err) {
      console.error("Failed to load roles from backend:", err);
    }
  };

  const fetchStaffCount = async () => {
    try {
      const res = await fetch("https://dzire-backend.onrender.com/api/admin/staff");
      const json = await res.json();
      if (json.success && Array.isArray(json.staff)) {
        setStaffList(json.staff);
      }
    } catch (err) {
      console.error("Failed to load staff for roles:", err);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchStaffCount();
  }, []);

  const saveRoles = (newRoles) => {
    setRolesList(newRoles);
    try {
      localStorage.setItem('dzire_roles_data', JSON.stringify(newRoles));
    } catch (e) {
      console.error(e);
    }
  };

  // State
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'System' | 'Custom'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Drawer Edit / Create State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('edit'); // 'edit' | 'create'
  const [drawerTab, setDrawerTab] = useState('Permissions'); // 'Basic Details' | 'Permissions'
  const [selectedModuleId, setSelectedModuleId] = useState('dashboard');
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);

  // Current Editing Role
  const [editingRole, setEditingRole] = useState(rolesList[1]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Stats
  const totalRoles = rolesList.length;
  const activeStaff = useMemo(() => {
    return staffList.length > 0 ? staffList.filter(s => s.status === 'Active').length : 8;
  }, [staffList]);
  const totalPermissions = useMemo(() => {
    return moduleDefinitions.reduce((acc, m) => acc + m.permissions.length, 0);
  }, []);
  const customRoles = rolesList.filter(r => r.type === 'Custom').length;

  // Helper for role permissions CRUD summary
  const getRoleCrudSummary = (role) => {
    if (role.id === 1 || role.name === 'Super Admin') {
      return { isFull: true, text: 'Full CRUD (10 Modules)' };
    }
    const perms = role.permissions || {};
    let totalAssigned = 0;
    let activeModulesCount = 0;
    Object.keys(perms).forEach(modKey => {
      const pList = perms[modKey] || [];
      if (pList.length > 0) {
        activeModulesCount += 1;
        totalAssigned += pList.length;
      }
    });
    return {
      isFull: false,
      text: `${activeModulesCount} Modules Active (${totalAssigned} CRUD ops)`
    };
  };

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    return rolesList.filter(role => {
      if (activeTab === 'System' && role.type !== 'System') return false;
      if (activeTab === 'Custom' && role.type !== 'Custom') return false;
      if (statusFilter !== 'All' && role.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = role.name.toLowerCase().includes(q);
        const matchDesc = role.description.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [rolesList, activeTab, statusFilter, searchQuery]);

  // Handlers
  const handleOpenEdit = (role) => {
    setEditingRole(JSON.parse(JSON.stringify(role)));
    setDrawerMode('edit');
    setDrawerTab('Permissions');
    setSelectedModuleId('dashboard');
    setIsDrawerOpen(true);
    setActionMenuOpenId(null);
  };

  const handleOpenCreate = () => {
    const newRole = {
      id: Date.now(),
      name: '',
      icon: '🛡️',
      iconColor: '#ff6600',
      iconBg: '#fff7ed',
      type: 'Custom',
      description: '',
      staffCount: 0,
      status: 'Active',
      permissions: {
        dashboard: ['view_dashboard'],
        sales: [],
        inventory: [],
        purchase: [],
        customers: [],
        marketing: [],
        staff: [],
        finance: [],
        settings: []
      }
    };
    setEditingRole(newRole);
    setDrawerMode('create');
    setDrawerTab('Basic Details');
    setSelectedModuleId('dashboard');
    setIsDrawerOpen(true);
  };

  const handleSaveRole = async (e) => {
    if (e) e.preventDefault();
    if (!editingRole.name.trim()) {
      alert('Role Name is required');
      return;
    }

    if (drawerMode === 'create') {
      try {
        const res = await fetch("https://dzire-backend.onrender.com/api/admin/roles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingRole),
        });
        const data = await res.json();
        const savedRole = (data.success && data.role) ? data.role : editingRole;
        const updated = [...rolesList, savedRole];
        saveRoles(updated);
      } catch (err) {
        console.error(err);
        saveRoles([...rolesList, editingRole]);
      }
      showToast(`Role "${editingRole.name}" created successfully!`);
    } else {
      try {
        const res = await fetch(`https://dzire-backend.onrender.com/api/admin/roles/${editingRole.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingRole),
        });
        const data = await res.json();
        const updatedRole = (data.success && data.role) ? data.role : editingRole;
        const updated = rolesList.map(r => String(r.id) === String(editingRole.id) ? updatedRole : r);
        saveRoles(updated);
      } catch (err) {
        console.error(err);
        const updated = rolesList.map(r => String(r.id) === String(editingRole.id) ? editingRole : r);
        saveRoles(updated);
      }
      showToast(`Role "${editingRole.name}" updated successfully!`);
    }
    setIsDrawerOpen(false);
  };

  // Helper to determine active access level for a module
  const getModuleAccessSummary = (moduleId, rolePermissions) => {
    const modDef = moduleDefinitions.find(m => m.id === moduleId);
    if (!modDef) return { level: 'none', label: 'No Access', color: '#64748b', bg: '#f1f5f9' };

    const activePerms = rolePermissions?.[moduleId] || [];
    if (activePerms.length === 0) {
      return { level: 'none', label: 'No Access', color: '#64748b', bg: '#f1f5f9' };
    }

    const allPerms = modDef.permissions.map(p => p.id);
    if (allPerms.every(id => activePerms.includes(id))) {
      return { level: 'full', label: 'Full CRUD', color: '#15803d', bg: '#dcfce7' };
    }

    const types = ['create', 'read', 'update', 'delete'].filter(t =>
      modDef.permissions.some(p => p.accessType === t && activePerms.includes(p.id))
    );
    const shortLabels = types.map(t => t.toUpperCase()[0]).join('/');
    return { level: 'custom', label: `${shortLabels} (${activePerms.length})`, color: '#0284c7', bg: '#e0f2fe' };
  };

  const handleSetModuleAccess = (moduleId, accessLevel) => {
    const modDef = moduleDefinitions.find(m => m.id === moduleId);
    if (!modDef) return;

    let newPerms = [];
    if (accessLevel === 'read') {
      newPerms = modDef.permissions.filter(p => p.accessType === 'read').map(p => p.id);
      showToast(`Set "${modDef.label}" to Read Only access`);
    } else if (accessLevel === 'crud' || accessLevel === 'full' || accessLevel === 'write') {
      newPerms = modDef.permissions.map(p => p.id);
      showToast(`Set "${modDef.label}" to Full CRUD access`);
    } else if (accessLevel === 'none') {
      newPerms = [];
      showToast(`Removed all access for "${modDef.label}"`);
    }

    setEditingRole(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleId]: newPerms
      }
    }));
  };

  const handleToggleAccessTypeAll = (moduleId, type) => {
    const modDef = moduleDefinitions.find(m => m.id === moduleId);
    if (!modDef) return;

    const targetPermIds = modDef.permissions.filter(p => p.accessType === type).map(p => p.id);
    const currentPerms = editingRole.permissions?.[moduleId] || [];
    const allTargetSelected = targetPermIds.length > 0 && targetPermIds.every(id => currentPerms.includes(id));

    let updatedList;
    if (allTargetSelected) {
      updatedList = currentPerms.filter(id => !targetPermIds.includes(id));
    } else {
      updatedList = Array.from(new Set([...currentPerms, ...targetPermIds]));
    }

    setEditingRole(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleId]: updatedList
      }
    }));
  };

  const handleTogglePermission = (moduleId, permId) => {
    setEditingRole(prev => {
      const currentPerms = prev.permissions?.[moduleId] || [];
      const hasPerm = currentPerms.includes(permId);
      const updatedList = hasPerm
        ? currentPerms.filter(p => p !== permId)
        : [...currentPerms, permId];

      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [moduleId]: updatedList
        }
      };
    });
  };

  const handleToggleSelectAllModule = (moduleId) => {
    const moduleDef = moduleDefinitions.find(m => m.id === moduleId);
    if (!moduleDef) return;

    const allPermIds = moduleDef.permissions.map(p => p.id);
    const currentPerms = editingRole.permissions?.[moduleId] || [];
    const isAllSelected = allPermIds.every(id => currentPerms.includes(id));

    setEditingRole(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleId]: isAllSelected ? [] : allPermIds
      }
    }));
  };

  const handleDuplicateRole = async (role) => {
    const duplicated = {
      ...role,
      id: Date.now(),
      name: `${role.name} (Copy)`,
      type: 'Custom',
      staffCount: 0
    };
    try {
      const res = await fetch("https://dzire-backend.onrender.com/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicated),
      });
      const data = await res.json();
      const savedRole = (data.success && data.role) ? data.role : duplicated;
      const updated = [...rolesList, savedRole];
      saveRoles(updated);
    } catch (err) {
      console.error(err);
      saveRoles([...rolesList, duplicated]);
    }
    showToast(`Role "${role.name}" duplicated!`);
    setActionMenuOpenId(null);
  };

  const handleDeleteRole = async (roleId) => {
    const role = rolesList.find(r => r.id === roleId || String(r.id) === String(roleId));
    if (role?.type === 'System') {
      alert('System roles cannot be deleted.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete role "${role?.name}"?`)) {
      try {
        await fetch(`https://dzire-backend.onrender.com/api/admin/roles/${roleId}`, {
          method: "DELETE"
        });
      } catch (err) {
        console.error(err);
      }
      const updated = rolesList.filter(r => String(r.id) !== String(roleId));
      saveRoles(updated);
      showToast(`Role deleted successfully.`);
    }
    setActionMenuOpenId(null);
  };

  const toggleSelectRole = (id) => {
    setSelectedRoleIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRoleIds.length === filteredRoles.length) {
      setSelectedRoleIds([]);
    } else {
      setSelectedRoleIds(filteredRoles.map(r => r.id));
    }
  };

  return (
    <div className="roles-view-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="roles-toast">
          <Check size={16} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="roles-header">
        <div className="roles-header-title">
          <h1>Roles & Permissions</h1>
          <p>Create roles and control what your team can access and do.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="roles-create-btn"
        >
          <Plus size={16} />
          <span>Create Role</span>
        </button>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="roles-kpi-grid">
        {/* Card 1: Total Roles */}
        <div className="roles-kpi-card">
          <div className="roles-kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="roles-kpi-value">
              {totalRoles}
            </div>
            <div className="roles-kpi-label">
              Total Roles
            </div>
          </div>
        </div>

        {/* Card 2: Active Staff */}
        <div className="roles-kpi-card">
          <div className="roles-kpi-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <UserCheck size={22} />
          </div>
          <div>
            <div className="roles-kpi-value">
              {activeStaff}
            </div>
            <div className="roles-kpi-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span>Active Staff</span>
              <span
                onClick={() => navigate('/admin/staff')}
                style={{ color: '#0284c7', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Manage Staff
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Permissions */}
        <div className="roles-kpi-card">
          <div className="roles-kpi-icon" style={{ backgroundColor: '#fefce8', color: '#ca8a04' }}>
            <Key size={22} />
          </div>
          <div>
            <div className="roles-kpi-value">
              {totalPermissions}
            </div>
            <div className="roles-kpi-label">
              Total Permissions
            </div>
          </div>
        </div>

        {/* Card 4: Custom Roles */}
        <div className="roles-kpi-card">
          <div className="roles-kpi-icon" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
            <Shield size={22} />
          </div>
          <div>
            <div className="roles-kpi-value">
              {customRoles}
            </div>
            <div className="roles-kpi-label">
              Custom Roles
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="roles-main-card">
        {/* Filter Tabs */}
        <div className="roles-filter-tabs">
          {[
            { id: 'All', label: `All Roles (${rolesList.length})` },
            { id: 'System', label: `System Roles (${rolesList.filter(r => r.type === 'System').length})` },
            { id: 'Custom', label: `Custom Roles (${rolesList.filter(r => r.type === 'Custom').length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="roles-tab-btn"
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

        {/* Search & Filter Toolbar */}
        <div className="roles-toolbar">
          {/* Search Input */}
          <div className="roles-search-box">
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search roles by name or description..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="roles-search-input"
            />
          </div>

          {/* Status Dropdown */}
          <div className="roles-status-filter">
            <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: '500' }}>Status</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="roles-status-select"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Roles Master Table */}
        <div className="roles-table-wrapper">
          <table className="roles-table">
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', fontSize: '12px', fontWeight: '600', color: '#64748b', backgroundColor: '#fafbfc' }}>
                <th style={{ padding: '12px 16px', width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={selectedRoleIds.length === filteredRoles.length && filteredRoles.length > 0}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer', accentColor: '#ff6600' }}
                  />
                </th>
                <th style={{ padding: '12px 16px', minWidth: '160px' }}>Role Name</th>
                <th style={{ padding: '12px 16px', minWidth: '200px' }}>Description</th>
                <th style={{ padding: '12px 16px', minWidth: '180px' }}>CRUD Permissions Scope</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', minWidth: '90px' }}>No. of Staff</th>
                <th style={{ padding: '12px 16px', minWidth: '90px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', minWidth: '70px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '14px' }}>
                    No roles match the current filter.
                  </td>
                </tr>
              ) : (
                filteredRoles.map(role => {
                  const isChecked = selectedRoleIds.includes(role.id);
                  return (
                    <tr
                      key={role.id}
                      onClick={() => handleOpenEdit(role)}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: '14px 16px' }} onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectRole(role.id)}
                          style={{ cursor: 'pointer', accentColor: '#ff6600' }}
                        />
                      </td>

                      {/* Role Name with Icon */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: role.iconBg || '#eff6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            flexShrink: 0
                          }}>
                            {role.icon}
                          </div>
                          <div>
                            <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>
                              {role.name}
                            </span>
                            {role.type === 'System' && (
                              <span style={{ marginLeft: '8px', fontSize: '10.5px', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#64748b', fontWeight: '600' }}>
                                System
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569', maxWidth: '380px', wordBreak: 'break-word' }}>
                        {role.description}
                      </td>

                      {/* CRUD Permissions Scope */}
                      <td style={{ padding: '14px 16px' }}>
                        {role.id === 1 || role.name === 'Super Admin' ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '4px 10px', borderRadius: '6px' }}>
                            <ShieldCheck size={14} color="#059669" />
                            <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#047857' }}>
                              Full CRUD (All 10 Modules)
                            </span>
                          </div>
                        ) : (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '4px 10px', borderRadius: '6px' }}>
                            <Key size={12} color="#64748b" />
                            <span style={{ fontSize: '11.5px', fontWeight: '600', color: '#334155' }}>
                              {getRoleCrudSummary(role).text}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* No. of Staff */}
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#334155', textAlign: 'center' }}>
                        {role.staffCount}
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '11.5px',
                          fontWeight: '600',
                          backgroundColor: role.status === 'Active' ? '#dcfce7' : '#fee2e2',
                          color: role.status === 'Active' ? '#15803d' : '#b91c1c'
                        }}>
                          {role.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', textAlign: 'center', position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setActionMenuOpenId(actionMenuOpenId === role.id ? null : role.id)}
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

                        {/* Dropdown Menu */}
                        {actionMenuOpenId === role.id && (
                          <div style={{
                            position: 'absolute',
                            right: '16px',
                            top: '36px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                            zIndex: 50,
                            minWidth: '160px',
                            padding: '6px 0',
                            textAlign: 'left'
                          }}>
                            <button
                              onClick={() => handleOpenEdit(role)}
                              style={{
                                width: '100%',
                                padding: '8px 14px',
                                background: 'none',
                                border: 'none',
                                fontSize: '12.5px',
                                color: '#ff6600',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff7ed'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Edit2 size={13} />
                              <span>Edit Permissions</span>
                            </button>

                            <button
                              onClick={() => handleDuplicateRole(role)}
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
                              <Copy size={13} />
                              <span>Duplicate Role</span>
                            </button>

                            {role.type !== 'System' && (
                              <button
                                onClick={() => handleDeleteRole(role.id)}
                                style={{
                                  width: '100%',
                                  padding: '8px 14px',
                                  background: 'none',
                                  border: 'none',
                                  fontSize: '12.5px',
                                  color: '#ef4444',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <Trash2 size={13} />
                                <span>Delete Role</span>
                              </button>
                            )}
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
        <div className="roles-pagination">
          <div className="roles-pagination-info">
            Showing 1-{filteredRoles.length} of {filteredRoles.length} roles
          </div>

          <div className="roles-pagination-controls">
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
            </select>
          </div>
        </div>
      </div>

      {/* EDIT / CREATE ROLE POPUP MODAL */}
      {isDrawerOpen && editingRole && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="roles-modal-backdrop"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="roles-modal-container"
          >
            {/* Modal Header */}
            <div className="roles-modal-header">
              <div>
                <h2>{drawerMode === 'create' ? 'Create New Role' : 'Edit Role'}</h2>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Sub-Tabs (Basic Details | Permissions) */}
            <div className="roles-modal-subtabs">
              {['Basic Details', 'Permissions'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setDrawerTab(tab)}
                  className="roles-modal-subtab-btn"
                  style={{
                    borderBottom: drawerTab === tab ? '2px solid #ff6600' : '2px solid transparent',
                    fontWeight: drawerTab === tab ? '700' : '500',
                    color: drawerTab === tab ? '#ff6600' : '#64748b'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Role Header Info Banner */}
            <div className="roles-modal-banner">
              <div className="roles-modal-banner-name">
                {editingRole.name || 'Untitled Role'}
              </div>
              <div className="roles-modal-banner-desc">
                {editingRole.description || 'Set permissions for this role across modules.'}
              </div>
            </div>

            {/* Drawer Body */}
            <div className="roles-modal-body">
              {/* TAB 1: BASIC DETAILS */}
              {drawerTab === 'Basic Details' && (
                <div className="roles-form-scroll">
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Role Name *
                    </label>
                    <input
                      type="text"
                      value={editingRole.name}
                      onChange={e => setEditingRole({ ...editingRole, name: e.target.value })}
                      placeholder="e.g. Regional Manager, Auditor"
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Role Type
                    </label>
                    <select
                      value={editingRole.type}
                      onChange={e => setEditingRole({ ...editingRole, type: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff' }}
                    >
                      <option value="Custom">Custom Role</option>
                      <option value="System">System Role</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Description
                    </label>
                    <textarea
                      rows="3"
                      value={editingRole.description}
                      onChange={e => setEditingRole({ ...editingRole, description: e.target.value })}
                      placeholder="Describe the responsibilities and scope of this role..."
                      style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Status
                    </label>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      {['Active', 'Inactive'].map(st => (
                        <label key={st} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="status"
                            checked={editingRole.status === st}
                            onChange={() => setEditingRole({ ...editingRole, status: st })}
                            style={{ accentColor: '#ff6600' }}
                          />
                          <span>{st}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PERMISSIONS (Read & Write Access Management) */}
              {drawerTab === 'Permissions' && (
                <div className="roles-permissions-split">
                  {/* Left Column: Module Navigation */}
                  <div className="roles-module-sidebar">
                    <div className="roles-module-sidebar-title">
                      Modules & Scope
                    </div>
                    {moduleDefinitions.map(mod => {
                      const Icon = mod.icon;
                      const isSelected = selectedModuleId === mod.id;
                      const activePermsForMod = editingRole.permissions?.[mod.id] || [];
                      const totalModPerms = mod.permissions.length;
                      const hasAll = totalModPerms > 0 && activePermsForMod.length === totalModPerms;
                      const hasSome = activePermsForMod.length > 0;

                      return (
                        <button
                          key={mod.id}
                          onClick={() => setSelectedModuleId(mod.id)}
                          className="roles-module-btn"
                          style={{
                            border: isSelected ? '1px solid #ffedd5' : '1px solid transparent',
                            backgroundColor: isSelected ? '#fff7ed' : 'transparent',
                            color: isSelected ? '#ea580c' : '#475569',
                            fontWeight: isSelected ? '800' : '600'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Icon size={15} />
                            <span>{mod.label}</span>
                          </div>
                          {hasAll ? (
                            <span style={{ fontSize: '9.5px', fontWeight: '800', backgroundColor: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px', border: '1px solid #bbf7d0', marginLeft: '6px' }}>
                              CRUD
                            </span>
                          ) : hasSome ? (
                            <span style={{ fontSize: '10px', fontWeight: '700', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '1px 6px', borderRadius: '4px', marginLeft: '6px' }}>
                              {activePermsForMod.length}/{totalModPerms}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column: CRUD Permissions for Active Module */}
                  <div className="roles-permissions-content">
                    {moduleDefinitions.map(mod => {
                      if (selectedModuleId && selectedModuleId !== mod.id) return null;

                      const activePerms = editingRole.permissions?.[mod.id] || [];

                      return (
                        <div key={mod.id}>
                          {/* Module Header */}
                          <div style={{ marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                              {mod.label} Permissions
                            </h3>
                            <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                              Granular CRUD controls: Select Create, Read, Update/Write, and Delete operations independently.
                            </p>
                          </div>

                          {/* 4 Separate CRUD Sections: CREATE, READ, UPDATE, DELETE */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {crudCategories.map(cat => {
                              const permsOfCat = mod.permissions.filter(p => p.accessType === cat.type);
                              if (permsOfCat.length === 0) return null;

                              const selectedCount = permsOfCat.filter(p => activePerms.includes(p.id)).length;
                              const isAllChecked = permsOfCat.length > 0 && selectedCount === permsOfCat.length;
                              const CatIcon = cat.icon;

                              return (
                                <div key={cat.type} style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                  {/* CRUD Category Header */}
                                  <div style={{
                                    padding: '9px 14px',
                                    backgroundColor: cat.bg,
                                    borderBottom: `1px solid ${cat.border}`,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '8px'
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <CatIcon size={14} color={cat.color} />
                                      <span style={{ fontSize: '12.5px', fontWeight: '800', color: cat.badgeColor }}>
                                        {cat.label}
                                      </span>
                                      <span style={{
                                        fontSize: '10.5px',
                                        color: cat.badgeColor,
                                        backgroundColor: cat.badgeBg,
                                        padding: '1px 7px',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        border: `1px solid ${cat.border}`
                                      }}>
                                        {selectedCount} / {permsOfCat.length}
                                      </span>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleToggleAccessTypeAll(mod.id, cat.type)}
                                      style={{ background: 'none', border: 'none', color: cat.color, fontSize: '11.5px', fontWeight: '700', cursor: 'pointer' }}
                                    >
                                      {isAllChecked ? 'Deselect All' : `Select All ${cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}`}
                                    </button>
                                  </div>

                                  {/* Individual Permissions in Category */}
                                  <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {permsOfCat.map(perm => {
                                      const isChecked = activePerms.includes(perm.id);
                                      return (
                                        <label
                                          key={perm.id}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '10px',
                                            padding: '9px 12px',
                                            borderRadius: '8px',
                                            backgroundColor: isChecked ? cat.bg : '#ffffff',
                                            border: isChecked ? `1px solid ${cat.border}` : '1px solid #f1f5f9',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease'
                                          }}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleTogglePermission(mod.id, perm.id)}
                                            style={{ marginTop: '2px', accentColor: cat.color, cursor: 'pointer', width: '15px', height: '15px' }}
                                          />
                                          <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                              <span style={{ fontSize: '12.5px', fontWeight: '700', color: isChecked ? '#0f172a' : '#334155' }}>
                                                {perm.label}
                                              </span>
                                              <span style={{
                                                padding: '1px 6px',
                                                backgroundColor: cat.badgeBg,
                                                color: cat.badgeColor,
                                                fontSize: '9.5px',
                                                fontWeight: '800',
                                                borderRadius: '4px',
                                                letterSpacing: '0.4px'
                                              }}>
                                                {cat.badgeLabel}
                                              </span>
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                              {perm.desc}
                                            </div>
                                          </div>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Bottom Action Buttons */}
            <div className="roles-modal-footer">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                style={{
                  padding: '9px 18px',
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
                type="button"
                onClick={handleSaveRole}
                style={{
                  padding: '9px 24px',
                  backgroundColor: '#ff6600',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(255, 102, 0, 0.3)'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRolesPermissionsView;
