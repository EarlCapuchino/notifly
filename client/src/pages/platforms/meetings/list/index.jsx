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
} from "../../../../redux/slices/organizations/meetings";
import { BROWSE as CLUSTER } from "../../../../redux/slices/organizations/clusters";
import PostModal from "./modal";
import ViewModal from "./view";

const paths = [
  {
    name: "Registered Meetings",
  },
];

export default function MeetingsList() {
  const { theme, maxPage, token, isAdmin } = useSelector(({ auth }) => auth),
    { catalogs, isLoading } = useSelector(({ meetings }) => meetings),
    [meetings, setMeetings] = useState([]),
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
    dispatch(CLUSTER(token));
  }, [token]);

  useEffect(() => {
    if (meetings.length > 0) {
      let totalPages = Math.floor(meetings.length / maxPage);
      if (meetings.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);

      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [meetings, page, maxPage]);

  useEffect(() => {
    setMeetings(catalogs);
  }, [catalogs]);

  const handleSearch = e => {
    const key = e.target.value;

    if (key) {
      setMeetings(
        catalogs.filter(catalog => catalog.title.includes(key.toUpperCase()))
      );
    } else {
      setMeetings(catalogs);
    }
  };

  const handleArchive = data =>
    Swal.fire({
      icon: "question",
      title: "Are you sure?",
      html: `You are about to archive <b>${data.title}</b>.`,
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
        title="Meetings List"
        button={isAdmin}
        paths={paths}
        tooltip="Create new Post"
        handler={() => setModal({ visibility: true, create: true })}
      />

      <PostModal
        modal={modal}
        setVisibility={setModal}
        post={record}
        handleSubmit={handleModalSubmit}
      />

      <ViewModal
        visibility={viewURLs}
        setVisibility={setViewURLs}
        post={record}
      />

      <MDBContainer fluid className="pt-5 mt-5">
        <MDBCard background={theme.color} className={`${theme.text} mb-2`}>
          <MDBCardBody>
            <MDBRow>
              <Search label="Search by Title" handler={handleSearch} />
              <Pager total={totalPages} page={page} setPage={setPage} />
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
        <MDBCard background={theme.color} className={`${theme.text}`}>
          <MDBCardBody>
            <DataTable
              name="Meetings"
              datas={meetings}
              titles={[
                "Title",
                {
                  _title: "Date",
                  _styles: "text-center",
                },
                {
                  _title: "Action",
                  _styles: "text-center",
                },
              ]}
              contents={[
                {
                  _keys: "title",
                },
                {
                  _keys: "date",
                  _styles: "text-center",
                },
              ]}
              handlers={[handleURLs, handleUpdate, handleArchive]}
              actions={[
                {
                  _title: "Announce Meeting",
                  _icon: "bullhorn",
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
                  _color: "warning",
                  _placement: "right",
                  _function: 2,
                  _condition: () => isAdmin,
                },
              ]}
              isLoading={isLoading}
              page={page}
              empty="Meetings are empty"
            />
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
}
