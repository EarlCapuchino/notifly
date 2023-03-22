const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require("mongoose");

// Contains models
const db = require("./models");

// Chrome driver
require("chromedriver");
require('dotenv').config();
const delay = ms => new Promise(res => setTimeout(res, ms));
const {By, Key, Builder, until, EC, WebDriverWait} = require("selenium-webdriver");


// Connect to PORT 8080
app.use(express.json())
app.use(cors())
const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})


//Connect to MONGODB Atlas
mongoose
  .connect("mongodb+srv://capu-pos-admin:MushroomBlueworm118@cluster0.bkkqs.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Successfully connect to MongoDB."))
  .catch(err => console.error("Connection error", err));

async function login(){
    var webdriver = require("selenium-webdriver");
    var chrome = require("selenium-webdriver/chrome");
    var chromeOptions = new chrome.Options();
    chromeOptions.addArguments("test-type");
    chromeOptions.addArguments("start-maximized");
    chromeOptions.addArguments("--js-flags=--expose-gc");
    chromeOptions.addArguments("--enable-precise-memory-info");
    chromeOptions.addArguments("--disable-popup-blocking");
    chromeOptions.addArguments("--disable-default-apps");
    chromeOptions.addArguments("--disable-infobars");
    chromeOptions.setUserPreferences({'profile.default_content_setting_values.notifications': 2});// this will block all the notifications
    driver = new webdriver.Builder()
                .forBrowser("chrome")
                .setChromeOptions(chromeOptions)
                .build();

    await driver.get("https://facebook.com");
    await driver.findElement(By.name("email")).sendKeys(process.env.EMAIL);
    await driver.findElement(By.name("pass")).sendKeys(process.env.PASSWORD, Key.RETURN);

    return driver
}
async function deployMessage(driver, message, recipient){
    message = message.replaceAll("@{nickname}", recipient.nickname);
    let by = By.css('div[aria-label="Message"]');
    el = await driver.wait(until.elementLocated(by, 10000))
    el = driver.findElement(by);
    driver.wait(until.elementIsVisible(el), 10000);
    el.sendKeys(message, Key.RETURN);
}
async function sendMessage(message, recipients){
    var driver = await login();
    await delay(10000)
    for (let i = 0; i < recipients.length; i++) {
        message = message.replaceAll("\n", Key.chord(Key.SHIFT, Key.ENTER));
        await driver.get(`https://facebook.com/messages/t/${recipients[i].user_id}`)
        await delay(5000)
        deployMessage(driver, message, recipients[i])
        await delay(5000)
    }
}
//CLUSTER
const getClustersWithMembers= function() {
    return db.Cluster.find()
      .populate("cluster_name")
      .populate("members")
};

const addCluster = async function(cluster) {
    const docCluster = await db.Cluster.create(cluster);
    console.log("\n>> Created Cluster:\n", docCluster);
    return docCluster;
};

const editCluster = function (cluster, id){
return db.Cluster.findByIdAndUpdate(id, cluster)
}
const deleteCluster = function (id){
    return db.Cluster.deleteOne( {"_id":id})
}

app.get('/get-clusters', async (req,res) => {
    console.log("[BACKEND] \n >>Get Cluster")
    try{
        var clusters = await getClustersWithMembers();
        res.status(200).json({
            status : 'Success',
            data : {
                clusters
            }
        })
    }catch(err){
        res.status(500).json({
            status: 'Failed',
            message : err
        })
    }
})

app.post('/add-cluster', async(req,res) => {
    console.log("[BACKEND] \n >>Add Cluster")
    
    try{
        var cluster = await addCluster({cluster_name:req.body.clusterName});
        res.status(201).json({
            status: 'Success',
            data : {
                cluster
            }
        })
    }catch(err){
        res.status(500).json({
            status: 'Failed',
            message : err
        })
    }
})

app.put('/edit-cluster/:id', async (req,res) => {
    console.log("[BACKEND] \n >>Edit Cluster")
    console.log("Req Body:", req.body)

    try{
        var edited_cluster = await editCluster({cluster_name: req.body.toEditClusterName}, req.body.toEditClusterID)
        res.status(200).json({
            status : 'Success',
            data : {
                edited_cluster
            }
          })
    }catch(err){
        res.status(500).json({
            status: 'Failed',
            message : err
        })
    }
})

