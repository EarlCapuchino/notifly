import Dashboard from "./pages/platforms/dashboard";
import ClustersList from "./pages/platforms/clusters/list";
import ClustersArchive from "./pages/platforms/clusters/archive";
import MembersList from "./pages/platforms/members/list";
import MembersArchive from "./pages/platforms/members/archive";
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
        element: <MembersList />,
      },
      {
        path: "archive",
        element: <MembersArchive />,
      },
    ],
  },
];

export default routes;
