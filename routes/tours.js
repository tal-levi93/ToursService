const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const e = require('express');
const fs = require('fs');

// variables
const dataPath = './data/tours.json';




// helper methods
const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                console.log(err);
            }
            if (!data) data="{}";
            callback(returnJson ? JSON.parse(data) : data);
       });
};



const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                console.log(err);
            }

            callback();
        });
    };


module.exports = {
    //READ
    get_tours: function (req, res) {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);                 
            }
            else
                parsed_data = JSON.parse(data)
                sorted_data = {}
                var keys = Object.keys(parsed_data)
                keys.sort()
                keys.forEach(elements =>{
                    sorted_data[elements] = parsed_data[elements]
                })
                

                res.send(!sorted_data? JSON.parse("{}") : sorted_data);
        });
    },
  
    // CREATE
   create_tour: function (req, res) {

        readFile(data => {
            var keys = Object.keys(req.body)
            if (!req.body){ 
                return res.sendStatus(500);
            }
            req.body["path"] = []
            data[req.body["id"]] = req.body
            

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('new tour added');
            });
        },
            true);
    },

    // UPDATE
    update_tour: function (req, res) {

        readFile(data => {
            //update user 
            console.log(req.body)
            var tours = Object.keys(data)
            if(!req.params["id"]){
                res.status(400).send("id is missing")
            }
            const tourId = req.params["id"];
            tour_exist = false;
            for(let i = 0 ; i<tours.length ; i++){
                if(tours[i] == tourId){
                    tour_exist = true;
                    break;
                }
            }
            if (tour_exist){
                id_exist = false;
                var new_obj = {}


                fields = Object.keys(req.body)
                for(i=0 ;i<fields.length;i++){
                    if(fields[i] == "id"){
                        id_exist = true;
                        loc = i
                    }
                }
                if(id_exist){
                    obj_name = req.body[fields[loc]]
                      
                }
                else{
                    obj_name = data[tourId]["id"] 
                }
                
                var old_fields = Object.keys(data[tourId])
                old_fields.forEach(elements => {
                    if(elements == "guide"){
                        guide_exist = false;
                        new_obj[elements] = {}
                        for(let k = 0 ; k<fields.length;k++){
                            if(fields[k] == "guide")
                            guide_exist = true;
                        }
                        if(!guide_exist){
                            new_obj[elements] = data[tourId][elements]
                        }
                        else{
                            var old_guide_fields = Object.keys(data[tourId][elements])
                            var new_guide_fields = Object.keys(req.body[elements])
                            old_guide_fields.forEach(guide_element =>{
                            if(req.body[elements].hasOwnProperty(guide_element)){
                                new_obj[elements][guide_element] = req.body[elements][guide_element]
                            }
                            else{
                                new_obj[elements][guide_element] = data[tourId][elements][guide_element]
                            }
                            })
                            
                        }
                    }
                            
                    else if(req.body.hasOwnProperty(elements)){
                        new_obj[elements] = req.body[elements]
                    }
                    else{
                        new_obj[elements] = data[tourId][elements]
                    }
                })
            delete data[tourId]
            data[obj_name] = new_obj
            }
            
            
            else{
                res.status(400).send("tour doesnt exist")
            } 
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`tours id:${tourId} updated`);
            });
        },
            true);
    },
    create_site:function(req,res){

        readFile(data => {
            var tours  = Object.keys(data);
            if(!req.params["id"]){
                res.status(400).send("id is missing")
            }
            const tourId = req.params["id"]
            tour_exist = false;
            for(let i = 0 ; i<tours.length ; i++){
                if(tours[i] == tourId){
                    tour_exist = true;
                }
            }
            if(tour_exist){
                site_exist = false;
                size = 0
                for(let i in data[tourId]["path"]){
                    if(data[tourId]["path"][i]["name"] == req.body["name"]){
                        site_exist = true;
                    }
                    size = i
                    
                }
                if(!site_exist){
                    length = data[tourId]["path"].length
                    data[tourId]["path"][length] = req.body
                }
            }
            else{
                res.status(400).send("tour doesnt exist")
            }
            
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`site in  tourid:${tourId} updated`);
            });
        },
            true);
    },

    get_tour: function (req, res) {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);                 
            }
            else{
                const tourId = req.params["id"]
                let tmp = JSON.parse(data)
                let tours = Object.keys(tmp)
                tour_exist = false;
                for(let i = 0 ; i<tours.length ; i++){
                        if(tours[i] == tourId){
                            tour_exist = true;
                        }
                }
                if(tour_exist){
                    let tour_details = tmp[tourId]
                    res.status(200).send(tour_details)
                }
                else{
                    res.status(400).send("tour doesnt exist")
                }
            }  
        });
    },
    // DELETE
    delete_site: function (req, res) {

        readFile(data => {
            ///const userId = req.params["id"];
            var tours  = Object.keys(data);
            // console.log(tours)
            
            // if(!req.params["id"]){
            //     res.status(400).send("id is missing")
            // }
            const tourId = req.params["id"]
            if(!data.hasOwnProperty(tourId)){
                res.status(400).send("tour doesnt exist")
            }
            site = req.body
            console.log(site)
            site_exist = false
            pos = 0;
            data[tourId]['path'].forEach( elements =>{
                if(elements['name'] == site['name'] && elements['country'] == site['country']){
                    site_exist = true
                    
                }
            })
            console.log(site_exist)


            if(site_exist){
                var sites =  data[tourId]["path"]
                console.log(sites)
                position = 0
                for(let i = 0 ; i < sites.length ; i++){
                    if(sites[i]['name'] == req.body['name']){
                        sites.splice(i,1)
                        data[tourId]['path'] = sites
                        break;
                    }
                }
            }
            else{
                res.status(400).send("site doesnt exist")    
            }
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`site in tour id:${tourId} removed`);
            });
        },
            true);
    },

    delete_tour: function (req, res) {
        readFile(data => {

            const tourId = req.params["id"];
            
            tour_exist = false;
            tours = Object.keys(data);
            for(let i =0;i<tours.length;i++){
                if(tours[i] == tourId){
                    tour_exist = true;
                    break;
                }
            }
            if(tour_exist){
                delete data[tourId];
            }
            else{
                res.status(400).send("tour doesnt exist")
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`tour id:${tourId} removed`);
            });
        },
            true);
    }
};