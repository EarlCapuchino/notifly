import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBCol,
  MDBRow,
  MDBInput,
  MDBListGroup,
  MDBListGroupItem,
  MDBTabs,
  MDBTabsContent,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsPane,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";

const tabs = ["Email", "Messenger", "Group Chat"];

const Emails = ({ loading, recipients, setRecipients }) => {
  const { catalogs } = useSelector(({ clusters }) => clusters),
    [selectAll, setSelectAll] = useState(false),
    [clusters, setClusters] = useState([]);

  useEffect(() => {
    setClusters(catalogs);
  }, [catalogs]);

  const handleSearch = e => {
    const key = e.target.value;

    if (key) {
      setClusters(
        catalogs.filter(catalog => catalog.name.includes(key.toUpperCase()))
      );
    } else {
      setClusters(catalogs);
    }
  };

  const handleSelect = () => {
    if (selectAll) {
      setRecipients([]);
      setSelectAll(false);
    } else {
      setRecipients(catalogs);
      setSelectAll(true);
    }
  };

  return (
    <MDBListGroup>
      <MDBListGroupItem className="d-flex align-items-center justify-content-between">
        <MDBInput
          onChange={handleSearch}
          type="search"
          label="Search by Name"
        />
        <MDBBtn
          onClick={handleSelect}
          color={selectAll ? "danger" : "success"}
          size="sm"
        >
          {selectAll ? "deselect all" : "select all"}
        </MDBBtn>
      </MDBListGroupItem>
      {clusters?.map(catalog => {
        const duplicate = recipients.find(e => e._id === catalog._id),
          dupIndex = recipients.findIndex(e => e._id === catalog._id);

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
                {catalog.name}
              </MDBCol>
              <MDBCol size={1} className="text-center">
                <MDBBtn
                  disabled={loading}
                  onClick={() => {
                    const newArr = [...recipients];
                    if (duplicate) {
                      newArr.splice(dupIndex, 1);
                      if (selectAll) {
                        setSelectAll(false);
                      }
                    } else {
                      newArr.push(catalog);
                      if (newArr.length === clusters.length) {
                        setSelectAll(true);
                      }
                    }
                    setRecipients(newArr);
                  }}
                  size="sm"
                  floating
                  outline
                  color="transparent"
                  className="shadow-0 border-0"
                >
                  <MDBIcon
                    size="lg"
                    far
                    icon={duplicate ? "check-square" : "square"}
                  />
                </MDBBtn>
              </MDBCol>
            </MDBRow>
          </MDBListGroupItem>
        );
      })}
    </MDBListGroup>
  );
};

const Messengers = ({ loading, recipients, setRecipients }) => {
  const { catalogs } = useSelector(({ clusters }) => clusters),
    [selectAll, setSelectAll] = useState(false),
    [clusters, setClusters] = useState([]);

  useEffect(() => {
    setClusters(catalogs);
  }, [catalogs]);

  const handleSearch = e => {
    const key = e.target.value;

    if (key) {
      setClusters(
        catalogs.filter(catalog => catalog.name.includes(key.toUpperCase()))
      );
    } else {
      setClusters(catalogs);
    }
  };

  const handleSelect = () => {
    if (selectAll) {
      setRecipients([]);
      setSelectAll(false);
    } else {
      setRecipients(catalogs);
      setSelectAll(true);
    }
  };

  return (
    <MDBListGroup>
      <MDBListGroupItem className="d-flex align-items-center justify-content-between">
        <MDBInput
          onChange={handleSearch}
          type="search"
          label="Search by Name"
        />
        <MDBBtn
          onClick={handleSelect}
          color={selectAll ? "danger" : "success"}
          size="sm"
        >
          {selectAll ? "deselect all" : "select all"}
        </MDBBtn>
      </MDBListGroupItem>
      {clusters?.map(catalog => {
        const duplicate = recipients.find(e => e._id === catalog._id),
          dupIndex = recipients.findIndex(e => e._id === catalog._id);

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
                {catalog.name}
              </MDBCol>
              <MDBCol size={1} className="text-center">
                <MDBBtn
                  disabled={loading}
                  onClick={() => {
                    const newArr = [...recipients];
                    if (duplicate) {
                      newArr.splice(dupIndex, 1);
                      if (selectAll) {
                        setSelectAll(false);
                      }
                    } else {
                      newArr.push(catalog);
                      if (newArr.length === clusters.length) {
                        setSelectAll(true);
                      }
                    }
                    setRecipients(newArr);
                  }}
                  size="sm"
                  floating
                  outline
                  color="transparent"
                  className="shadow-0 border-0"
                >
                  <MDBIcon
                    size="lg"
                    far
                    icon={duplicate ? "check-square" : "square"}
                  />
                </MDBBtn>
              </MDBCol>
            </MDBRow>
          </MDBListGroupItem>
        );
      })}
    </MDBListGroup>
  );
};

