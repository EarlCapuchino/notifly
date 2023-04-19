import React, { useState, useEffect } from "react";
import { MDBCard, MDBCardBody, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import BreadCrumb from "../../../../components/breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../../../components/dataTable";
import Pager from "../../../../components/pager";
import Search from "../../../../components/search";
import Swal from "sweetalert2";
import {
  ARCHIVE,
  RESTORE,
} from "../../../../redux/slices/organizations/meetings";

const paths = [
  {
    name: "Archived Meetings",
  },
];
export default function MeetingsArchive() {
  const { theme, maxPage, token, isAdmin } = useSelector(({ auth }) => auth),
    { catalogs, isLoading } = useSelector(({ meetings }) => meetings),
    [meetings, setMeetings] = useState([]),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(ARCHIVE(token));
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

  const handleRestore = data =>
    Swal.fire({
      icon: "question",
      title: "Are you sure?",
      html: `You are about to restore <b>${data.title}</b>.`,
      showCancelButton: true,
      confirmButtonText: "Proceed",
    }).then(result => {
      if (result.isConfirmed) {
        dispatch(RESTORE({ id: data._id, token }));
      }
    });

  return (
    <>
      <BreadCrumb title="Meetings Archive List" paths={paths} />

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
              handlers={[handleRestore]}
              actions={[
                {
                  _title: "Restore",
                  _icon: "folder-open",
                  _color: "success",
                  _placement: "right",
                  _function: 0,
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
