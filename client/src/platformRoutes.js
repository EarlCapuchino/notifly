import Dashboard from "./pages/platforms/dashboard";
// import UsersList from "./users/list";
// import UsersArchive from "./users/archive";
// import CompaniesList from "./companies/list";
// import CompaniesArchive from "./companies/archive";
// import Logs from "./logs";

const routes = [
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  //   {
  //     path: "users",
  //     children: [
  //       {
  //         path: "list",
  //         element: <UsersList />,
  //       },
  //       {
  //         path: "archive",
  //         element: <UsersArchive />,
  //       },
  //     ],
  //   },
  //   {
  //     path: "companies",
  //     children: [
  //       {
  //         path: "list",
  //         element: <CompaniesList />,
  //       },
  //       {
  //         path: "archive",
  //         element: <CompaniesArchive />,
  //       },
  //     ],
  //   },
  //   {
  //     path: "logs",
  //     element: <Logs />,
  //   },
];

export default routes;
