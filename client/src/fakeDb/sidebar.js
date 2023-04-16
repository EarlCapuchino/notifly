const Sidebar = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "dashboard",
  },
  {
    name: "Users",
    icon: "users",
    path: "users",
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
