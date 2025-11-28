import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { usePluginWidgets } from '../hooks/usePluginWidgets';
import logger from '../services/logging';
import './Sidebar.css';
import { useUser } from './UserContext';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { user, isLoading } = useUser();
  const userType = user?.role || 'guest';
  const widgets = usePluginWidgets();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();

  logger.debug('Sidebar user:', user);

  if (isLoading) return null;

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-container">ArsMedicaTech</div>
        <div className="release-info">Version 0.0.1 (alpha)</div>
        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? t('expand') : t('collapse')}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      <nav className={isCollapsed ? "collapsed" : ""}>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
              title={t('dashboard')}
            >
              {isCollapsed ? "📊" : t('dashboard')}
            </NavLink>
          </li>

          {(userType === "administrator" ||
            userType === "superadmin" ||
            userType === "admin") && (
            <>
              <li>
                <NavLink
                  to="/organization"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  title={t('organization')}
                >
                  {isCollapsed ? "🏢" : t('organization')}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  title={t('admin')}
                >
                  {isCollapsed ? "⚙️" : t('admin')}
                </NavLink>
              </li>
            </>
          )}

          {userType === "patient" ? (
            <>
              {user?.id && (
                <li>
                  <NavLink
                    to={`/intake/${user.id}`}
                    className={({ isActive }) => (isActive ? "active" : "")}
                    title={t('intakeForm')}
                  >
                    {isCollapsed ? "📝" : t('intakeForm')}
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  to="/health-metrics"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  title={t('healthMetrics')}
                >
                  {isCollapsed ? "📈" : t('healthMetrics')}
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/patients"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  title={t('patients')}
                >
                  {isCollapsed ? "👥" : t('patients')}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/optimal-table-demo"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  title={t('optimalDemo')}
                >
                  {isCollapsed ? "📊" : t('optimalDemo')}
                </NavLink>
              </li>
            </>
          )}

          <li>
            <NavLink
              to="/lab-results"
              className={({ isActive }) => (isActive ? "active" : "")}
              title={t('labResults')}
            >
              {isCollapsed ? "🧪" : t('labResults')}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/messages"
              className={({ isActive }) => (isActive ? "active" : "")}
              title={t('messages')}
            >
              {isCollapsed ? "💬" : t('messages')}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/schedule"
              className={({ isActive }) => (isActive ? "active" : "")}
              title={t('schedule')}
            >
              {isCollapsed ? "📅" : t('schedule')}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? "active" : "")}
              title={t('settings')}
            >
              {isCollapsed ? "⚙️" : t('settings')}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/uploads"
              className={({ isActive }) => (isActive ? "active" : "")}
              title={t('uploads')}
            >
              {isCollapsed ? "📁" : t('uploads')}
            </NavLink>
          </li>

          {widgets.map((widget) => (
            <li key={widget.name}>
              <NavLink
                to={widget.path}
                className={({ isActive }) => (isActive ? "active" : "")}
                title={isCollapsed ? widget.name : ""}
              >
                {isCollapsed ? "🔧" : widget.name}
              </NavLink>
            </li>
          ))}

          <li>
            <NavLink
              to="/notes"
              className={({ isActive }) => (isActive ? "active" : "")}
              title={t('notes')}
            >
              {isCollapsed ? "📝" : t('notes')}
            </NavLink>
          </li>
        </ul>
      </nav>

      {!isCollapsed && (
        <div className="sidebar-footer">
          <div className="corner-user-avatar"></div>
          <div className="corner-user-info">
            <h4>{t('hello')}, {user?.username}</h4>
            <p>
              {t('remainingAppointments', { count: user?.appointments || 0 })}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
