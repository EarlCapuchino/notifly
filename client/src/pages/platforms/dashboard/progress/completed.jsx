import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBTypography,
} from "mdb-react-ui-kit";
import Chart from "react-apexcharts";

const DashboardCompleted = ({ theme }) => {
  const options = {
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: "70%",
          background: "#fff",
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: "front",
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: "#ECEFF1",
          strokeWidth: "25%",
          margin: 0, // margin is in pixels
        },
        dataLabels: {
          showOn: "always",
          name: {
            show: false,
          },
          value: {
            formatter: function (val) {
              return val;
            },
            color: "#111",
            fontSize: "30px",
            show: true,
          },
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
  };
  const series = [50.5];
  return (
    <MDBCol md={4}>
      <MDBCard className="bg-transparent">
        <MDBCardHeader className={`${theme.bg} ${theme.text} border-0`}>
          <h5 className="font-weight-bold mb-0">Verified Accounts</h5>
          <small className="d-block text-muted">Total verified accounts</small>
        </MDBCardHeader>
        <MDBCardBody className={`${theme.bg} ${theme.text} pt-0`}>
          <Chart
            options={options}
            series={series}
            type="radialBar"
            width="100%"
          />
          <MDBTypography note noteColor="primary" className="bg-transparent">
            <strong>Note primary:</strong> Lorem ipsum dolor sit amet,
            consectetur adipisicing elit
          </MDBTypography>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default DashboardCompleted;
