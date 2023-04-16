import React from "react";
import { MDBContainer, MDBRow } from "mdb-react-ui-kit";
import DashboardStatistics from "./statistics";
import DashboardSales from "./progress/sales";
import DashboardCompleted from "./progress/completed";
import DashboardRegisters from "./progress/registers";
import BreadCrumb from "../../../components/breadcrumb";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { theme } = useSelector(state => state.auth);

  return (
    <>
      <BreadCrumb title="System Statistics" />

      <MDBContainer fluid className="pt-5 mt-3">
        <MDBRow>
          <DashboardStatistics
            color="danger"
            icon="shopping-basket"
            title="Shopping Cart"
            texts={["Lands", "Houses", "Ranchos", "Farms"]}
          />
          <DashboardStatistics
            color="primary"
            icon="hotel"
            title="Appartments"
            texts={["Flats", "Shared Rooms", "Duplex"]}
          />
          <DashboardStatistics
            color="success"
            icon="chart-bar"
            title="Sales Stats"
            texts={["50% Increased for FY20"]}
          />
        </MDBRow>
        <MDBRow className="mt-1 mt-md-0">
          <DashboardSales theme={theme} />
          <DashboardCompleted theme={theme} />
          <DashboardRegisters theme={theme} />
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default Dashboard;
