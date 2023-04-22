import React, { useState, useEffect } from "react";
import {
  MDBBadge,
  MDBCard,
  MDBCardBody,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";
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
} from "../../../../redux/slices/organizations/fbgroups";
import FBGroupModal from "./modal";
import ViewModal from "./view";

const paths = [
  {
    name: "Registered Facebook Groups",
  },
];

export default function FBGroupsList() {
  const { theme, maxPage, token, isAdmin } = useSelector(({ auth }) => auth),
    { catalogs, isLoading } = useSelector(({ fbgroups }) => fbgroups),
    [fbgroups, setFBGroups] = useState([]),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    [record, setRecord] = useState({}),
    [viewURLs, setViewURLs] = useState(false),
    [modal, setModal] = useState({
      visibility: false,
      create: true,
    }),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE(token));
  }, [token]);

  useEffect(() => {
    if (fbgroups.length > 0) {
      let totalPages = Math.floor(fbgroups.length / maxPage);
      if (fbgroups.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);

      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [fbgroups, page, maxPage]);

  useEffect(() => {
    setFBGroups(catalogs);
  }, [catalogs]);

  const handleSearch = e => {
    const key = e.target.value;

    if (key) {
      setFBGroups(
        catalogs.filter(catalog => catalog.name.includes(key.toUpperCase()))
      );
    } else {
      setFBGroups(catalogs);
    }
  };

  const handleArchive = data =>
    Swal.fire({
      icon: "question",
      title: "Are you sure?",
      html: `You are about to archive <b>${data.name}</b>.`,
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

  const handleURLs = data => {
    setRecord(data);
    setViewURLs(true);
  };

  return (
    <>
      <BreadCrumb
        title="Facebook Groups List"
        button={isAdmin}
        paths={paths}
        tooltip="Create new Facebook Group"
        handler={() => setModal({ visibility: true, create: true })}
      />

      <FBGroupModal
        modal={modal}
        setVisibility={setModal}
        fbgroup={record}
        handleSubmit={handleModalSubmit}
      />

      <ViewModal
        visibility={viewURLs}
        setVisibility={setViewURLs}
        fbgroup={record}
      />

      <MDBContainer fluid className="pt-5 mt-5">
        <MDBCard background={theme.color} className={`${theme.text} mb-2`}>
          <MDBCardBody>
            <MDBRow>
              <Search label="Search by Name" handler={handleSearch} />
              <Pager total={totalPages} page={page} setPage={setPage} />
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
        <MDBCard background={theme.color} className={`${theme.text}`}>
          <MDBCardBody>
            <DataTable
              name="Facebook Groups"
              datas={fbgroups}
              titles={[
                "Name",
                {
                  _title: "URL Count",
                  _styles: "text-center",
                },
                {
                  _title: "Action",
                  _styles: "text-center",
                },
              ]}
              contents={[
                {
                  _keys: "name",
                },
                {
                  _keys: "urls",
                  _styles: "text-center",
                  _format: data => <MDBBadge>{data.length}</MDBBadge>,
                },
              ]}
              handlers={[handleURLs, handleUpdate, handleArchive]}
              actions={[
                {
                  _title: "Post in Groups",
                  _icon: "comment",
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
              empty="Facebook Groups are empty"
            />
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
}
