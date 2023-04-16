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

const DashboardSales = ({ theme }) => {
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
          <h5 className="font-weight-bold mb-0">Sales Overview</h5>
          <small className="d-block text-muted">Recent sales statistics</small>
        </MDBCardHeader>
        <MDBCardBody className={`${theme.bg} ${theme.text} pt-0`}>
          <MDBRow>
            <MDBCol md={6} className="my-3">
              <small className="d-block text-muted">Average Sale</small>
              <span className="font-weight-bold">
                $650 <MDBIcon fas icon="caret-up" color="success" />
              </span>
            </MDBCol>
            <MDBCol md={6} className="my-3">
              <small className="d-block text-muted">Commission</small>
              <span className="font-weight-bold">
                $233,600 <MDBIcon fas icon="caret-down" color="danger" />
              </span>
            </MDBCol>
            <MDBCol md={6} className="my-3">
              <small className="d-block text-muted">Annual Taxes 2022</small>
              <span className="font-weight-bold">
                $650 <MDBIcon fas icon="caret-up" color="success" />
              </span>
            </MDBCol>
            <MDBCol md={6} className="my-3">
              <small className="d-block text-muted">Annual Income</small>
              <span className="font-weight-bold">
                $233,600 <MDBIcon fas icon="caret-down" color="danger" />
              </span>
            </MDBCol>
          </MDBRow>
          <Chart options={options} series={series} type="line" width="100%" />
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default DashboardSales;
