import React, {useState , useEffect}  from 'react';
import Axios from 'axios'
import './App.css';
import {useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DateTimePicker from 'react-datetime-picker';


function App() {

  const ref = useRef(null);

  const [clusterName, setClusterName] = useState('') //add new cluster
  const [clusters, setClusters] = useState([]) //get all members


  const [name, setName] = useState('') //add new member_name
  const [nickname, setNickname] = useState('') //add new member_name
  const [email, setEmail] = useState('') //add new member_email
  const [username, setUsername] = useState('') //add new member_email
  const [user_id, setuser_id] = useState('') //add new member_email


  const [members, setMembers] = useState([]) //get all members

  const [newEmail, setNewEmail] = useState('') //set new email
  const [newName, setNewName] = useState('') //set new email

  const [clusterID, setAssignedCluster]  = useState(''); //member assignment

  const [toDeleteMember, setToDeleteMember]  = useState('');
  const [toDeleteCluster, setToDeleteCluster]  = useState('');

  const [toEditClusterName, setToEditClusterName] = useState('');
  const [toEditClusterID, setToEditClusterID] = useState('');

  const [displayClusterID, setDisplayClusterID] = useState('');

  //Send Message
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState([]);

  //Tag People
  const [tagLink, setTagLink] = useState('');
  const [tagMessage, setTagMessage] = useState('');


  //Post_List
  //like and share posts
  const postArr = [
    {
      type: "text",
      id: 1,
      value: ""
    }
  ];
  const [postlist, setPostList] = useState([]);
  const [postListName, setPostListName] = useState('');
  const [postArray, setPostArray] = useState(postArr);

  const [displayPostListID, setDisplayPostListID] = useState('');
  const [selectedPost, setSelectedPost] = useState([]);

  //Page_List
  // like and follow page
  const pageArr = [
    {
      type: "text",
      id: 1,
      value: ""
    }
  ];
  const [pagelist, setPageList] = useState([]);
  const [pageListName, setPageListName] = useState('');
  const [pageArray, setPageArray] = useState(pageArr);

  const [displayPageListID, setDisplayPageListID] = useState('');
  const [selectedPage, setSelectedPage] = useState([]);
 
  //  MEETING

  const [meetings, setMeetings] = useState([])
  const [meetingTitle, setMeetingTitle] = useState('') //add new cluster
  const [date, setDate] = useState(new Date())
  const [content, setContent] = useState('')
  const [alertMessage, setAlertMessage] = useState('')

  const [selectedMeetingID, setSelectedMeetingID] = useState('')
  const [selectedMtngTitle, setSelectedMtngTitle] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedContent, setSelectedContent] = useState('')
  
  //add a new meeting
  const addNewMeeting = () => {
    console.log("[FRONTEND] add new cluster")
    Axios.post('http://localhost:8080/add-meeting',{meetingTitle, date, content})
  }
  const sendAlertMeeting = () =>{
    Axios.post('http://localhost:8080/alert-meeting', {selectedMeetingID, recipients, alertMessage})
  }
  const deleteMeeting = (id) => {
    Axios.delete(`http://localhost:8080/delete-meeting/${id}`)
  }

  useEffect(()=>{
    Axios.get('http://localhost:8080/get-meetings').then(res=>{
      setMeetings(res.data.data.meetings)
      setSelectedMeetingID(res.data.data.meetings[0]._id)
      setSelectedMtngTitle(res.data.data.meetings[0].title);
      setSelectedDate(res.data.data.meetings[0].date)
      setSelectedContent(res.data.data.meetings[0].content);
    })
  }, [])

  function AnnounceMeeting(){
    var data = meetings.find((d) => d._id == selectedMeetingID);
    if (data){
      // data = data.members
      // setRecipients(data)
      return (
        <>
        <SelectClusterOption/>
        <select
        disabled = {false}
        value={selectedMeetingID}
        onChange={(e) => setSelectedMeetingID(e.currentTarget.value)}
        >
        {meetings.map((item) => (
        <option key={item._id} value={item._id}>
            {item.title}
        </option>
        ))}
    </select>

      <ul>
      Title<br/>
      <li>{data.title}</li>
      Date<br/>
      <li>{data.date}</li>
      Content<br/>
      <li>{data.content}</li>
      </ul>

      <button  className='delete-btn' onClick={() =>{deleteMeeting(selectedMeetingID)}}>Delete this meeting</button>
    </>
    
      )
    }
   
  }


  const addNewCluster = () => {
    console.log("[FRONTEND] add new cluster")
    Axios.post('http://localhost:8080/add-cluster',{clusterName})
  }

  const addInputPost = () => {
    setPostArray(s => {
      return [
        ...s,
        {
          type: "text",
          value: ""
        }
      ];
    });
  };

  const deleteInputPost = () => {
    setPostArray(postArray.slice(0,-1));
  };

  const changePostArr = e => {
    e.preventDefault();

    const index = e.target.id;
    setPostArray(s => {
      const newArr = s.slice();
      newArr[index].value = e.target.value;

      return newArr;
    });
  };

  const addInputPage = () => {
    setPageArray(s => {
      return [
        ...s,
        {
          type: "text",
          value: ""
        }
      ];
    });
  };

  const deleteInputPage = () => {
    setPageArray(postArray.slice(0,-1));
  };

  const changePageArr = e => {
    e.preventDefault();

    const index = e.target.id;
    setPageArray(s => {
      const newArr = s.slice();
      newArr[index].value = e.target.value;

      return newArr;
    });
  };


  //update a cluster
  const editCluster = (id) =>{
    Axios.put(`http://localhost:8080/edit-cluster/${id}`,{toEditClusterID, toEditClusterName})
  }

  //delete a cluster
  const deleteCluster = (id) => {
    Axios.delete(`http://localhost:8080/delete-cluster/${id}`)
  }
  //get all members in the backend
  useEffect(() => {
    Axios.get('http://localhost:8080/get-members').then(res => {
      setMembers(res.data.data.members)
      setToDeleteMember(res.data.data.members[0]._id)
    })
  },[])
  //get all clusters in the backend
  useEffect(() => {
    Axios.get('http://localhost:8080/get-clusters').then(res => {
      setClusters(res.data.data.clusters)
      setAssignedCluster(res.data.data.clusters[0]._id)
      setToDeleteCluster(res.data.data.clusters[0]._id)
      setToEditClusterID(res.data.data.clusters[0]._id)
      setDisplayClusterID(res.data.data.clusters[0]._id)

    })
  },[])
  //get all Post_List in the backend
  useEffect(()=>{
    Axios.get('http://localhost:8080/get-postlist').then(res=>{
      setPostList(res.data.data.postlist);
      setSelectedPost(res.data.data.postlist[0].urls)
      setDisplayPostListID(res.data.data.postlist[0]._id);
    })
  }, [])

  //get all Page_List in the backend
  useEffect(()=>{
    Axios.get('http://localhost:8080/get-pagelist').then(res=>{
      setPageList(res.data.data.pagelist);
      setSelectedPage(res.data.data.pagelist[0].urls)
      setDisplayPageListID(res.data.data.pagelist[0]._id);
    })
  }, [])


  //edit a member 
  const updateMember = (id) =>{
    Axios.put(`http://localhost:8080/update-member/${id}`,{newName, newEmail})
  }

  //add a member
  const addNewMember = () => {
    Axios.post('http://localhost:8080/add-member',{name, email, nickname, user_id, username, clusterID})
  }

  //delete a member
  const deleteMember = (id) => {
    Axios.delete(`http://localhost:8080/delete-member/${id}`)
  }

  //send message 
  const sendMessage = (recipients) => {
    Axios.post('http://localhost:8080/send-message',{message, recipients})
  }
  const submitPosts = () => {
    Axios.post('http://localhost:8080/submit-posts',{postListName, postArray})
  }

  //like post
  const likePosts = () => {
    Axios.post('http://localhost:8080/like-posts',{selectedPost})
  }

  //share post
  const sharePosts = () => {
    Axios.post('http://localhost:8080/share-posts',{selectedPost})
  }

  //Page_List
  const submitPages = () => {
    Axios.post('http://localhost:8080/submit-pages',{pageListName, pageArray})
  }
  //like pages
  const likePages = () => {
    Axios.post('http://localhost:8080/like-pages',{selectedPage})
  }
  function MemberToClusterOption (){
    return (
      <select
      disabled = {false}
      value={clusterID}
      onChange={(e) => setAssignedCluster(e.currentTarget.value)}
      >
      {clusters.map((item) => (
      <option key={item._id} value={item._id}>
          {item.cluster_name}
      </option>
      ))}
  </select>
    );
  }

  function DeleteClusterOption (){
    return (
      <select
      disabled = {false}
      value={clusterID}
      onChange={(e) => setToDeleteCluster(e.currentTarget.value)}
      >
      {clusters.map((item) => (
      <option key={item._id} value={item._id}>
          {item.cluster_name}
      </option>
      ))}
  </select>
    );
  }

  function DeleteClusterOption (){
    return (
      <select
      disabled = {false}
      value={toDeleteCluster}
      onChange={(e) => setToDeleteCluster(e.currentTarget.value)}
      >
      {clusters.map((item) => (
      <option key={item._id} value={item._id}>
          {item.cluster_name}
      </option>
      ))}
  </select>
    );
  }

  function EditClusterOption (){
    return (
      <select
      disabled = {false}
      value={clusterID}
      onChange={(e) => setToEditClusterID(e.currentTarget.value)}
      >
      {clusters.map((item) => (
      <option key={item._id} value={item._id}>
          {item.cluster_name}
      </option>
      ))}
  </select>
    );
  }

  function MembersList(){
    return (
      <select
      disabled = {false}
      value={toDeleteMember}
      onChange={(e) => setToDeleteMember(e.currentTarget.value)}
      >
      {members.map((item) => (
      <option key={item._id} value={item._id}>
          {item.name}
      </option>
      ))}
  </select>
    )
  }

 
  function MembersByCluster(){
    var data = clusters.find((d) => d._id == displayClusterID);
    if (data){
      data = data.members
      setRecipients(data)
      return (
        <>
        <select
        disabled = {false}
        value={displayClusterID}
        onChange={(e) => setDisplayClusterID(e.currentTarget.value)}
        >
        {clusters.map((item) => (
        <option key={item._id} value={item._id}>
            {item.cluster_name}
        </option>
        ))}
    </select>
    <ul>
      {data.map((member) => (
      <li>{member.name}</li>
      ))}
    </ul>
    </>
    
      )
    }
   
  }

  function PostsByName(){
    var data = postlist.find((d) => d._id == displayPostListID);
    if (data){
      data = data.urls
      setSelectedPost(data)
      return (
        <>
        <select
        disabled = {false}
        value={displayPostListID}
        onChange={(e) => setDisplayPostListID(e.currentTarget.value)}
        >
        {postlist.map((item) => (
        <option key={item._id} value={item._id}>
            {item.postListName}
        </option>
        ))}
    </select>
    <ul>
      {selectedPost.map((post) => (
      <li>{post}</li>
      ))}
    </ul>
    </>
    
      )
    }
   
  }
  function PagesByName(){
    var data = pagelist.find((d) => d._id == displayPageListID);
    if (data){
      data = data.urls
      setSelectedPage(data)
      return (
        <>
        <select
        disabled = {false}
        value={displayPageListID}
        onChange={(e) => setDisplayPageListID(e.currentTarget.value)}
        >
        {pagelist.map((item) => (
        <option key={item._id} value={item._id}>
            {item.pageListName}
        </option>
        ))}
    </select>
    <ul>
      {selectedPage.map((page) => (
      <li>{page}</li>
      ))}
    </ul>
    </>
    
      )
    }
  }
  function SelectClusterOption (){
    var data = clusters.find((d) => d._id == displayClusterID);
    if (data){
      data = data.members
      setRecipients(data)
      return (
      <>
        <select
          disabled = {false}
          value={displayClusterID}
          onChange={(e) => setDisplayClusterID(e.currentTarget.value)}
          >
          {clusters.map((item) => (
          <option key={item._id} value={item._id}>
              {item.cluster_name}
          </option>
          ))}
        </select>
      
        <ul>
          {data.map((member) => (
          <li>{member.name}</li>
          ))}
        </ul>
    </>
    );
    }
  }

  // Methods
  const deletePostlist = (id) => {
    Axios.delete(`http://localhost:8080/delete-postlist/${id}`)
  }
  const deletePagelist = (id) => {
    Axios.delete(`http://localhost:8080/delete-pagelist/${id}`)
  }
  const tagPeople = (tagLink, clusterID, tagMessage) => {
    Axios.post(`http://localhost:8080/tag-people/`, {tagLink, recipients, tagMessage})
  }


  return (
    <div className="container">
      <h1>Notifly</h1>
      {/* <button onClick={openBrowser}>Open Chromium</button> */}
      <h4>Add Cluster</h4>
        <label htmlFor="">Cluster Name: </label>
        <input type="text" onChange={(e) => {setClusterName(e.target.value)}}/><br/><br/>
        <button onClick={addNewCluster}>Add New Cluster Name</button>
      <hr/>
      <h4>Add Member</h4>
        <label htmlFor="">Facebook Name: </label>
        <input type="text" onChange={(e) => {setName(e.target.value)}}/><br/><br/>
        <label htmlFor="">Nickname: </label>
        <input type="text" onChange={(e) => {setNickname(e.target.value)}}/><br/><br/>
        <label htmlFor="">Email: </label>
        <input type="email" onChange={(e) => {setEmail(e.target.value)}}/><br/><br/>
        <label htmlFor="">Username: </label>
        <input type="username" onChange={(e) => {setUsername(e.target.value)}}/><br/><br/>
        <label htmlFor="">User ID: </label>
        <input type="user_id" onChange={(e) => {setuser_id(e.target.value)}}/><br/><br/>
        Committee: <MemberToClusterOption/>
        <br/>
        <button onClick={addNewMember}>Add New Member</button>
      <hr/>  

      <h4>Delete Member</h4>
      <MembersList/>
      <button  className='delete-btn' onClick={() =>{deleteMember(toDeleteMember)}}>Delete</button>
      <hr/> 

      <h4>Delete Cluster</h4>
      <DeleteClusterOption/>
      <button  className='delete-btn' onClick={() =>{deleteCluster(toDeleteCluster)}}>Delete</button>
      <hr/>

      <h4>Edit Cluster</h4>
      <EditClusterOption/><br/>
      Edit Name
      <input type="text" onChange={(e) => {setToEditClusterName(e.target.value)}}/><br/>
      <button  className='edit-btn' onClick={() =>{editCluster(toEditClusterID)}}>Edit</button>
      <hr/>

      <h4>Get Members by Cluster</h4>
      <MembersByCluster/><br/>

      <h4>Send Message</h4>
      Message: <br/>
      <textarea onChange={(e) => {setMessage(e.target.value)}}/><br/><br/>
      <button  className='send-btn' onClick={() =>{sendMessage(recipients)}}>Send</button>

      <hr/>

      
      <h4>Send Message</h4>
      Message: <br/>
      <textarea onChange={(e) => {setMessage(e.target.value)}}/><br/><br/>
      <button  className='send-btn' onClick={() =>{sendMessage(recipients)}}>Send</button>

      <hr/>

      <h4>Post Lists</h4>
      <br/>
      <div>
      <input type="text" onChange={(e) => {setPostListName(e.target.value)}}/><br/><br/>
      <button onClick={addInputPost}>+</button>
      <button onClick={deleteInputPost}> - </button>
      {postArray.map((item, i) => {
        return (
          <>
          <br/>
          <input
            onChange={changePostArr}
            value={item.value}
            id={i}
            type={item.type}
            size="150"
          />
          </>
        );
      })}
      <br/><br/>
      <button  className='send-btn' onClick={() =>{submitPosts()}}>Submit Post List</button>
    </div>
    <h4>Tag People</h4>
    <SelectClusterOption/>
    Link:
    <input type="text" onChange={(e) => {setTagLink(e.target.value)}}/><br/><br/>
    Tagging message:
    <textarea onChange={(e) => {setTagMessage(e.target.value)}}/><br/><br/>
    <button  className='submit-btn' onClick={() =>{tagPeople(tagLink, clusterID, tagMessage)}}>Tag People</button>
    <br/>
    <h4>Get Posts by Name</h4>
    <PostsByName/><br/>
    <button  className='delete-btn' onClick={() =>{deletePostlist(displayPostListID)}}>Delete Post List</button>
    <button  className='send-btn' onClick={() =>{likePosts()}}>Like Post</button>
    <button  className='send-btn' onClick={() =>{sharePosts()}}>Share Post</button>
    <br/>

    <h4>Page Lists</h4>
      <br/>
      <div>
      <input type="text" onChange={(e) => {setPageListName(e.target.value)}}/><br/><br/>
      <button onClick={addInputPage}>+</button>
      <button onClick={deleteInputPage}> - </button>
      {pageArray.map((item, i) => {
        return (
          <>
          <br/>
          <input
            onChange={changePageArr}
            value={item.value}
            id={i}
            type={item.type}
            size="150"
          />
          </>
        );
      })}
      <br/><br/>
      <button  className='send-btn' onClick={() =>{submitPages()}}>Submit Page List</button> 
    </div>

    <h4>Get Pages by Name</h4>
    <PagesByName/><br/>
    <button  className='delete-btn' onClick={() =>{deletePagelist(displayPageListID)}}>Delete Page List</button>
    <button  className='send-btn' onClick={() =>{likePages()}}>Like Pages</button>

    <h4>Set New Meeting</h4>
    <label htmlFor="">Meeting Title: </label>
    <input type="text" onChange={(e) => {setMeetingTitle(e.target.value)}}/><br/><br/>
    <label htmlFor="">Date: </label>
    <DateTimePicker onChange={setDate} value={date} />

    <br/>
    Content: <br/>
    <textarea onChange={(e) => {setContent(e.target.value)}}/><br/><br/>

    <button onClick={addNewMeeting}>Submit</button>

    <h4>Announce Meeting</h4>
    <AnnounceMeeting/> <br/>
    
    Alert Meesage: <br/>
      <textarea onChange={(e) => {setAlertMessage(e.target.value)}}/><br/><br/>
      <button  className='send-btn' onClick={() =>{sendAlertMeeting(recipients)}}>Send</button>

    </div> 

  
  );
}
export default App;