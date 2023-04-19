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
} from "../../../../redux/slices/organizations/posts";
import { BROWSE as CLUSTER } from "../../../../redux/slices/organizations/clusters";
import PostModal from "./modal";

const paths = [
  {
    name: "Registered Posts",
  },
];

export default function PostsList() {
  const { theme, maxPage, token, isAdmin } = useSelector(({ auth }) => auth),
    { catalogs, isLoading } = useSelector(({ posts }) => posts),
    clusters = useSelector(({ clusters }) => clusters),
    [posts, setPosts] = useState([]),
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
    dispatch(CLUSTER(token));
  }, [token]);

  useEffect(() => {
    if (posts.length > 0) {
      let totalPages = Math.floor(posts.length / maxPage);
      if (posts.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);

      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [posts, page, maxPage]);

  useEffect(() => {
    setPosts(catalogs);
  }, [catalogs]);

  const handleSearch = e => {
    const key = e.target.value;

    if (key) {
      setPosts(
        catalogs.filter(catalog => catalog.name.includes(key.toUpperCase()))
      );
    } else {
      setPosts(catalogs);
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
    // set(data);
    // setViewCluster(true);
  };

  return (
    <>
      <BreadCrumb
        title="Posts List"
        button={isAdmin}
        paths={paths}
        tooltip="Create new Post"
        handler={() => setModal({ visibility: true, create: true })}
      />

      <PostModal visibility={modal.visibility} setVisibility={setModal} />

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
              name="Posts"
              datas={posts}
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
                  _title: "View URLs",
                  _icon: "link",
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
              empty="Posts are empty"
            />
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
}
