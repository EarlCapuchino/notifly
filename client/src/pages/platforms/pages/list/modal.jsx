import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBRow,
  MDBCol,
  MDBTypography,
  MDBListGroup,
  MDBListGroupItem,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { isValidURL } from "../../../../components/utilities";

export default function PageModal({
  modal,
  setVisibility,
  page,
  handleSubmit,
}) {
  const { theme } = useSelector(({ auth }) => auth),
    [form, setForm] = useState({
      name: "",
      urls: [""],
    });

  useEffect(() => {
    if (modal && !modal.create) {
      setForm(page);
    }
  }, [modal, page]);

  return (
    <MDBModal staticBackdrop show={modal.visibility} tabIndex="-1">
      <MDBModalDialog centered size="lg">
        <MDBModalContent className={`${theme.bg} ${theme.text}`}>
          <MDBModalHeader>
            <MDBModalTitle>
              {modal.create ? "Create a Page List" : `Update ${form.name}`}
            </MDBModalTitle>
          </MDBModalHeader>
          <MDBModalBody>
            <MDBInput
              label="Name"
              value={form.name}
              onChange={e =>
                setForm({ ...form, name: e.target.value.toUpperCase() })
              }
            />
            <MDBListGroup className="mt-2">
              <MDBListGroupItem className="d-flex align-items-center justify-content-between">
                <MDBTypography className="mb-0">Pages</MDBTypography>
                <MDBBtn
                  size="sm"
                  floating
                  onClick={() => {
                    const newArr = [...form.urls];
                    newArr.push("");
                    setForm({ ...form, urls: newArr });
                  }}
                >
                  <MDBIcon icon="plus" />
                </MDBBtn>
              </MDBListGroupItem>
              {form.urls?.map((url, index) => (
                <MDBListGroupItem key={`url-list-${index}`}>
                  <MDBRow>
                    <MDBCol size={11}>
                      <MDBInput
                        label={`Page name (darkestconfessionsPH)`}
                        value={url}
                        onChange={e => {
                          const newArr = [...form.urls];

                          newArr[index] = e.target.value;

                          setForm({ ...form, urls: newArr });
                        }}
                        className="w-75"
                      />
                    </MDBCol>
                    <MDBCol
                      size={1}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <MDBBtn
                        color="danger"
                        size="sm"
                        floating
                        onClick={() => {
                          const newArr = [...form.urls];
                          newArr.splice(index, 1);
                          setForm({ ...form, urls: newArr });
                        }}
                      >
                        <MDBIcon icon="minus" />
                      </MDBBtn>
                    </MDBCol>
                  </MDBRow>
                </MDBListGroupItem>
              ))}
            </MDBListGroup>
          </MDBModalBody>

          <MDBModalFooter>
            <MDBBtn
              type="button"
              color={theme.color}
              className="shadow-0"
              onClick={() => {
                setForm({
                  name: "",
                  urls: [""],
                });
                setVisibility({ visibility: false, create: true });
              }}
            >
              Close
            </MDBBtn>
            <MDBBtn
              onClick={() => {
                const newObj = { ...form };

                if (newObj.urls.length > 0) {
                  var invalids = [];

                  newObj.urls.map((url, index) => {
                    if (!url) {
                      invalids.push(`#${index + 1}`);
                    }

                    return null;
                  });

                  if (invalids.length > 0) {
                    toast.warn(`Invalid URL(s): ${invalids.join(", ")}`);
                  } else {
                    if (newObj.name) {
                      setForm({
                        name: "",
                        urls: [""],
                      });
                      handleSubmit(form);
                    } else {
                      toast.warn("Please specify a name");
                    }
                  }
                } else {
                  toast.warn("Please specify at least one(1) valid URL");
                }
              }}
              color="warning"
            >
              submit
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
