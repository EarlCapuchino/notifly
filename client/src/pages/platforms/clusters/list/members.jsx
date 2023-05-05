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
  MDBListGroup,
  MDBListGroupItem,
  MDBBadge,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE, UPDATE } from "../../../../redux/slices/persons/members";

const Members = ({ cluster, setCluster }) => {
  const { catalogs } = useSelector(({ members }) => members),
    { token } = useSelector(({ auth }) => auth),
    [members, setMembers] = useState([]),
    [membersCleaned, setMembersCleaned] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    if (cluster) {
      const _cluster = cluster.members;

      if (_cluster) {
        const _cluster = cluster.members;
        var cleaned = [];

        catalogs.filter(e => {
          const dups = _cluster.find(clstr => clstr.email === e.email);

          if (!dups) {
            cleaned.push(e);
          }

          return null;
        });

        setMembersCleaned(cleaned);
      }
    }
  }, [catalogs, cluster]);

  useEffect(() => {
    setMembers(membersCleaned);
  }, [membersCleaned]);

  const handleSearch = e => {
    const key = e.target.value;

    if (key) {
      setMembers(
        membersCleaned.filter(catalog =>
          catalog.facebook.toLowerCase().includes(key.toLowerCase())
        )
      );
    } else {
      setMembers(membersCleaned);
    }
  };

  return (
    <MDBListGroup>
      <MDBListGroupItem>
        <MDBInput
          onChange={handleSearch}
          type="search"
          label="Search by Name"
          id="searchbar"
        />
      </MDBListGroupItem>
      {members?.map(catalog => {
        return (
          <MDBListGroupItem key={`by-email-${catalog._id}`}>
            <MDBRow>
              <MDBCol
                size={10}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {catalog.facebook}
              </MDBCol>
              <MDBCol size={1} className="text-center">
                <MDBBtn
                  onClick={() => {
                    const newArr = [...cluster.members];
                    newArr.push(catalog);
                    setCluster({ ...cluster, members: newArr });

                    var newClusters = [`${cluster._id}`];

                    catalog.clusters.map(item => {
                      newClusters.push(`${item._id}`);
                    });

                    dispatch(
                      UPDATE({
                        token,
                        data: {
                          _id: catalog._id,
                          clusters: newClusters,
                        },
                      })
                    );
                    document.getElementById("searchbar").value = "";
                  }}
                  size="sm"
                  floating
                  outline
                  color="transparent"
                  className="shadow-0 border-0"
                >
                  <MDBIcon size="lg" icon="user-check" />
                </MDBBtn>
              </MDBCol>
            </MDBRow>
          </MDBListGroupItem>
        );
      })}
    </MDBListGroup>
  );
};

export default function ViewMembers({
  visibility,
  setVisibility,
  cluster,
  setCluster,
}) {
  const { theme, token } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE(token));
  }, [token]);

  return (
    <MDBModal staticBackdrop show={visibility} tabIndex="-1">
      <MDBModalDialog centered size="xl">
        <MDBModalContent className={`${theme.bg} ${theme.text}`}>
          <MDBModalHeader>
            <MDBModalTitle>View Joined Members</MDBModalTitle>
          </MDBModalHeader>
          <MDBModalBody>
            <MDBRow>
              <MDBCol md={6}>
                <MDBListGroup>
                  {cluster?.members?.map((member, index) => (
                    <MDBListGroupItem
                      key={`view-member-${index}`}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div className="d-flex align-items-center">
                        <div>
                          <p className="fw-bold mb-1">{member.email}</p>
                          <p className="text-muted mb-0">
                            {member.messengerId}
                          </p>
                        </div>
                      </div>
                      <MDBBadge pill>{member.facebook}</MDBBadge>
                    </MDBListGroupItem>
                  ))}
                </MDBListGroup>
              </MDBCol>
              <MDBCol md={6}>
                <Members cluster={cluster} setCluster={setCluster} />
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