app.delete('/delete-cluster/:id', async(req,res) => {
    console.log("[BACKEND] \n >>Delete Cluster")
    console.log("ID:", req.params.id)
    await deleteCluster (req.params.id)
    
    try{
      res.status(204).json({
          status : 'Success',
          data : {
            "message": "Succesfully deleted!"
          }
      })
    }catch(err){
        res.status(500).json({
            status: 'Failed',
            message : err,
            data:{
                "message": "Failed to delete!"
            }
        })
    }
})

//MEMBERS
const getMembers= function() {
    return db.Member.find({})
};

const addMember = function(clusterID, member) {
    return db.Member.create(member).then(docMember => {
        console.log("\n>> Created Member:\n", docMember);
        return db.Cluster.findByIdAndUpdate(
            clusterID,
        {
            $push: {
            members: {
                _id: docMember._id,
                name: docMember.name,
                nickname: docMember.nickname,
                username: docMember.username,
                email:docMember.email,
                user_id:docMember.user_id,
            }
            }
        },
        { new: true, useFindAndModify: false }
        );
    });
};

const deleteMember = function (ID){
     //delete its reference from the cluster
     db.Cluster
     .updateOne({},{$pull:{members:{id: ID}}},{multi:true})
     //delete the member
     return db.Member.findByIdAndDelete(ID)
}

//Methods
const addPostList = async function (postList){
    const docPostList = await db.Post_List.create(postList)
    return docPostList
}
app.get('/get-members', async (req,res) => {
    console.log("[BACKEND] \n >>Get Members")

    const members = await getMembers()
    try{
        res.status(200).json({
            status : 'Success',
            data : {
                members
            }
        })
    }catch(err){
        res.status(500).json({
            status: 'Failed',
            message : err
        })
    }
})

app.post('/add-member', async(req,res) => {
    console.log("[BACKEND] \n >>Add Member")
    newMember = {
        "name":req.body.name,
        "nickname": req.body.nickname,
        "email":req.body.email,
        "username": req.body.username,
        "user_id": req.body.user_id
    }
    console.log("new member >> \n", newMember)
    try{
        const adddedMember = await addMember(req.body.clusterID, newMember)
        res.status(201).json({
            status: 'Success',
            data : {
                adddedMember
            }
        })
    }catch(err){
        res.status(500).json({
            status: 'Failed',
            message : err
        })
    }
})

app.put('/update-member/:id', async (req,res) => {

    const updated_member = {
        "name": req.body.newName, 
        "email": req.body.newEmail
    }

    const updatedMember = await Member.findByIdAndUpdate(req.params.id, updated_member,{

      })
   
    try{
        res.status(200).json({
            status : 'Success',
            data : {
                updatedMember
            }
          })
    }catch(err){
        console.log(err)
    }
})

app.delete('/delete-member/:id', async(req,res) => {
    console.log("[BACKEND] \n >>Delete Member")
    
    try{
        console.log("ID", req.params.id)
        var deletedMember = await deleteMember(req.params.id)
        console.log("deletedMember", deletedMember)

        res.status(204).json({
          status : 'Success',
          message:deletedMember,
          data : {
            deletedMember
          }
      })

    }catch(err){
        console.log(err)
        res.status(500).json({
            status: 'Failed',
            message : err
        })
    }
})

//Methods
app.post('/send-message', async(req, res)=>{
    console.log(">>> SEND MESSAGE")
    sendMessage(req.body.message, req.body.recipients)

})

app.post('/submit-posts', async(req, res)=>{
    console.log(">>> Submit posts")
    console.log(req.body)
    postArray = req.body.postArray
    urls = [] //push all the urls
    for (let i=0; i<postArray.length; i++){urls.push(postArray[i].value)}

    try{
        var addedPostList = await addPostList({postListName: req.body.postListName, urls: urls})
        res.status(201).json({
            status: 'Success',
            data : {
                addedPostList
            }
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: 'Failed',
            message : err
        })
    }
})
async function deployTag(el, recipient){
    for (let i = 0; i < recipients.length; i++) {
        comment = "@"+recipient[i].username
        await delay(1000)
        el.sendKeys(comment);
        await delay(1000)
        el.sendKeys(Key.RETURN);
        await delay(1000)
        el.sendKeys(" ");
    }
}
async function tagPeople(postID, recipients){
    var driver = await login();
    await delay(10000)
    await driver.get(postID);
    await delay(10000)

    let by = By.css('div[aria-label="Write a comment"]');
    el = await driver.wait(until.elementLocated(by, 10000))
    el = driver.findElement(by);
    driver.wait(until.elementIsVisible(el), 10000);
    await deployTag(el, recipients)
    el.sendKeys(Key.RETURN)
}

