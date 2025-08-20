'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  EyeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@/types';

interface SettingsSection {
  id: string;
  name: string;
  icon: any;
  description: string;
}

const settingsSections: SettingsSection[] = [
  {
    id: 'profile',
    name: 'Profile',
    icon: UserIcon,
    description: 'Manage your personal information and account details'
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: BellIcon,
    description: 'Control how and when you receive notifications'
  },
  {
    id: 'privacy',
    name: 'Privacy & Security',
    icon: ShieldCheckIcon,
    description: 'Manage your privacy settings and security preferences'
  },
  {
    id: 'appearance',
    name: 'Appearance',
    icon: PaintBrushIcon,
    description: 'Customize the look and feel of your interface'
  },
  {
    id: 'language',
    name: 'Language & Region',
    icon: GlobeAltIcon,
    description: 'Set your language and regional preferences'
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    icon: EyeIcon,
    description: 'Configure accessibility features and options'
  }
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
      bio: ''
    },
    notifications: {
      email: true,
      push: true,
      assignments: true,
      progress: true,
      achievements: true,
      reminders: true
    },
    privacy: {
      profileVisibility: 'school',
      progressVisibility: 'teachers',
      allowMessages: true,
      dataSharing: false
    },
    appearance: {
      theme: 'light',
      colorScheme: 'blue',
      compactMode: false,
      animations: true
    },
    language: {
      language: 'en',
      region: 'US',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY'
    },
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      dyslexiaFont: false,
      screenReader: false,
      voiceNavigation: false
    }
  });

  const handleSave = async () => {
    try {
      // Save settings to backend
      const response = await fetch('/api/backend/users/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={settings.profile.name}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            profile: { ...prev.profile, name: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={settings.profile.email}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            profile: { ...prev.profile, email: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          value={settings.profile.bio}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            profile: { ...prev.profile, bio: e.target.value }
          }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us about yourself..."
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <p className="text-sm text-gray-500">
                Receive notifications for {key.toLowerCase()}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, [key]: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Theme
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['light', 'dark', 'auto'].map((theme) => (
            <button
              key={theme}
              onClick={() => setSettings(prev => ({
                ...prev,
                appearance: { ...prev.appearance, theme }
              }))}
              className={`p-3 border rounded-lg text-center capitalize ${
                settings.appearance.theme === theme
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {theme === 'light' && <SunIcon className="h-6 w-6 mx-auto mb-1" />}
              {theme === 'dark' && <MoonIcon className="h-6 w-6 mx-auto mb-1" />}
              {theme === 'auto' && <ComputerDesktopIcon className="h-6 w-6 mx-auto mb-1" />}
              {theme}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      default:
        return (
          <div className="text-center py-12">
            <Cog6ToothIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {settingsSections.find(s => s.id === activeSection)?.name} Settings
            </h3>
            <p className="text-gray-600">
              This section is coming soon!
            </p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
                <nav className="space-y-2">
                  {settingsSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <section.icon className="mr-3 h-5 w-5" />
                      {section.name}
                    </button>
                  ))}
                </nav>
              </div>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <Card>
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {settingsSections.find(s => s.id === activeSection)?.name}
                  </h2>
                  <p className="text-gray-600">
                    {settingsSections.find(s => s.id === activeSection)?.description}
                  </p>
                </div>

                {renderSectionContent()}

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
