import Dashboard from "./pages/platforms/dashboard";
import ClustersList from "./pages/platforms/clusters/list";
import ClustersArchive from "./pages/platforms/clusters/archive";
import MembersList from "./pages/platforms/members/list";
import MembersArchive from "./pages/platforms/members/archive";
import BulkMessaging from "./pages/platforms/messaging";
import TagPeople from "./pages/platforms/tags";
// import Logs from "./logs";

const routes = [
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "messaging",
    element: <BulkMessaging />,
  },
  {
    path: "tags",
    element: <TagPeople />,
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
