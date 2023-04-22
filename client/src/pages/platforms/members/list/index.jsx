import React, { useState, useEffect } from "react";
import { MDBCard, MDBCardBody, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import BreadCrumb from "../../../../components/breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../../../components/dataTable";
import Pager from "../../../../components/pager";
import Search from "../../../../components/search";
import Swal from "sweetalert2";
import {
  BROWSE,
  SAVE,
  DESTROY,
  UPDATE,
} from "../../../../redux/slices/persons/members";
import { BROWSE as CLUSTER } from "../../../../redux/slices/organizations/clusters";
import Modal from "../../../../components/modal";
import ViewClusters from "./clusters";

const paths = [
    {
      name: "Registered Members",
    },
  ],
  preset = {
    facebook: "",
    messengerId: "",
    email: "",
    username: "",
    nickname: "",
  };

export default function MembersList() {
  const { theme, maxPage, token, isAdmin } = useSelector(({ auth }) => auth),
    { catalogs, isLoading } = useSelector(({ members }) => members),
    clusters = useSelector(({ clusters }) => clusters),
    [members, setMembers] = useState([]),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    [record, setRecord] = useState({}),
    [modal, setModal] = useState({
      visibility: false,
      create: true,
    }),
    [member, setMember] = useState({}),
    [viewCluster, setViewCluster] = useState(false),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE(token));
    dispatch(CLUSTER(token));
  }, [token]);

  useEffect(() => {
    if (members.length > 0) {
      let totalPages = Math.floor(members.length / maxPage);
      if (members.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);

      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [members, page, maxPage]);

  useEffect(() => {
    setMembers(catalogs);
  }, [catalogs]);

  const handleSearch = e => {
    const key = e.target.value;

    if (key) {
      setMembers(
        catalogs.filter(catalog =>
          catalog.email.toLowerCase().includes(key.toLowerCase())
        )
      );
    } else {
      setMembers(catalogs);
    }
  };

  const handleArchive = data =>
    Swal.fire({
      icon: "question",
      title: "Are you sure?",
      html: `You are about to archive <b>${data.email}</b>.`,
      showCancelButton: true,
      confirmButtonText: "Proceed",
    }).then(result => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ id: data._id, token }));
      }
    });

  const handleUpdate = data => {
    setRecord(data);
    setModal({ visibility: true, create: false });
  };

  const handleModalSubmit = data => {
    if (modal.create) {
      dispatch(SAVE({ data, token }));
    } else {
      dispatch(UPDATE({ data, token }));
    }
    setModal({ visibility: false, create: true });
  };

  const handleClusters = data => {
    setMember(data);
    setViewCluster(true);
  };

  return (
    <>
      <BreadCrumb
        title="Members List"
        button={isAdmin}
        paths={paths}
        tooltip="Create new Member"
        handler={() => setModal({ visibility: true, create: true })}
      />

      <Modal
        title={modal.create ? "Create a member" : `Update ${record.name}`}
        submitColor={modal.create ? "success" : "info"}
        submitText={modal.create ? "Submit" : "update"}
        submitHandler={handleModalSubmit}
        visibility={modal.visibility}
        form={[
          {
            _name: "messengerId",
            _label: "Messenger ID",
            _required: true,
            _message: "Messenger ID is required.",
            _md: 6,
          },
          {
            _name: "email",
            _label: "E-mail Address",
            _required: true,
            _message: "E-mail Address is required.",
            _type: "email",
            _md: 6,
          },
          {
            _name: "facebook",
            _label: "Facebook",
            _required: true,
            _style: "mt-3",
            _md: 4,
          },
          {
            _name: "username",
            _label: "Username",
            _required: true,
            _style: "mt-3",
            _md: 4,
          },
          {
            _name: "nickname",
            _label: "Nickname",
            _style: "mt-3",
            _md: 4,
          },
        ]}
        data={modal.create ? preset : record}
        size="lg"
        setVisibility={() => setModal({ visibility: false, create: true })}
      />

      <ViewClusters
        visibility={viewCluster}
        setVisibility={setViewCluster}
        member={member}
        clusters={clusters.catalogs}
      />

      <MDBContainer fluid className="pt-5 mt-5">
        <MDBCard background={theme.color} className={`${theme.text} mb-2`}>
          <MDBCardBody>
            <MDBRow>
              <Search label="Search by E-mail Address" handler={handleSearch} />
              <Pager total={totalPages} page={page} setPage={setPage} />
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
        <MDBCard background={theme.color} className={`${theme.text}`}>
          <MDBCardBody>
            <DataTable
              name="Members"
              datas={members}
              titles={[
                "E-mail & Messenger ID",
                {
                  _title: "Facebook",
                  _styles: "text-center",
                },
                {
                  _title: "Username & Nickname",
                  _styles: "text-center",
                },

                {
                  _title: "Action",
                  _styles: "text-center",
                },
              ]}
              contents={[
                {
                  _keys: ["email", "messengerId"],
                  _format: [],
                },
                {
                  _keys: "facebook",
                  _styles: "text-center",
                  _format: data => data || "-",
                },
                {
                  _keys: ["username", "nickname"],
                  _styles: "text-center",
                  _format: [data => data || "-", data => data || "-"],
                },
              ]}
              handlers={[handleClusters, handleUpdate, handleArchive]}
              actions={[
                {
                  _title: "View Clusters",
                  _icon: "object-group",
                  _color: "info",
                  _placement: "left",
                  _function: 0,
                  _condition: () => isAdmin,
                },
                {
                  _title: "Update",
                  _icon: "pen",
                  _color: "primary",
                  _placement: "top",
                  _function: 1,
                  _condition: () => isAdmin,
                },
                {
                  _title: "Archive",
                  _icon: "folder-minus",
                  _color: "danger",
                  _placement: "right",
                  _function: 2,
                  _condition: () => isAdmin,
                },
              ]}
              isLoading={isLoading}
              page={page}
              empty="Members are empty"
            />
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
}
