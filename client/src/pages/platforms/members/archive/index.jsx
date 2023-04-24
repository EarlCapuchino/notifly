import React, { useState, useEffect } from "react";
import { MDBCard, MDBCardBody, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import BreadCrumb from "../../../../components/breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../../../components/dataTable";
import Pager from "../../../../components/pager";
import Search from "../../../../components/search";
import Swal from "sweetalert2";
import { ARCHIVE, RESTORE } from "../../../../redux/slices/persons/members";

const paths = [
  {
    name: "Archived Members",
  },
];
export default function MembersArchive() {
  const { theme, maxPage, token, isAdmin } = useSelector(({ auth }) => auth),
    { catalogs, isLoading } = useSelector(({ members }) => members),
    [members, setMembers] = useState([]),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(ARCHIVE(token));
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
          catalog.facebook.toLowerCase().includes(key.toLowerCase())
        )
      );
    } else {
      setMembers(catalogs);
    }
  };

  const handleRestore = data =>
    Swal.fire({
      icon: "question",
      title: "Are you sure?",
      html: `You are about to restore <b>${data.email}</b>.`,
      showCancelButton: true,
      confirmButtonText: "Proceed",
    }).then(result => {
      if (result.isConfirmed) {
        dispatch(RESTORE({ id: data._id, token }));
      }
    });

  return (
    <>
      <BreadCrumb title="Members Archive List" paths={paths} />

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
              name="Members"
              datas={members}
              titles={[
                "E-mail & Messenger ID",
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
                  _keys: ["username", "nickname"],
                  _styles: "text-center",
                  _format: [data => data || "-", data => data || "-"],
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
              empty="Members are empty"
            />
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
}
