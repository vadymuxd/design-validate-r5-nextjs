'use client';

import React, { useState, useEffect } from 'react';

interface UserStats {
  device_type?: string;
  os?: string;
  city?: string;
  region?: string;
  country?: string;
  total_users: number;
  active_last_7_days: number;
  active_last_30_days: number;
}

interface UserAnalytics {
  totalUsers: number;
  deviceStats: UserStats[];
  osStats: UserStats[];
  countryStats: UserStats[];
  cityStats: UserStats[];
  regionStats: UserStats[];
}

interface UserAnalyticsResponse {
  success: boolean;
  analytics: UserAnalytics;
  error?: string;
}

export function UserAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/user-tracking');
        const data: UserAnalyticsResponse = await response.json();
        
        if (data.success) {
          setAnalytics(data.analytics);
        } else {
          setError(data.error || 'Failed to fetch analytics');
        }
      } catch (err) {
        setError('Network error fetching analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  const StatCard = ({ title, stats }: { title: string; stats: UserStats[] }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-600">
              {stat.device_type || stat.os || stat.country || 
               (stat.city && stat.region && stat.country ? `${stat.city}, ${stat.region}, ${stat.country}` : '') ||
               (stat.region && stat.country ? `${stat.region}, ${stat.country}` : '')}
            </span>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-800">
                {stat.total_users} total
              </div>
              <div className="text-xs text-gray-500">
                {stat.active_last_7_days} (7d) • {stat.active_last_30_days} (30d)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-2">User Analytics</h2>
        <div className="text-3xl font-bold text-blue-600">
          {analytics.totalUsers} Total Users
        </div>
        <p className="text-gray-600 mt-2">
          Users tracked by device ID across all pages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Device Types" stats={analytics.deviceStats} />
        <StatCard title="Operating Systems" stats={analytics.osStats} />
        <StatCard title="Countries" stats={analytics.countryStats} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Cities" stats={analytics.cityStats} />
        <StatCard title="Regions" stats={analytics.regionStats} />
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">About This Data</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            • <strong>Total Users:</strong> Unique device IDs tracked since implementation
          </p>
          <p>
            • <strong>7d Active:</strong> Users seen in the last 7 days
          </p>
          <p>
            • <strong>30d Active:</strong> Users seen in the last 30 days
          </p>
          <p>
            • <strong>Device ID:</strong> Generated from browser user agent (no personal data)
          </p>
          <p>
            • <strong>Location:</strong> City, region, and country determined from IP address geolocation
          </p>
        </div>
      </div>
    </div>
  );
}
