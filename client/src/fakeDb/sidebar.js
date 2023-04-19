const Sidebar = [
  {
    name: "Messaging",
    icon: "mail-bulk",
    path: "messaging",
  },
  {
    name: "Tag people",
    icon: "tag",
    path: "tags",
  },
  {
    name: "Posts",
    icon: "newspaper",
    path: "posts",
    children: [
      {
        name: "List",
        icon: "clipboard-list",
        path: "list",
      },
      {
        name: "Archive",
        icon: "folder-minus",
        path: "archive",
      },
    ],
  },
  {
    name: "Pages",
    icon: "book-open",
    path: "pages",
    children: [
      {
        name: "List",
        icon: "clipboard-list",
        path: "list",
      },
      {
        name: "Archive",
        icon: "folder-minus",
        path: "archive",
      },
    ],
  },
  {
    name: "Meetings",
    icon: "calendar-alt",
    path: "meetings",
    children: [
      {
        name: "List",
        icon: "clipboard-list",
        path: "list",
      },
      {
        name: "Archive",
        icon: "folder-minus",
        path: "archive",
      },
    ],
  },
  {
    name: "Clusters",
    icon: "object-group",
    path: "clusters",
    children: [
      {
        name: "List",
        icon: "clipboard-list",
        path: "list",
      },
      {
        name: "Archive",
        icon: "folder-minus",
        path: "archive",
      },
    ],
  },
  {
    name: "Members",
    icon: "users",
    path: "members",
    children: [
      {
        name: "List",
        icon: "clipboard-list",
        path: "list",
      },
      {
        name: "Archive",
        icon: "folder-minus",
        path: "archive",
      },
    ],
  },
];

export default Sidebar;
