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
  MDBContainer,
  MDBBadge,
  MDBRow,
  MDBCol,
  MDBTextArea,
  MDBIcon,
  MDBInput,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selenium } from "../../../redux/APIServices";
import { isValidURL, removeEmoji } from "../../../components/utilities";

export default function GenerateTags({
  visibility,
  setVisibility,
  clusters = [],
}) {
  const { theme, token } = useSelector(({ auth }) => auth),
    { catalogs } = useSelector(({ posts }) => posts),
    [message, setMessage] = useState(""),
    [selectedPost, setSelectedPost] = useState({}),
    [url, setUrl] = useState(""),
    [loading, setLoading] = useState(false),
    [recipients, setRecipients] = useState([]);

  useEffect(() => {
    if (clusters.length > 0) {
      var members = [];

      clusters.map(cluster =>
        cluster.members?.map(member => member.facebook && members.push(member))
      );

      const newMembers = [];

      Array.from(new Set(members.map(member => member._id))).map(mmbr =>
        newMembers.push(members.find(e => e._id === mmbr))
      );

      setRecipients(newMembers);
    }
  }, [clusters]);

  const handleSend = async () => {
    if (message) {
      var response = null;
      if (selectedPost._id) {
        setLoading(true);

        response = await selenium(
          "tagging/multiple",
          { message, members: recipients, posts: selectedPost.urls },
          token
        );
      } else {
        if (isValidURL(url)) {
          setLoading(true);

          response = await selenium(
            "tagging",
            { message, recipients, url },
            token
          );
        } else {
          toast.warn("Please specify a valid facebook url");
        }
      }

      console.log(response);

      if (response) {
        toast.success("Recipients tagged successfully");
        setMessage("");
        setUrl("");
        setLoading(false);
        setVisibility(false);
      }
    } else {
      toast.warn("Please create a message");
    }
  };

  return (
    <MDBModal staticBackdrop show={visibility} tabIndex="-1">
      <MDBModalDialog centered size="xl">
        <MDBModalContent className={`${theme.bg} ${theme.text}`}>
          <MDBModalHeader>
            <MDBModalTitle>Tag People</MDBModalTitle>
          </MDBModalHeader>
          <MDBModalBody>
            <MDBRow>
              <MDBCol size={9}>
                <MDBContainer className="rounded border pb-2">
                  <MDBRow>
                    <MDBCol size={1} className="ps-0">
                      Members:
                    </MDBCol>
                    <MDBCol size={11}>
                      {recipients?.map((recipient, index) => (
                        <MDBBadge
                          key={`selected-recipient-${index}`}
                          className="mx-1"
                        >
                          {recipient.facebook}
                        </MDBBadge>
                      ))}
                    </MDBCol>
                  </MDBRow>
                </MDBContainer>
                <MDBInput
                  label="Facebook Link"
                  className="my-2"
                  readOnly={selectedPost.name || loading}
                  value={selectedPost.name || url}
                  onChange={e => setUrl(e.target.value)}
                />
                <MDBTextArea
                  label="Message"
                  readOnly={loading}
                  value={message}
                  onChange={e => setMessage(removeEmoji(e.target.value))}
                  rows={4}
                />
              </MDBCol>
              <MDBCol>
                <MDBListGroup>
                  {catalogs?.map((post, index) => (
                    <MDBListGroupItem key={`post-view-${index}`}>
                      <MDBRow>
                        <MDBCol
                          className="ps-0"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {post.name}
                        </MDBCol>
                        <MDBCol size={3}>
                          <MDBBtn
                            size="sm"
                            onClick={() => {
                              if (selectedPost._id === post._id) {
                                setSelectedPost({});
                              } else {
                                setSelectedPost(post);
                              }
                            }}
                            floating
                            color={
                              selectedPost._id === post._id
                                ? "danger"
                                : "success"
                            }
                          >
                            <MDBIcon
                              icon={
                                selectedPost._id === post._id
                                  ? "times"
                                  : "check"
                              }
                            />
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>
                    </MDBListGroupItem>
                  ))}
                </MDBListGroup>
              </MDBCol>
            </MDBRow>
          </MDBModalBody>

          <MDBModalFooter>
            <MDBBtn
              type="button"
              color={theme.color}
              disabled={loading}
              className="shadow-0"
              onClick={() => setVisibility(false)}
            >
              Close
            </MDBBtn>
            <MDBBtn
              type="button"
              color="warning"
              disabled={loading}
              className="shadow-0"
              onClick={handleSend}
            >
              {loading ? <MDBIcon far icon="clock" spin /> : "send"}
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
