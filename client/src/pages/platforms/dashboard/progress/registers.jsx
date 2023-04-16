import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBIcon,
  MDBRow,
} from "mdb-react-ui-kit";
import Chart from "react-apexcharts";

const DashboardRegisters = ({ theme }) => {
  const options = {
    chart: {
      id: "dashboard-sales",
    },
    xaxis: {
      categories: ["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"],
    },
  };

  const series = [
    {
      name: "Quantity",
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
    },
  ];
  return (
    <MDBCol md={4}>
      <MDBCard className="bg-transparent">
        <MDBCardHeader className={`${theme.bg} ${theme.text} border-0`}>
          <h5 className="font-weight-bold mb-0">Registers</h5>
          <small className="d-block text-muted">Recent Registrations</small>
        </MDBCardHeader>
        <MDBCardBody className={`${theme.bg} ${theme.text} pt-0`}>
          <Chart options={options} series={series} type="line" width="100%" />
          <MDBRow>
            <MDBCol md={12} className="d-flex justify-content-between my-2">
              <span>
                <MDBIcon icon="user-circle" />
                &nbsp;Merchants
              </span>
              <span>+25</span>
            </MDBCol>
            <MDBCol md={12} className="d-flex justify-content-between my-2">
              <span>
                <MDBIcon icon="industry" />
                &nbsp;Stores
              </span>
              <span>+53</span>
            </MDBCol>
            <MDBCol md={12} className="d-flex justify-content-between my-2">
              <span>
                <MDBIcon icon="users" />
                &nbsp;Total
              </span>
              <span>53</span>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default DashboardRegisters;
