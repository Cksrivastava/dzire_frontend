import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShopContext } from '../context/ShopContext';
import './CustomerAccount.css';
import { ChevronRight } from 'lucide-react';

import AccountSidebar from '../components/AccountSidebar';
import AccountHeader from '../components/AccountHeader';

import ProfileBannerCard from '../components/customer-account/ProfileBannerCard';
import ProfileOrdersTable from '../components/customer-account/ProfileOrdersTable';
import PersonalInfoCard from '../components/customer-account/PersonalInfoCard';
import DzireCreditCardWidget from '../components/customer-account/DzireCreditCardWidget';
import EditProfileModal from '../components/customer-account/EditProfileModal';
import { userAPI } from '../services/api';

const CustomerAccount = () => {
  const { user, refreshUser } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login?redirectTo=/profile');
    }
  }, [user, navigate]);

  // Profile data state
  const [profileData, setProfileData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    gender: user?.gender || "",
    dobFormatted: user?.dobFormatted || user?.dob || "",
    altPhone: user?.altPhone || "",
    altEmail: user?.altEmail || "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        dobFormatted: user.dobFormatted || user.dob || "",
        altPhone: user.altPhone || "",
        altEmail: user.altEmail || "",
      });
    }
  }, [user]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...profileData });

  const handleOpenEdit = () => {
    setEditFormData({ ...profileData });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileData({ ...editFormData });
    setIsEditModalOpen(false);

    try {
      const res = await userAPI.updateProfile({
        name: editFormData.fullName,
        phone: editFormData.phone,
        gender: editFormData.gender,
        dobFormatted: editFormData.dobFormatted,
        altPhone: editFormData.altPhone,
        altEmail: editFormData.altEmail,
      });
      if (res && res.user && refreshUser) {
        await refreshUser();
      }
    } catch (err) {
      console.warn("Backend profile sync error:", err);
    }
  };

  const avatarUrl =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="profile-page-wrapper">
        {/* Top Breadcrumb Bar */}
        <div className="profile-top-breadcrumb-bar">
          <div className="profile-top-breadcrumb">
            <Link to="/" className="breadcrumb-home">
              Home
            </Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-active">My Profile</span>
          </div>
        </div>

        <div className="profile-page-container">
          {/* Left Sidebar Navigation */}
          <AccountSidebar />

          {/* Main Dashboard Content */}
          <main className="profile-main-content">
            {/* Top Page Title & Breadcrumbs Header with Mobile Toggle */}
            <AccountHeader
              title="My Profile"
              subtitle="Manage your personal information and account settings"
            />

            {/* Top User Profile Header Banner Card */}
            <ProfileBannerCard
              avatarUrl={avatarUrl}
              profileData={profileData}
              user={user}
              onVerifyPhone={() =>
                window.dispatchEvent(new Event("openPhoneVerificationModal"))
              }
            />

            {/* Full-Width Order History Section */}
            <ProfileOrdersTable />

            {/* Grid Layout for Personal Info & Payment Methods */}
            <div className="profile-grid">
              <PersonalInfoCard
                profileData={profileData}
                onOpenEdit={handleOpenEdit}
                onVerifyPhone={() =>
                  window.dispatchEvent(new Event("openPhoneVerificationModal"))
                }
              />

              <DzireCreditCardWidget />
            </div>
          </main>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        editFormData={editFormData}
        onChange={handleEditChange}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />

      <Footer />
    </>
  );
};

export default CustomerAccount;
