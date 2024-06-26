import ClustersList from "./pages/platforms/clusters/list";
import ClustersArchive from "./pages/platforms/clusters/archive";
import MembersList from "./pages/platforms/members/list";
import MembersArchive from "./pages/platforms/members/archive";
import BulkMessaging from "./pages/platforms/messaging";
import ClusterMailing from "./pages/platforms/mails";
import TagPeople from "./pages/platforms/tags";
import PostsList from "./pages/platforms/posts/list";
import PostsArchive from "./pages/platforms/posts/archive";
import MeetingsList from "./pages/platforms/meetings/list";
import MeetingsArchive from "./pages/platforms/meetings/archive";
import PagesList from "./pages/platforms/pages/list";
import PagesArchive from "./pages/platforms/pages/archive";
import GroupChatsList from "./pages/platforms/groupChats/list";
import GroupChatsArchive from "./pages/platforms/groupChats/archive";
import FBGroupsList from "./pages/platforms/fbGroups/list";
import FBGroupsArchive from "./pages/platforms/fbGroups/archive";
// import Logs from "./logs";

const routes = [
  {
    path: "messaging",
    element: <BulkMessaging />,
  },
  {
    path: "mails",
    element: <ClusterMailing />,
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
  {
    path: "posts",
    children: [
      {
        path: "list",
        element: <PostsList />,
      },
      {
        path: "archive",
        element: <PostsArchive />,
      },
    ],
  },
  {
    path: "pages",
    children: [
      {
        path: "list",
        element: <PagesList />,
      },
      {
        path: "archive",
        element: <PagesArchive />,
      },
    ],
  },
  {
    path: "meetings",
    children: [
      {
        path: "list",
        element: <MeetingsList />,
      },
      {
        path: "archive",
        element: <MeetingsArchive />,
      },
    ],
  },
  {
    path: "groupchats",
    children: [
      {
        path: "list",
        element: <GroupChatsList />,
      },
      {
        path: "archive",
        element: <GroupChatsArchive />,
      },
    ],
  },
  {
    path: "fbgroups",
    children: [
      {
        path: "list",
        element: <FBGroupsList />,
      },
      {
        path: "archive",
        element: <FBGroupsArchive />,
      },
    ],
  },
];

export default routes;
