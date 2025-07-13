import { useState } from 'react';
import Joyride from 'react-joyride';
import { Outlet } from 'react-router-dom';
import './App.css';
import PatientForm from './components/PatientForm';
import { tourSteps } from './onboarding/tourSteps';
import { EncounterDetail } from './pages/EncounterDetail';
import { EncounterFormPage } from './pages/EncounterForm';
import LabResults from './pages/LabResults';
import OptimalTableDemo from './pages/OptimalTableDemo';
import { PatientDetail } from './pages/PatientDetail';
import { Patients } from './pages/Patients';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import Schedule from './pages/Schedule';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  NotificationProvider,
  useNotificationContext,
} from './components/NotificationContext';
import PatientIntakeForm from './components/PatientIntakeForm';
import Settings from './components/Settings';
import { UserProvider } from './components/UserContext';

import logger from './services/logging';

function Home() {
  logger.debug('Home component rendered');

  // TODO: Make this more programmatically flexible...
  // [AMT-035] User Onboarding Flows
  // This should load when the user first logs in and then update the state to not run again
  // And during e2e testing, it should always be disabled.
  //const isTestMode = process.env.NODE_ENV === 'test' || process.env.DISABLE_TOUR === 'true';
  const isTestMode = true;
  const [runTour, setRunTour] = useState(!isTestMode);

  // Get notification context
  const {
    unreadCount,
    getRecentNotifications,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
  } = useNotificationContext();

  return (
    <div className="App app-container">
      <Sidebar />
      <div className="main-container">
        <Topbar
          unreadCount={unreadCount}
          recentNotifications={getRecentNotifications(5)}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onClearNotification={clearNotification}
          onClearAll={clearAllNotifications}
        />

        <div className="main-content">
          <main>
            {/* This is where the nested routes will render */}
            <Outlet />
          </main>
          <Joyride
            steps={tourSteps}
            continuous={true} // let the user move from step to step seamlessly
            scrollToFirstStep={true}
            showProgress={true} // display step count
            showSkipButton={true} // allow skipping
            run={runTour} // start or stop the tour
            callback={data => {
              const { status } = data;
              if (status === 'finished' || status === 'skipped') {
                setRunTour(false);
              }
            }}
            styles={{
              options: { zIndex: 10000 },
            }}
          />
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <div>
      <h1>About</h1>
      <p>This is the about page.</p>
    </div>
  );
}

function Contact() {
  return (
    <div>
      <h1>Contact</h1>
      <p>This is the contact page.</p>
    </div>
  );
}

function ErrorPage() {
  return (
    <div>
      <h1>404</h1>
      <p>Page not found.</p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'patients', element: <Patients /> },
      { path: 'patients/new', element: <PatientForm /> },
      { path: 'patients/:patientId', element: <PatientDetail /> },
      { path: 'patients/:patientId/edit', element: <PatientForm /> },
      { path: 'encounters/:encounterId', element: <EncounterDetail /> },
      { path: 'encounters/new', element: <EncounterFormPage /> },
      { path: 'encounters/:encounterId/edit', element: <EncounterFormPage /> },
      {
        path: 'patients/:patientId/encounters/new',
        element: <EncounterFormPage />,
      },
      { path: 'intake/:patientId', element: <PatientIntakeForm /> },
      { path: 'schedule', element: <Schedule /> },
      { path: 'messages', element: <Messages /> },
      { path: 'settings', element: <Settings /> },
      { path: 'lab-results', element: <LabResults /> },
      { path: 'optimal-table-demo', element: <OptimalTableDemo /> },
    ],
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <UserProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </UserProvider>
  );
}

export default App;
