// Sidebar.tsx 
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { usePluginWidgets } from '../hooks/usePluginWidgets';
import logger from '../services/logging';
import './Sidebar.css';
import authService from '../services/auth';
import { useUser } from './UserContext';
import { appointmentService } from '../services/appointments';

// Utility functions
const is_today = (dateString: string) => {
  const today = new Date().toISOString().split('T')[0];
  return dateString === today;
};

const is_in_past = (dateTime: Date) => {
  const now = new Date();
  return dateTime < now;
};

const isAuthenticated = authService.isAuthenticated();

const Sidebar = () => {
  const { user, isLoading } = useUser();
  const userType = user?.role || 'guest';
  const widgets = usePluginWidgets();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);

  logger.debug('Sidebar user:', user);

  const fetchAppointments = async () => {
    if (isAuthenticated) {
      const user = authService.getUser();
      const userId = user?.id?.split(':')[1] || user?.id;
      console.log('Current User ID:', userId);
      const response = await appointmentService.getAppointments(userId);
      console.log('appointments', response);
      setAppointments(response.appointments || []);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [isAuthenticated]);

  useEffect(() => {
    const handleAppointmentCreated = () => {
      console.log('Appointment created event received, refreshing sidebar...');
      fetchAppointments();
    };

    window.addEventListener('appointmentCreated', handleAppointmentCreated);

    return () => {
      window.removeEventListener('appointmentCreated', handleAppointmentCreated);
    };
  }, []);

  if (isLoading) return null;

  const remainingToday = appointments.filter((apt: any) => {
    const aptDate = apt.appointment_date;
    const aptTime = apt.start_time;
    const aptDateTime = new Date(`${aptDate}T${aptTime}`);
    return is_today(aptDate) && !is_in_past(aptDateTime);
  }).length;

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">ArsMedicaTech</div>
        <div className="release-info">Version 0.0.1 (alpha)</div>
        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className={isCollapsed ? 'collapsed' : ''}>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active' : '')}
              title='Dashboard'
            >
              {isCollapsed ? '📊' : 'Dashboard'}
            </NavLink>
          </li>

          {(userType === 'administrator' || userType === 'superadmin' || userType === 'admin') && (
            <>
              <li>
                <NavLink
                  to="/organization"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  title='Organization'
                >
                  {isCollapsed ? '🏢' : 'Organization'}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  title='Admin'
                >
                  {isCollapsed ? '⚙️' : 'Admin'}
                </NavLink>
              </li>
            </>
          )}

          {userType === 'patient' ? (
            <>
              {user?.id && (
                <li>
                  <NavLink
                    to={`/intake/${user.id}`}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    title='Intake Form'
                  >
                    {isCollapsed ? '📝' : 'Intake Form'}
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  to="/health-metrics"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  title='Health Metrics'
                >
                  {isCollapsed ? '📈' : 'Health Metrics'}
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/patients"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  title='Patients'
                >
                  {isCollapsed ? '👥' : 'Patients'}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/optimal-table-demo"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  title='Optimal Demo'
                >
                  {isCollapsed ? '📊' : 'Optimal Demo'}
                </NavLink>
              </li>
            </>
          )}

          <li>
            <NavLink
              to="/lab-results"
              className={({ isActive }) => (isActive ? 'active' : '')}
              title='Lab Results'
            >
              {isCollapsed ? '🧪' : 'Lab Results'}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/messages"
              className={({ isActive }) => (isActive ? 'active' : '')}
              title='Messages'
            >
              {isCollapsed ? '💬' : 'Messages'}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/schedule"
              className={({ isActive }) => (isActive ? 'active' : '')}
              title='Schedule'
            >
              {isCollapsed ? '📅' : 'Schedule'}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? 'active' : '')}
              title='Settings'
            >
              {isCollapsed ? '⚙️' : 'Settings'}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/uploads"
              className={({ isActive }) => (isActive ? 'active' : '')}
              title='Uploads'
            >
              {isCollapsed ? '📁' : 'Uploads'}
            </NavLink>
          </li>

          {widgets.map((widget) => (
            <li key={widget.name}>
              <NavLink
                to={widget.path}
                className={({ isActive }) => (isActive ? 'active' : '')}
                title={isCollapsed ? widget.name : ''}
              >
                {isCollapsed ? '🔧' : widget.name}
              </NavLink>
            </li>
          ))}

          <li>
            <NavLink
              to="/notes"
              className={({ isActive }) => (isActive ? 'active' : '')}
              title='Notes'
            >
              {isCollapsed ? '📝' : 'Notes'}
            </NavLink>
          </li>
        </ul>
      </nav>

      {!isCollapsed && (
        <div className="sidebar-footer">
          <div className="corner-user-avatar"></div>
          <div className="corner-user-info">
            <h4>
              Hello, {user?.username}
            </h4>
            <p>Remaining appointments today: {remainingToday}</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
