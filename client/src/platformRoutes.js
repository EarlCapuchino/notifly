import Dashboard from "./pages/platforms/dashboard";
import ClustersList from "./pages/platforms/clusters/list";
import ClustersArchive from "./pages/platforms/clusters/archive";
// import CompaniesList from "./companies/list";
// import CompaniesArchive from "./companies/archive";
// import Logs from "./logs";

const routes = [
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "clusters",
    children: [
      {
        path: "list",
        element: <ClustersList />,
      },
      {
        path: "archive",
        element: <ClustersArchive />,
      },
    ],
  },
  {
    path: "members",
    children: [
      {
        path: "list",
        element: <ClustersList />,
      },
      {
        path: "archive",
        element: <ClustersArchive />,
      },
    ],
  },
];

export default routes;