const GroupChats = ({ loading, recipients, setRecipients }) => {
  const { catalogs } = useSelector(({ groupchats }) => groupchats),
    [selectAll, setSelectAll] = useState(false),
    [clusters, setClusters] = useState([]);

  useEffect(() => {
    setClusters(catalogs);
  }, [catalogs]);

  const handleSearch = e => {
    const key = e.target.value;

    if (key) {
      setClusters(
        catalogs.filter(catalog => catalog.name.includes(key.toUpperCase()))
      );
    } else {
      setClusters(catalogs);
    }
  };

  const handleSelect = () => {
    if (selectAll) {
      setRecipients([]);
      setSelectAll(false);
    } else {
      setRecipients(catalogs);
      setSelectAll(true);
    }
  };

  return (
    <MDBListGroup>
      <MDBListGroupItem className="d-flex align-items-center justify-content-between">
        <MDBInput
          onChange={handleSearch}
          type="search"
          label="Search by Name"
        />
        <MDBBtn
          onClick={handleSelect}
          color={selectAll ? "danger" : "success"}
          size="sm"
        >
          {selectAll ? "deselect all" : "select all"}
        </MDBBtn>
      </MDBListGroupItem>
      {clusters?.map(catalog => {
        const duplicate = recipients.find(e => e._id === catalog._id),
          dupIndex = recipients.findIndex(e => e._id === catalog._id);

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
                {catalog.name}
              </MDBCol>
              <MDBCol size={1} className="text-center">
                <MDBBtn
                  disabled={loading}
                  onClick={() => {
                    const newArr = [...recipients];
                    if (duplicate) {
                      newArr.splice(dupIndex, 1);
                      if (selectAll) {
                        setSelectAll(false);
                      }
                    } else {
                      newArr.push(catalog);
                      if (newArr.length === clusters.length) {
                        setSelectAll(true);
                      }
                    }
                    setRecipients(newArr);
                  }}
                  size="sm"
                  floating
                  outline
                  color="transparent"
                  className="shadow-0 border-0"
                >
                  <MDBIcon
                    size="lg"
                    far
                    icon={duplicate ? "check-square" : "square"}
                  />
                </MDBBtn>
              </MDBCol>
            </MDBRow>
          </MDBListGroupItem>
        );
      })}
    </MDBListGroup>
  );
};

export default function MeetingTabs({
  loading,
  recipients,
  setRecipients,
  activeTab,
  setActiveTab,
}) {
  return (
    <MDBCol md={5} className="mt-2 mt-md-0">
      <MDBTabs fill className="mb-3">
        {tabs.map((tab, index) => (
          <MDBTabsItem key={`meeting-tab-${index}`}>
            <MDBTabsLink
              onClick={() => {
                setActiveTab(tab);
                setRecipients([]);
              }}
              active={activeTab === tab}
            >
              {tab}
            </MDBTabsLink>
          </MDBTabsItem>
        ))}
      </MDBTabs>
      <MDBTabsContent>
        <MDBTabsPane show={activeTab === "Email"}>
          <Emails
            loading={loading}
            recipients={recipients}
            setRecipients={setRecipients}
          />
        </MDBTabsPane>
        <MDBTabsPane show={activeTab === "Messenger"}>
          <Messengers
            loading={loading}
            recipients={recipients}
            setRecipients={setRecipients}
          />
        </MDBTabsPane>
        <MDBTabsPane show={activeTab === "Group Chat"}>
          <GroupChats
            loading={loading}
            recipients={recipients}
            setRecipients={setRecipients}
          />
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBCol>
  );
}
