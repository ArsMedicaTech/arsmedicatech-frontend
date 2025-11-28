import React, { useEffect, useState } from 'react';
import ClinicList from '../components/ClinicList';
import OrganizationForm from '../components/OrganizationForm';
import { useUser } from '../components/UserContext';
import { organizationAPI } from '../services/api';
import { useTranslation } from 'react-i18next';

const OrganizationPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useUser();
  const [org, setOrg] = useState<any | null>(null);
  const [orgLoading, setOrgLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  // Fetch organization for the current user
  useEffect(() => {
    const fetchOrg = async () => {
      if (!user || !isAuthenticated) return;
      setOrgLoading(true);
      setError(null);
      try {
        const found = await organizationAPI.getById(user.id);
        setOrg(found || null);
      } catch (error) {
        setError(t('failed_fetch_org'));
      } finally {
        setOrgLoading(false);
      }
    };
    fetchOrg();
  }, [user, isAuthenticated, t]);

  const handleEdit = () => setEditing(true);
  const handleCancelEdit = () => setEditing(false);

  const handleUpdateOrg = async (updatedOrg: any) => {
    if (!org || !org.id) return;
    setError(null);
    setOrgLoading(true);
    try {
      const res = await organizationAPI.update(org.id, updatedOrg);
      const data = await res.json();
      if (res.ok) {
        setOrg(data.organization || updatedOrg);
        setEditing(false);
      } else {
        setError(data.error || t('failed_update_org'));
      }
    } catch (err: any) {
      setError(err.message || t('network_error'));
    } finally {
      setOrgLoading(false);
    }
  };

  const handleOrgUpdate = async () => {
    if (!user || !isAuthenticated) return;
    try {
      const found = await organizationAPI.getById(user.id);
      setOrg(found || null);
    } catch (error) {
      setError(t('failed_refresh_org'));
    }
  };

  if (isLoading || orgLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading_organization')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {t('auth_required')}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {t('must_login_manage_org')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (
    user.role !== 'admin' &&
    user.role !== 'administrator' &&
    user.role !== 'superadmin'
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {t('access_denied')}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {t('no_permission_org')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // CASE: Organization exists
  if (org) {
    if (editing) {
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('edit_organization')}
                </h2>
                <button
                  onClick={handleCancelEdit}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('cancel')}
                </button>
              </div>

              <OrganizationForm
                onSuccess={handleUpdateOrg}
                createdBy={user.id}
                initialValues={org}
              />

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // VIEW MODE
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {t('organization_details')}
              </h2>

              <button
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {t('edit')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('organization_name')}
                  </label>
                  <p className="mt-1 text-lg text-gray-900">{org.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('organization_type')}
                  </label>
                  <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {org.org_type}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('country')}
                  </label>
                  <p className="mt-1 text-lg text-gray-900">
                    {org.country || t('not_specified')}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('description')}
                </label>
                <p className="mt-1 text-gray-900">
                  {org.description || t('no_description')}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <ClinicList organizationId={org.id} onUpdate={handleOrgUpdate} />
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // CASE: No organization yet
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">

          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              {t('create_organization')}
            </h2>

            <p className="mt-2 text-gray-600">
              {t('create_org_instructions')}
            </p>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>{t('organization_limit')}:</strong>{' '}
                {t('organization_limit_info', {
                  created: user.user_organizations,
                  max: user.max_organizations,
                })}
              </p>
            </div>
          </div>

          <OrganizationForm onSuccess={setOrg} createdBy={user.id} />

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;
