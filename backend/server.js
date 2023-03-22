const mongoose = require("mongoose");

const db = require("./models");

const createTutorial = function(tutorial) {
  return db.Tutorial.create(tutorial).then(docTutorial => {
    console.log("\n>> Created Tutorial:\n", docTutorial);
    return docTutorial;
  });
};

const createImage = function(tutorialId, image) {
  return db.Image.create(image).then(docImage => {
    console.log("\n>> Created Image:\n", docImage);
    return db.Tutorial.findByIdAndUpdate(
      tutorialId,
      {
        $push: {
          images: {
            _id: docImage._id,
            url: docImage.url,
            caption: docImage.caption
          }
        }
      },
      { new: true, useFindAndModify: false }
    );
  });
};

// const createImage = function(tutorialId, image) {
//   console.log("\n>> Add Image:\n", image);
//   return db.Tutorial.findByIdAndUpdate(
//     tutorialId,
//     {
//       $push: {
//         images: {
//           url: image.url,
//           caption: image.caption
//         }
//       }
//     },
//     { new: true, useFindAndModify: false }
//   );
// };

const createComment = function(tutorialId, comment) {
  return db.Comment.create(comment).then(docComment => {
    console.log("\n>> Created Comment:\n", docComment);

    return db.Tutorial.findByIdAndUpdate(
      tutorialId,
      { $push: { comments: docComment._id } },
      { new: true, useFindAndModify: false }
    );
  });
};

const createCategory = function(category) {
  return db.Category.create(category).then(docCategory => {
    console.log("\n>> Created Category:\n", docCategory);
    return docCategory;
  });
};

const addTutorialToCategory = function(tutorialId, categoryId) {
  return db.Tutorial.findByIdAndUpdate(
    tutorialId,
    { category: categoryId },
    { new: true, useFindAndModify: false }
  );
};

const getTutorialWithPopulate = function(id) {
  return db.Tutorial.findById(id)
    .populate("comments", "-_id -__v")
    .populate("category", "name -_id")
    .select("-images._id -__v");
};

const getTutorialsInCategory = function(categoryId) {
  return db.Tutorial.find({ category: categoryId })
    .populate("category", "name -_id")
    .select("-comments -images -__v");
};

const run = async function() {
    
  var tutorial = await createTutorial({
    title: "MongoDB One-to-Many Relationship example",
    author: "bezkoder.com"
  });

  tutorial = await createImage(tutorial._id, {
    path: "sites/uploads/images/mongodb.png",
    url: "https://bezkoder.com/images/mongodb.png",
    caption: "MongoDB Database",
    createdAt: Date.now()
  });
  console.log("\n>> Tutorial:\n", tutorial);

  tutorial = await createImage(tutorial._id, {
    path: "sites/uploads/images/one-to-many.png",
    url: "https://bezkoder.com/images/one-to-many.png",
    caption: "One to Many Relationship",
    createdAt: Date.now()
  });
  console.log("\n>> Tutorial:\n", tutorial);

  tutorial = await createComment(tutorial._id, {
    username: "jack",
    text: "This is a great tutorial.",
    createdAt: Date.now()
  });
  console.log("\n>> Tutorial:\n", tutorial);

  tutorial = await createComment(tutorial._id, {
    username: "mary",
    text: "Thank you, it helps me alot.",
    createdAt: Date.now()
  });
  console.log("\n>> Tutorial:\n", tutorial);

  var category = await createCategory({
    name: "Node.js",
    description: "Node.js tutorial"
  });

  tutorial = await addTutorialToCategory(tutorial._id, category._id);
  console.log("\n>> Tutorial:\n", tutorial);

  tutorial = await getTutorialWithPopulate(tutorial._id);
  console.log("\n>> populated Tutorial:\n", tutorial);

  var newTutorial = await createTutorial({
    title: "Mongoose tutorial with examples",
    author: "bezkoder.com"
  });

  await addTutorialToCategory(newTutorial._id, category._id);

  var tutorials = await getTutorialsInCategory(category._id);
  console.log("\n>> all Tutorials in Cagetory:\n", tutorials);
};

mongoose
  .connect("mongodb+srv://capu-pos-admin:MushroomBlueworm118@cluster0.bkkqs.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Successfully connect to MongoDB."))
  .catch(err => console.error("Connection error", err));

// // run();

const createCluster = function(cluster) {
    return db.Cluster.create(cluster).then(docCluster => {
      console.log("\n>> Created Cluster:\n", docCluster);
      return docCluster;
    });
  };

const createMember = function(clusterID, member) {
    return db.Member.create(member).then(docMember => {
        console.log("\n>> Created Member:\n", docMember);
        return db.Cluster.findByIdAndUpdate(
            clusterID,
        {
            $push: {
            members: {
                _id: docMember._id,
                name: docMember.name,
                email:docMember.email,
                user_id:docMember.user_id,
            }
            }
        },
        { new: true, useFindAndModify: false }
        );
    });
};


const addMemberToCluster = function(tutorialId, categoryId) {
  return db.Tutorial.findByIdAndUpdate(
    tutorialId,
    { category: categoryId },
    { new: true, useFindAndModify: false }
  );
};

// const getTutorialsInCategory = function(categoryId) {
//   return db.Tutorial.find({ category: categoryId })
//     .populate("category", "name -_id")
//     .select("-comments -images -__v");
// };

const run3 = async function(){

  member = await createMember(cluster1._id, {
    name: "Hugh Capuchino",
    email: "hughcapuchino@gmail.com",
    user_id: "100048852575136",
  });
  
  member = await addMemberToCluster(member._id, category._id);
  console.log("\n>> Added member to cluster:\n", member);

  tutorial = await getTutorialWithPopulate(tutorial._id);
  console.log("\n>> populated Tutorial:\n", tutorial);



}

const run2 = async function() {
    var cluster = await createCluster({
      cluster_name: "Parents"
    });

    cluster = await createMember(cluster._id, {
        name: "Gene Capuchino",
        email: "genecapuchino@gmail.com",
        user_id: "100002302030975",
      });
      console.log("\n>> Member:\n", cluster);
    
    cluster = await createMember(cluster._id, {
        name: "Neil",
        email: "neilcapuchi@gmail.com",
        user_id: "100002097673119",
      });
      console.log("\n>> Member:\n", cluster);

    var cluster1 = await createCluster({
        cluster_name: "Children"
      });
    
    cluster1 = await createMember(cluster1._id, {
        name: "Faye Capuchino",
        email: "faye.capuchino@gmail.com",
        user_id: "100003150802847",
    });
    console.log("\n>> Member:\n", cluster1);

    cluster1 = await createMember(cluster1._id, {
        name: "Hugh Capuchino",
        email: "hughcapuchino@gmail.com",
        user_id: "100048852575136",
    });
    console.log("\n>> Member:\n", cluster1);

}

//run2()

const getClustersWithMembers= function() {
  return db.Cluster.find()
    .populate("cluster_name")
    .populate("members")
};

const editCluster = function (cluster, id){
  return db.Cluster.findByIdAndUpdate(id, cluster)
}

const deleteCluster = function (id){
  return db.Cluster.deleteOne( {"_id":id})
}

const run4 = async function() {
  clusters_members = await getClustersWithMembers();
  console.log("\n>> ALL CLUSTERS:\n", clusters_members);
  edited_cluster = await editCluster({"cluster_name": "Children"}, "63f56fbfc0817e2cfe98b91e")
  console.log("\n>> EDITED CLUSTERS:\n", edited_cluster)
  await deleteCluster ("63f56fbfc0817e2cfe98b91e")
}

run4()

