import React, { useState, useEffect } from "react";
import {
  MDBBadge,
  MDBCard,
  MDBCardBody,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";
import BreadCrumb from "../../../components/breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../../components/dataTable";
import Pager from "../../../components/pager";
import Search from "../../../components/search";
import { BROWSE } from "../../../redux/slices/organizations/clusters";
import { toast } from "react-toastify";

const paths = [
  {
    name: "Tag People",
  },
];

export default function TagPeople() {
  const { theme, maxPage, token, isAdmin } = useSelector(({ auth }) => auth),
    { catalogs, isLoading } = useSelector(({ clusters }) => clusters),
    [clusters, setClusters] = useState([]),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE(token));
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

  const handleClusterToggle = data => {
    const newArr = [...clusters];

    const index = newArr.findIndex(e => e._id === data._id);

    const newObj = { ...newArr[index] };

    newObj.isSelected = !data.isSelected;

    newArr[index] = newObj;

    setClusters(newArr);
  };

  const handleTagging = () => {
    const selected = clusters.filter(e => e.isSelected);

    if (selected.length > 0) {
      alert(selected.length);
    } else {
      toast.warn("Please select a cluster first");
    }
  };

  return (
    <>
      <BreadCrumb
        title="Tag People"
        button={isAdmin}
        paths={paths}
        tooltip="Tag selected clusters"
        handler={handleTagging}
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
              name="Clusters"
              datas={clusters}
              titles={[
                "Name",
                {
                  _title: "Members",
                  _styles: "text-center",
                },
                {
                  _title: "Actions",
                  _styles: "text-center",
                },
              ]}
              contents={[
                {
                  _keys: "name",
                },
                {
                  _keys: "members",
                  _styles: "text-center",
                  _format: data => <MDBBadge>{data.length}</MDBBadge>,
                },
              ]}
              handlers={[handleClusterToggle]}
              actions={[
                {
                  _title: "Select",
                  _icon: "check",
                  _color: "success",
                  _placement: "left",
                  _function: 0,
                  _condition: data => isAdmin && !data.isSelected,
                },
                {
                  _title: "Remove",
                  _icon: "times",
                  _color: "danger",
                  _placement: "left",
                  _function: 0,
                  _condition: data => isAdmin && data.isSelected,
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
