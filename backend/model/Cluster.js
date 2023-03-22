const mongoose = require('mongoose')

const ClusterSchema = new mongoose.Schema({
    clusterName : {
        type : String,
        required : true
    },
    members:[
        {
            members
        }
    ]
})

const Cluster = mongoose.model('Cluster',ClusterSchema)

module.exports = Cluster