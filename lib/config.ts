export const decoyConfig = {
  appName: "Demo Admin Portal",
  appType: "internal_admin",
  theme: "corporate_blue",
  modules: ["employees", "reports", "settings"],
  data: {
    employees: 1248,
    activeReports: 42,
    systemHealth: "99.9%",
    monthlyRevenue: "$4.2M"
  },
  fakeMessages: [
    "Authenticating credentials...",
    "Verifying security tokens...",
    "Loading employee records...",
    "Fetching payroll reports..."
  ]
};
