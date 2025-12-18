import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { usePluginWidgets } from '../hooks/usePluginWidgets';
import logger from '../services/logging';
import './Sidebar.css';
import { useUser } from './UserContext';

// It is recommended to use an icon library like react-icons
// import { FiGrid, FiUsers, FiMessageSquare, FiCalendar } from 'react-icons/fi';
import { appointmentService } from '../services/appointments';
import authService from '../services/auth';

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
      window.removeEventListener(
        'appointmentCreated',
        handleAppointmentCreated
      );
    };
  }, []);

  if (isLoading) return null; // or a spinner

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
          {/* Add the `active` class to the active route... */}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active' : '')}
              title={isCollapsed ? 'Dashboard' : ''}
            >
              {isCollapsed ? '📊' : 'Dashboard'}
            </NavLink>
          </li>
          {(userType === 'administrator' ||
            userType === 'superadmin' ||
            userType === 'admin') && (
            <>
              <li>
                <NavLink
                  to="/organization"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  title={isCollapsed ? 'Organization' : ''}
                >
                  {isCollapsed ? '🏢' : 'Organization'}
                </NavLink>
              </li>
            </>
          )}

          {userType === 'administrator' ||
            userType === 'superadmin' ||
            (userType === 'admin' && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  title={isCollapsed ? 'Admin' : ''}
                >
                  {isCollapsed ? '⚙️' : 'Admin'}
                </NavLink>
              </li>
            ))}

          {userType === 'patient' ? (
            <>
              {user?.id && (
                <li>
                  <NavLink
                    to={`/intake/${user.id}`}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    title={isCollapsed ? 'Intake Form' : ''}
                  >
                    {isCollapsed ? '📝' : 'Intake Form'}
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  to="/health-metrics"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  title={isCollapsed ? 'Health Metrics' : ''}
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
                  title={isCollapsed ? 'Patients' : ''}
                >
                  {isCollapsed ? '👥' : 'Patients'}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/optimal-table-demo"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  title={isCollapsed ? 'Optimal (Demo)' : ''}
                >
                  {isCollapsed ? '📊' : 'Optimal (Demo)'}
                </NavLink>
              </li>
            </>
          )}
          <li>
            <NavLink
              to="/lab-results"
              className={({ isActive }) => (isActive ? 'active' : '')}
              title={isCollapsed ? 'Lab Results' : ''}
            >
              {isCollapsed ? '🧪' : 'Lab Results'}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/messages"
              className={({ isActive }) => (isActive ? 'active' : '')}
              title={isCollapsed ? 'Messages' : ''}
            >
              {isCollapsed ? '💬' : 'Messages'}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/schedule"
              className={({ isActive }) => (isActive ? 'active' : '')}
              title={isCollapsed ? 'Schedule' : ''}
            >
              {isCollapsed ? '📅' : 'Schedule'}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? 'active' : '')}
              title={isCollapsed ? 'Settings' : ''}
            >
              {isCollapsed ? '⚙️' : 'Settings'}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/uploads"
              className={({ isActive }) => (isActive ? 'active' : '')}
              title={isCollapsed ? 'Uploads' : ''}
            >
              {isCollapsed ? '📁' : 'Uploads'}
            </NavLink>
          </li>
          {widgets.map(widget => (
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
              title={isCollapsed ? 'Notes' : ''}
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
            <h4>Hello {user?.username}</h4>
            <p>
              You have {user?.appointments || 0} remaining appointments
              scheduled today
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
