import React, { createContext, useContext } from 'react';
import { useApp } from './AppContext';
import { studentConfig } from '../data/roleConfig/student';
import { seniorConfig } from '../data/roleConfig/senior';
import { recruiterConfig } from '../data/roleConfig/recruiter';
import { collegeAdminConfig } from '../data/roleConfig/collegeAdmin';
import { platformAdminConfig } from '../data/roleConfig/platformAdmin';
import { facultyConfig } from '../data/roleConfig/faculty';
import { studentSeniorConfig } from '../data/roleConfig/studentSenior';
import { recruiterAlumniConfig } from '../data/roleConfig/recruiterAlumni';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { userRole } = useApp();

  const getRoleConfig = () => {
    switch (userRole) {
      case 'Student':
        return studentConfig;
      case 'Senior/Alumni':
        return seniorConfig;
      case 'Recruiter':
        return recruiterConfig;
      case 'College Admin':
        return collegeAdminConfig;
      case 'Platform Admin':
        return platformAdminConfig;
      case 'Faculty':
        return facultyConfig;
      case 'Student + Senior':
        return studentSeniorConfig;
      case 'Recruiter + Alumni':
        return recruiterAlumniConfig;
      default:
        return studentConfig;
    }
  };

  const activeConfig = getRoleConfig();

  const isAllowedTab = (tab) => {
    return activeConfig.allowedTabs.includes(tab);
  };

  return (
    <RoleContext.Provider value={{
      activeConfig,
      isAllowedTab,
      roleName: activeConfig.roleName,
      sidebarItems: activeConfig.sidebar,
      quickActions: activeConfig.quickActions,
      dashboardWidgets: activeConfig.dashboardWidgets,
      settingsTabs: activeConfig.settingsTabs,
      recommendations: activeConfig.recommendations
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
