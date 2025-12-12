"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usersApi, tokenManager } from "@/lib/api";
import type { User } from "@/lib/api/types";
import Image from "next/image";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!tokenManager.isAuthenticated()) {
        router.replace("/admin/login");
        return;
      }

      try {
        setLoading(true);
        const response = await usersApi.getProfile();
        if (response.success && response.data) {
          const userData = response.data as User;
          setUser(userData);
          setProfileForm({
            fullName: userData.fullName || "",
            email: userData.email || "",
            phone: userData.phone || "",
          });
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const response = await usersApi.updateProfile(profileForm);
      if (response.success && response.data) {
        setUser(response.data as User);
        setSuccess("Profile updated successfully!");
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        setEmailError("This email is already in use. Please use a different email.");
      } else {
        setError(err.response?.data?.message || "Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setSaving(true);

    try {
      const response = await usersApi.changePassword(
        passwordForm.oldPassword,
        passwordForm.newPassword
      );
      if (response.success) {
        setSuccess("Password changed successfully!");
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    if (!user?.fullName) return "AD";
    return user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Profile Settings</h1>
        <p className="text-sm text-slate-600 mt-1">Manage your admin account information</p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 border border-green-200">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Information */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile Information</h2>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
            {user?.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt={user.fullName || "Admin"}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-yellow-600 flex items-center justify-center text-slate-900 font-semibold text-xl">
                {getInitials()}
              </div>
            )}
            <div>
              <p className="font-semibold text-slate-900">{user?.fullName || "Admin"}</p>
              <p className="text-sm text-slate-600">{user?.email || ""}</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={profileForm.email}
                onChange={(e) => {
                  setProfileForm({ ...profileForm, email: e.target.value });
                  setEmailError(null);
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
                placeholder="Enter your email"
              />
              {emailError && (
                <p className="mt-1 text-xs text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">Phone</label>
              <input
                type="tel"
                value={profileForm.phone || ""}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
                placeholder="Enter your phone number"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Change Password</h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Current Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

