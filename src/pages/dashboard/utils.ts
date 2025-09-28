export const hasDashboardAccess = (roles: string[]) => {
  return roles.includes("dispatcher") || roles.includes("admin");
};