async function likePosts(postArray){
    var driver = await login();
    await delay(10000)

    for (i=0; i< postArray.length; i++){
        await driver.get(postArray[i]);
        await delay(10000)
        let by = By.css('div[aria-label="Like"]');
        el = await driver.wait(until.elementLocated(by, 10000))
        el = driver.findElement(by);
        driver.wait(until.elementIsVisible(el), 10000);
        el.click();
        await delay(2000)
    }
}

async function sharePosts(postArray){
    var driver = await login();
    await delay(10000)
    for (i=0; i< postArray.length; i++){
        await driver.get(postArray[i]);
        await delay(10000)
        let by = By.css('div[aria-label="Send this to friends or post it on your timeline."]');
        el = await driver.wait(until.elementLocated(by, 10000))
        el = driver.findElement(by);
        driver.wait(until.elementIsVisible(el), 10000);
        el.click();

        await delay(2000)
        by = By.xpath("//*[text()='Share now (Public)']");
        el = await driver.wait(until.elementLocated(by, 10000))
        el = driver.findElement(by);
        driver.wait(until.elementIsVisible(el), 10000);
        el.click();

        await delay(2000)
    }
}

async function followPages(pageArray){
    var driver = await login();
    await delay(10000)
    for (i=0; i< pageArray.length; i++){
        await driver.get(pageArray[i]);
        await delay(10000)
        let by = By.xpath('//div[@aria-label="Like" or @aria-label="Follow"]');
        el = await driver.wait(until.elementLocated(by, 10000))
        el = driver.findElement(by);
        driver.wait(until.elementIsVisible(el), 10000);
        el.click();
        await delay(2000)
    }
}

// message = `lol`
// recipients = [{name: "sam", username:"sammy.capuchino", user_id:"100063722853475"},
// {name: "faye", username:"faye.capuchino", user_id:"100003150802847"},
// {name: "gaba", username: "sam.capuchino.9", user_id: "100045849334947"},
// {name: "hugh", username:"hughdavid.capuchino.1" ,user_id: "100084503896866"} 
// ]

//[SEND MESSAGE]


// sendMessage(message, recipients)

//[TAG PEOPLE]
postID = "https://www.facebook.com/groups/2196066893899400/posts/2293921350780620"
// tagPeople(postID, recipients)

//[LIKE SERIES OF POSTS]
// postArray = [
//     "https://www.facebook.com/sammy.capuchino/posts/pfbid03Syegs9KopRiM2wnNRxPJ7EGF1HPvBUKEJqLF9iGVr97edVwJeVphXCWLbzAXscWl",
//     "https://www.facebook.com/sammy.capuchino/posts/pfbid0suAuagLvmwhPay4Ras1s35r5D3WN2yhHeQJRHYTQdHRfma4UAmeLF9dDQvFFaHcKl",
//     "https://www.facebook.com/sammy.capuchino/posts/pfbid0R68Rptg1imgi9tiY2NRX1eskovMXzs3CWAWKmvnCMojwf4BiPM4H9vb5h2W93QZnl"
// ]
// likePosts(postArray)

// postArray = [
//     "https://www.facebook.com/PraefectsMerchandise/posts/pfbid0B7a5DTPdXDCbBd34xVonr9g3bbb4w8KmcEWCfUo9tzhAF3ohCu4tKs2AitGSZLqql",
//     "https://www.facebook.com/PraefectsMerchandise/posts/pfbid02AKV1dwdgA5ciNX7hRkmZY1hpvJzzSNukrEMnaXDZRCbrp7HCowTv6xJmoBv4jSGcl",
//     "https://www.facebook.com/PraefectsMerchandise/posts/pfbid02C5p9KqpW3FKsk5251fmH1FoF4P1NhYYDaizuwaDe2vN9ZbUQSzCVwf3ZjusxD95zl"
// ]
//[SHARE SERIES OF POSTS]
//sharePosts(postArray)

// pageArray = [
//     "https://www.facebook.com/UPLBFWall",
//     "https://www.facebook.com/uplbcas.ocs",
//     "https://www.facebook.com/uppraefects"
// ]
// //[FOLLOW SERIES OF PAGES]
// followPages(pageArray)

app.post('/open-browser', async(req,res) => {
    console.log("[BACKEND] \n >>Opening Browser")
    try{
        await login();
    }catch(err){
        res.status(500).json({
            status: 'Failed',
            message : err
        })
    }
})