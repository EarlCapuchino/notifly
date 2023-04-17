import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBRow,
  MDBCol,
  MDBTypography,
  MDBListGroup,
  MDBListGroupItem,
  MDBIcon,
  MDBInput,
  MDBTooltip,
} from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE } from "../../../../redux/slices/persons/members";

export default function ViewClusters({
  visibility,
  setVisibility,
  member,
  clusters,
}) {
  const { theme, token } = useSelector(({ auth }) => auth),
    [selectedClusters, setSelectedClusters] = useState([]),
    [availableClusters, setAvailableClusters] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    if (member._id) {
      setSelectedClusters(member.clusters);
      if (member.clusters.length > 0) {
        var newArr = [];

        clusters.map(cluster => {
          const isSelected = member.clusters.find(e => e._id === cluster._id);

          if (!isSelected) {
            newArr.push(cluster);
          }
          return null;
        });

        setAvailableClusters(newArr);
      } else {
        setAvailableClusters(clusters);
      }
    }
  }, [member, clusters]);

  const handleAdd = index => {
    const newClusters = [...availableClusters],
      newSelectedClusters = [...selectedClusters];

    newSelectedClusters.push(newClusters[index]);
    newClusters.splice(index, 1);

    const newArr = newSelectedClusters.map(e => e._id);

    setAvailableClusters(newClusters);
    setSelectedClusters(newSelectedClusters);

    dispatch(
      UPDATE({
        data: {
          _id: member._id,
          clusters: newArr,
        },
        token,
      })
    );
  };

  const handleRemove = index => {
    const newClusters = [...availableClusters],
      newSelectedClusters = [...selectedClusters];

    newClusters.push(newSelectedClusters[index]);
    newSelectedClusters.splice(index, 1);

    const newArr = newSelectedClusters.map(e => e._id);

    setAvailableClusters(newClusters);
    setSelectedClusters(newSelectedClusters);

    dispatch(
      UPDATE({
        data: {
          _id: member._id,
          clusters: newArr,
        },
        token,
      })
    );
  };

  return (
    <MDBModal staticBackdrop show={visibility} tabIndex="-1">
      <MDBModalDialog centered size="lg">
        <MDBModalContent className={`${theme.bg} ${theme.text}`}>
          <MDBModalHeader>
            <MDBModalTitle>View Cluster</MDBModalTitle>
          </MDBModalHeader>
          <MDBModalBody>
            <MDBRow>
              <MDBCol md={6}>
                <MDBTypography>Selected Clusters</MDBTypography>
                <MDBListGroup>
                  {selectedClusters?.map((cluster, index) => (
                    <MDBListGroupItem
                      key={`selected-cluster-${index}`}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{cluster.name}</span>
                      <MDBTooltip
                        tag="span"
                        wrapperClass="d-inline-block"
                        title="Remove cluster"
                        placement="left"
                      >
                        <MDBBtn
                          size="sm"
                          floating
                          onClick={() => handleRemove(index)}
                        >
                          <MDBIcon icon="arrow-right" />
                        </MDBBtn>
                      </MDBTooltip>
                    </MDBListGroupItem>
                  ))}
                </MDBListGroup>
              </MDBCol>
              <MDBCol md={6}>
                <MDBTypography>Available Clusters</MDBTypography>
                <MDBListGroup>
                  {availableClusters?.map((cluster, index) => (
                    <MDBListGroupItem
                      key={`cluster-${index}`}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <MDBTooltip
                        tag="span"
                        wrapperClass="d-inline-block"
                        title="Select cluster"
                        placement="right"
                      >
                        <MDBBtn
                          size="sm"
                          floating
                          onClick={() => handleAdd(index)}
                        >
                          <MDBIcon icon="arrow-left" />
                        </MDBBtn>
                      </MDBTooltip>
                      <span>{cluster.name}</span>
                    </MDBListGroupItem>
                  ))}
                </MDBListGroup>
              </MDBCol>
            </MDBRow>
          </MDBModalBody>

          <MDBModalFooter>
            <MDBBtn
              type="button"
              color={theme.color}
              className="shadow-0"
              onClick={() => setVisibility(false)}
            >
              Close
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
