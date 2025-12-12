/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { tokenManager, savedItemsApi, usersApi, type User } from "@/lib/api";
import { ordersApi } from "@/lib/api/orders";
import { useAddresses } from "@/lib/hooks/useAddresses";

type ModalType = "profile" | "password" | "address" | null;

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="p-6 space-y-4 text-sm text-slate-700">{children}</div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [modal, setModal] = useState<ModalType>(null);
  const [user, setUser] = useState<User | null>(null);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [recentOrders, setRecentOrders] = useState<
    { id: string; date: string; total: string; status: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileForm, setProfileForm] = useState<{ fullName: string; phone?: string; email: string }>({ fullName: "", phone: "", email: "" });
  const [passwordForm, setPasswordForm] = useState<{ oldPassword: string; newPassword: string; confirmPassword: string }>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  const {
    addresses,
    loading: addressesLoading,
    error: addressesError,
    addAddress,
    deleteAddress,
    updateAddress,
    refresh: refreshAddresses,
  } = useAddresses();
  const [newAddress, setNewAddress] = useState({
    street: "",
    apartment: "",
    city: "",
    state: "",
    country: "Nigeria",
    postalCode: "",
    isDefault: false,
    label: "",
  });

  const router = useRouter();

  const initials = useMemo(() => {
    if (!user?.fullName) return "??";
    const parts = user.fullName.trim().split(" ");
    const chars = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "");
    return chars.join("");
  }, [user]);

  useEffect(() => {
    const load = async () => {
      if (!tokenManager.isAuthenticated()) {
        router.push(`/auth/login?next=${encodeURIComponent("/profile")}`);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        // Fetch user via users/profile
        const userResp = await usersApi.getProfile();
        if (userResp.success && userResp.data) {
          setUser(userResp.data as User);
          setProfileForm({
            fullName: (userResp.data as User).fullName || "",
            phone: (userResp.data as User).phone || "",
            email: (userResp.data as User).email || "",
          });
        }

        // Fetch saved items count
        const savedResp = await savedItemsApi.list(1, 1);
        if (savedResp.success) {
          setSavedCount(savedResp.totalCount || (Array.isArray(savedResp.data) ? savedResp.data.length : 0));
        }

        // Fetch recent orders (limit 3)
        const ordersResp = await ordersApi.getOrders({ page: 1, limit: 3 });
        if (ordersResp.success && ordersResp.data && Array.isArray((ordersResp.data as any).data)) {
          const arr = (ordersResp.data as any).data as any[];
          setRecentOrders(
            arr.slice(0, 3).map((o) => ({
              id: o.orderNumber || o._id || "N/A",
              date: o.placedAt ? new Date(o.placedAt).toDateString() : "",
              total: o.totalAmount ? `₦${Number(o.totalAmount).toLocaleString()}` : "₦0",
              status: o.status || "pending",
            })),
          );
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  return (
    <div className="bg-slate-50 pb-16 pt-12">
      <div className="container space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-600">Manage your details, orders, and saved items.</p>
          {loading && <p className="text-xs text-slate-500">Loading your profile...</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-lg font-semibold text-slate-900">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{user?.fullName || "—"}</p>
                  <p className="text-xs text-slate-600">{user?.email || "—"}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Contact</p>
                <p>{user?.phone || "—"}</p>
                <p>Nigeria</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setModal("profile")}
                  className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-yellow-500"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setModal("password")}
                  className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-yellow-500"
                >
                  Change Password
                </button>
                <button
                  onClick={() => {
                    tokenManager.removeToken();
                    router.push('/');
                  }}
                  className="rounded border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-500 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
                <Link href="/profile/orders" className="text-sm font-semibold text-slate-800 hover:text-yellow-700">
                  View All
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {recentOrders.length === 0 ? (
                  <p className="py-4 text-sm text-slate-600">No recent orders.</p>
                ) : (
                  recentOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/profile/orders/${order.id}`}
                      className="block flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between transition hover:bg-yellow-50 hover:border-l-4 hover:border-yellow-500 rounded px-2 -mx-2 cursor-pointer"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{order.id}</p>
                        <p className="text-xs text-slate-600">{order.date}</p>
                      </div>
                      <div className="text-sm font-semibold text-slate-800">{order.total}</div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{order.status}</span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Addresses</h3>
              {addressesLoading ? (
                <p className="text-sm text-slate-600">Loading addresses...</p>
              ) : addressesError ? (
                <p className="text-sm text-red-600">{addressesError}</p>
              ) : addresses.length === 0 ? (
                <p className="text-sm text-slate-600">No addresses yet.</p>
              ) : (
                <div className="space-y-1 text-sm text-slate-700">
                  {addresses
                    .filter((a) => a.isDefault)
                    .slice(0, 1)
                    .map((addr) => (
                      <div key={addr._id}>
                        <p>
                          {addr.street}
                          {addr.apartment ? `, ${addr.apartment}` : ""}
                        </p>
                        <p>
                          {addr.city}, {addr.state}, {addr.country}
                        </p>
                        {addr.postalCode && <p>{addr.postalCode}</p>}
                      </div>
                    ))}
                </div>
              )}
              <button
                onClick={() => setModal("address")}
                className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-yellow-500"
              >
                Manage Addresses
              </button>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">Saved Items</h3>
              <p className="text-sm text-slate-600">
                {loading ? "Loading saved items..." : `You have ${savedCount} saved item${savedCount === 1 ? "" : "s"}.`}
              </p>
              <Link href="/profile/saved-items" className="rounded bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-500">
                View Saved
              </Link>
            </div>
          </div>
        </div>
      </div>

      {modal === "profile" && (
        <Modal title="Edit Profile" onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                placeholder="Full Name"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
              />
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 required">Email</label>
                <input
                  className="w-full rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                  placeholder="Email"
                  value={profileForm.email}
                  onChange={(e) => {
                    setEmailError(null);
                    setProfileForm((p) => ({ ...p, email: e.target.value }));
                  }}
                  required
                  aria-required="true"
                />
                {emailError && <p className="text-xs text-red-600">{emailError}</p>}
              </div>
              <input
                className="rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                placeholder="Phone"
                value={profileForm.phone}
                onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setModal(null)} className="rounded border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-yellow-500">
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    setProfileSaving(true);
                    const resp = await usersApi.updateProfile({
                      fullName: profileForm.fullName,
                      email: profileForm.email,
                      phone: profileForm.phone,
                    });
                    if (resp.success && resp.data) {
                      setUser(resp.data as User);
                      setModal(null);
                    } else {
                      if (resp.message?.toLowerCase().includes("email already")) {
                        setEmailError("This email is already in use. Please use a different email.");
                      }
                    }
                  } catch (err: any) {
                    const msg = err.response?.data?.message || "Failed to update profile";
                    if (msg.toLowerCase().includes("email already")) {
                      setEmailError("This email is already in use. Please use a different email.");
                    } else {
                      setError(msg);
                    }
                  } finally {
                    setProfileSaving(false);
                  }
                }}
                disabled={profileSaving}
                className="rounded bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-500 disabled:opacity-60"
              >
                {profileSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal === "password" && (
        <Modal title="Change Password" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 required">Current Password</label>
              <input
                type="password"
                required
                aria-required="true"
                className="w-full rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                placeholder="Enter current password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, oldPassword: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 required">New Password</label>
              <input
                type="password"
                required
                aria-required="true"
                className="w-full rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 required">Confirm New Password</label>
              <input
                type="password"
                required
                aria-required="true"
                className="w-full rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setModal(null)} className="rounded border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-yellow-500">
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                    setError("Passwords do not match");
                    return;
                  }
                  try {
                    setPasswordSaving(true);
                    await usersApi.changePassword(passwordForm.oldPassword, passwordForm.newPassword);
                    setModal(null);
                    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
                  } catch (err: any) {
                    setError(err.response?.data?.message || "Failed to change password");
                  } finally {
                    setPasswordSaving(false);
                  }
                }}
                disabled={passwordSaving}
                className="rounded bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-500 disabled:opacity-60"
              >
                {passwordSaving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal === "address" && (
        <Modal title="Manage Addresses" onClose={() => setModal(null)}>
          <div className="space-y-4">
            {addressesLoading ? (
              <p className="text-sm text-slate-600">Loading addresses...</p>
            ) : (
              <>
                {addresses.map((addr) => (
                  <div key={addr._id} className="rounded border border-slate-100 p-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 text-sm text-slate-700">
                        <p className="text-sm font-semibold text-slate-900">
                          {addr.label || "Address"} {addr.isDefault && <span className="text-xs text-yellow-700">(Default)</span>}
                        </p>
                        <p>
                          {addr.street}
                          {addr.apartment ? `, ${addr.apartment}` : ""}
                        </p>
                        <p>
                          {addr.city}, {addr.state}, {addr.country}
                        </p>
                        {addr.postalCode && <p>{addr.postalCode}</p>}
                      </div>
                      <div className="flex gap-2 text-xs font-semibold text-slate-600">
                        {!addr.isDefault && (
                          <button
                            onClick={async () => {
                              await updateAddress(addr._id, { isDefault: true });
                            }}
                            className="rounded border border-slate-200 px-3 py-1 transition hover:border-yellow-500"
                          >
                            Make Default
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            await deleteAddress(addr._id);
                          }}
                          className="rounded border border-slate-200 px-3 py-1 transition hover:border-yellow-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            <div className="space-y-2 border-t border-slate-100 pt-3">
              <p className="text-sm font-semibold text-slate-900">Add New</p>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 required">Street Address</label>
                <input
                  required
                  aria-required="true"
                  className="w-full rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                  placeholder="Street Address"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress((p) => ({ ...p, street: e.target.value }))}
                />
              </div>
              <input
                className="w-full rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                placeholder="Apartment / Suite (optional)"
                value={newAddress.apartment}
                onChange={(e) => setNewAddress((p) => ({ ...p, apartment: e.target.value }))}
              />
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-900 required">City</label>
                  <input
                    required
                    aria-required="true"
                    className="rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-900 required">State / Region</label>
                  <input
                    required
                    aria-required="true"
                    className="rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                    placeholder="State / Region"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress((p) => ({ ...p, state: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <input
                  className="rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                  placeholder="Country"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress((p) => ({ ...p, country: e.target.value }))}
                />
                <input
                  className="rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                  placeholder="Postal Code"
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress((p) => ({ ...p, postalCode: e.target.value }))}
                />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <input
                  className="rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                  placeholder="Label (e.g., Home, Office)"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress((p) => ({ ...p, label: e.target.value }))}
                />
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress((p) => ({ ...p, isDefault: e.target.checked }))}
                  />
                  Set as default
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={async () => {
                    const ok = await addAddress(newAddress);
                    if (ok) {
                      setNewAddress({
                        street: "",
                        apartment: "",
                        city: "",
                        state: "",
                        country: "Nigeria",
                        postalCode: "",
                        isDefault: false,
                        label: "",
                      });
                      await refreshAddresses();
                    }
                  }}
                  className="rounded bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-500"
                >
                  Save Address
                </button>
              </div>
              {addressesError && <p className="text-xs text-red-600">{addressesError}</p>}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

