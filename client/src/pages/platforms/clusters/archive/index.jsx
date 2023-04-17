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
} from "../../../../redux/slices/organizations/clusters";

const paths = [
  {
    name: "Archived Clusters",
  },
];
export default function ClustersArchive() {
  const { theme, maxPage, token } = useSelector(({ auth }) => auth),
    { catalogs, isLoading } = useSelector(({ clusters }) => clusters),
    [clusters, setClusters] = useState([]),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(ARCHIVE(token));
  }, [token]);

  useEffect(() => {
    if (clusters.length > 0) {
      let totalPages = Math.floor(clusters.length / maxPage);
      if (clusters.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);

      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [clusters, page, maxPage]);

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

  const handleRestore = data =>
    Swal.fire({
      icon: "question",
      title: "Are you sure?",
      html: `You are about to restore <b>${data.name}</b>.`,
      showCancelButton: true,
      confirmButtonText: "Proceed",
    }).then(result => {
      if (result.isConfirmed) {
        dispatch(RESTORE({ id: data._id, token }));
      }
    });

  return (
    <>
      <BreadCrumb title="Clusters Archive List" paths={paths} />

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
              name="Clusters"
              datas={clusters}
              titles={[
                "Name",
                {
                  _title: "Actions",
                  _styles: "text-center",
                },
              ]}
              contents={[
                {
                  _keys: "name",
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
                },
              ]}
              isLoading={isLoading}
              page={page}
              empty="Clusters are empty"
            />
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
}
