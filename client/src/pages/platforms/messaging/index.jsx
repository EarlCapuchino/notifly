import React, { useState, useEffect } from "react";
import { MDBCard, MDBCardBody, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import BreadCrumb from "../../../components/breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../../components/dataTable";
import Pager from "../../../components/pager";
import Search from "../../../components/search";
import Swal from "sweetalert2";
import {
  BROWSE,
  SAVE,
  DESTROY,
  UPDATE,
} from "../../../redux/slices/organizations/clusters";
import Modal from "../../../components/modal";

const paths = [
    {
      name: "Registered Clusters",
    },
  ],
  preset = {
    name: "",
  };

export default function BulkMessaging() {
  const { theme, maxPage, token, isAdmin } = useSelector(({ auth }) => auth),
    { catalogs, isLoading } = useSelector(({ clusters }) => clusters),
    [clusters, setClusters] = useState([]),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    [record, setRecord] = useState({}),
    [modal, setModal] = useState({
      visibility: false,
      create: true,
    }),
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

  return (
    <>
      <BreadCrumb
        title="Clusters List"
        button={isAdmin}
        paths={paths}
        tooltip="Create new Cluster"
        handler={() => setModal({ visibility: true, create: true })}
      />

      <Modal
        title={modal.create ? "Create a cluster" : `Update ${record.name}`}
        submitColor={modal.create ? "success" : "info"}
        submitText={modal.create ? "Submit" : "update"}
        submitHandler={handleModalSubmit}
        visibility={modal.visibility}
        form={[
          {
            _name: "name",
            _label: "Name",
            _format: val => val.toUpperCase(),
            _required: true,
            _message: "We need a name for this.",
            // _type: "text",
            // _size: 6,
            // _md: 6,
          },
        ]}
        data={modal.create ? preset : record}
        size="md"
        setVisibility={() => setModal({ visibility: false, create: true })}
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
                  _title: "Actions",
                  _styles: "text-center",
                },
              ]}
              contents={[
                {
                  _keys: "name",
                },
              ]}
              handlers={[handleUpdate, handleArchive]}
              actions={[
                {
                  _title: "Update",
                  _icon: "pen",
                  _color: "primary",
                  _placement: "left",
                  _function: 0,
                  _condition: () => isAdmin,
                },
                {
                  _title: "Archive",
                  _icon: "folder-minus",
                  _color: "warning",
                  _placement: "right",
                  _function: 1,
                  _condition: () => isAdmin,
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
