"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import AddressBook from "./AddressBook";
import Wishlist from "./Wishlist";
import ProfileForm from "./ProfileForm";
import OrdersSection from "./OrdersSection";

export default function ClientDashboard({ userData }) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex min-h-screen bg-primary">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userData={userData} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Profile Section */}
        {activeTab === "profile" && (
          <section className="">
            <ProfileForm userData={userData} />
          </section>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && <OrdersSection />}

        {/* Addresses Tab */}
        {activeTab === "addresses" && <AddressBook />}

        {/* Wishlist Tab */}
        {activeTab === "wishlist" && <Wishlist />}
      </main>
    </div>
  );
}
