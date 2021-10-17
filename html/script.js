

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}




$(document).ready(function () {
    $.ajax({
        datatype:'json',
        url:'/tours',
        success:function(result){
            build_table(result);
        },
        error:function(err){
            console.log("err" , err);
        }
    });


});

guide_det = {
    name:"",
    email:"",
    cellphone:""
}

function sort_table(sort_by){
    var table, rows, switching, i, x, y, shouldSwitch , column_pos;
    if(sort_by == "tour"){
        column_pos = 0;
    }
    else if(sort_by == "price"){
        column_pos = 1
    }
    else if(sort_by == "date"){
        column_pos = 2
    }
    else if(sort_by == "duration"){
        column_pos = 3        
    }
    table = $('#table')[0]
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[column_pos];
            y = rows[i + 1].getElementsByTagName("TD")[column_pos];
            if(sort_by == "tour"){
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
            else if(sort_by == "price"){
                if (x.innerHTML > y.innerHTML) {
                    shouldSwitch = true;
                    break;
                }
            }
            else if(sort_by == "date"){
                var x_date = new Date(x.innerHTML)
                var y_date = new Date(y.innerHTML)
                if (x_date > y_date) {
                    shouldSwitch = true;
                    break;
                }
                
            }
            else{
                if (x.innerHTML < y.innerHTML) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

function build_table(res){
    btn = "<button class = add_top onclick = add_tour()>Add tour</button>"
    btn_2 = "<button class = add_bottom onclick = add_tour()>Add tour</button>" 
    table = btn
    table += "<table id = 'table' class = 'table table-condensed' ><thead><tr><th><button class = sort_tour onclick = sort_table('tour')>Tour</button></th><th><button class = sort_price onclick = sort_table('price')>Price</button></th><th><button onclick = sort_table('date')>Starting Date</button></th><th><button onclick = sort_table('duration')>Duration</button></th><th>Guide</th><th>Path</th></tr></thead><tbody>";
    table_end = "</tbody></table>"
    tours = Object.keys(res);
    
    
    //button_guide(res[tours[0]]["guide"]["name"])
    
    
    for(let i = 0; i<tours.length ; i++){
        table+= "<tr>"
        tour_name = res[tours[i]]["id"]
        duration = res[tours[i]]["duration"]
        date = res[tours[i]]["start_date"]
        price = res[tours[i]]["price"]
        guide = button_guide(res[tours[i]]["guide"]["name"] , tours[i])
        path = "<button id =path_"
        path += tours[i]
        path += " onclick = parsePath(this.id)>Show path</button>"
        path += "<button id="
        path += tours[i]
        path += " class = path_"
        path += tours[i]
        path += " onclick = add_path("
        path += "this.id"
        path += ")>Add path</button>"
        edit = "<button id =" 
        edit += tours[i]
        edit += " class = edit_"
        edit += tours[i]
        edit += " onclick = edit_tour(this.id)>Edit tour</button>"
        delete_btn = create_delete_btn(tours[i]);
        table += "<td>" + tour_name + "</td><td>" + price + "</td><td>"+ date +"</td><td>"+ duration +"</td><td>"+ guide +"</td><td>"+ path+  "</td><td>" + delete_btn + "</td><td>" + edit + "</td>" ;
        table += "</tr>"
    }
    
    table += table_end;
    table += btn_2
    $(".body").append(table)
    
    
}


function add_tour(){
    add_form = "<form id = add_form class = add_form><label for=Tour_name>Tour name:</label><br><input type = text id=tour_name value = tour_name><br>"
    add_form += "<label for=start_date>Starting date:</label><br><input type = date id=starting_date value = 2021-01-01><br>"
    add_form += "<label for=duration>duration:</label><br><input type = number id=duration value = 15><br>"
    add_form += "<label for=price>Price:</label><br><input type = number id=price value = 0><br>"
    add_form += "<label for=guide_name>Guide name:</label><br><input type = text id=guide_name value = name><br>"
    add_form += "<label for=guide_email>Guide email:</label><br><input type = email id=email value = Email><br>"
    add_form += "<label for=guide_cell>Guide cellular:</label><br><input type = tel id=cellular value = 050-1111111><br>"
    add_form += "<button type=button id =sub_btn onclick = add_submission()>Submit</input>"
    add_form += "<button type=button id=cancel_btn onclick = cancel()>Cancel</button>"
    $(".body").append(add_form)

}

function cancel(){
    location.reload()
}



function add_submission(){
    newobj = {}
    new_name = $('#body').find('input[value=tour_name]').val();
    new_date = $('#body').find('input[value=2021-01-01]').val();
    new_duration = $('#body').find('input[value=15]').val();
    new_price = $('#body').find('input[value=0]').val();
    new_guide_email = $('#body').find('input[value=Email]').val();
    new_guide_cellular = $('#body').find('input[value=050-1111111]').val();
    new_guide_name = $('#body').find('input[value=name]').val();
    
    newobj["id"] = new_name
    newobj["price"] = new_price
    newobj["duration"] = new_duration
    newobj["start_date"] = new_date
    newobj["guide"] = {}
    newobj["guide"]["name"] = new_guide_name
    newobj["guide"]["email"] = new_guide_email
    newobj["guide"]["cellular"] = new_guide_cellular
    
    
    $.ajax({
        type:'POST',
        datatype:'json',
        data:  newobj,
        url:'/tours/',
        success:function(res){
            location.reload()
                
        },
        error:function(err){
            console.log("err" , err);
        }
    });
    
    

            


}

function parsePath(tour){
    
    res = tour.split('_')
    tour = res[1]
    
    $.ajax({
        type:'GET',
        datatype:'json',
        url:'/tours/' + tour,
        success:function(res){ 
            path = res["path"]
            path_string = ''
            
            if(path.length != 0){
                for(let i = 0;i<path.length ; i++){
                    nick = path[i]["name"]
                    path_string += "Name: " + path[i]["name"] + " Country: " + path[i]["country"] +"<button   id = " + tour +  " onclick = delete_site(this.id," + i +")>Delete site</button>" + "<br>" 
                }
            }
            else{
                path_string += "There is no path yet"
            }
            
            $("#path_"+tour).replaceWith(path_string)
          
        },
        error:function(err){
            console.log("err" , err);
        }
    });
    
    //console.log(details)
}


function delete_site(id , idx){
    console.log(id)
    console.log(idx)

    $.ajax({
        type:'GET',
        datatype:'json',
        url:'/tours/' + id,
        success:function(res){ 
            path_name = res['path'][idx]

            console.log(path_name)  
            $.ajax({
                url: '/deletesite/' + id ,
                type: 'PUT',
                datatype:'json',
                data:JSON.stringify(path_name),
                contentType: 'application/json; charset=utf-8',
                success:function(result){
                    location.reload()
                },
                error:function(err){
                    console.log("err" , err);
                }
            });       
        },
        error:function(err){
            console.log("err" , err);
        }
    });
    



    /*
    
    */
    
}

function edit_tour(id){

    $.ajax({
        type:'GET',
        datatype:'json',
        url:'/tours/' + id,
        success:function(res){ 
                edit = "<form id = edit_form><label for=name>Name:</label><br><input type = text id=country_"
                edit += id
                edit += " value =" 
                edit += id
                edit += "><br>"
                edit+= "<label for=duration>Duration:</label><br><input type=number value = "
                edit+= res["duration"]
                edit+= "><br><label for=price>Price:</label><br><input type=number  value = "
                edit+= res["price"]
                edit+= "><br><label for=date>Starting date:</label><br><input type=date value = "
                edit+= res["start_date"]
                edit+= "><br><label for=guide_name>Guide name:</label><br><input type=text value = "
                edit+= "name"
                edit+= "><br><label for=guide_email>Guide email :</label><br><input type=email value = "
                edit+= "name@domain.com"
                edit+= "><br><label for=duration>Guide cellular</label><br><input type=tel value = "
                edit+= res["guide"]["cellular"]
                edit+= "><br><input type=button id ="
                edit+= id
                edit+= " onclick = edit_t(this.id) value=Edit></input></form>"
                $("button.edit_" + id).replaceWith(edit)
        },
        error:function(err){
            console.log("err" , err);
        }
    });
 


    
}

function edit_t(id){



    $.ajax({
        type:'GET',
        datatype:'json',
        url:'/tours/' + id,
        success:function(res){

            update_obj = {}
            new_name = $('#body').find('input[value='+res["id"]+']').val();
            new_price = $('#body').find('input[value='+res["price"]+']').val();
            new_duration = $('#body').find('input[value='+res["duration"]+']').val();
            new_date  = $('#body').find('input[value=' +res["start_date"]+']').val();
            new_guide_name  = $('#body').find('input[value="name"]').val();
            new_email  = $('#body').find('input[value="name@domain.com"]').val();
            new_cellular  = $('#body').find('input[value='+res["guide"]["cellular"]+']').val();
            if(new_name != res["id"]){
                update_obj["id"] = new_name
            }
            if(new_price != res["price"]){
                update_obj["price"] = new_price
            }
            if(new_duration != res["duration"]){
                update_obj["duration"] = new_duration
            }
            if(new_date != res["date"]){
                update_obj["start_date"] = new_date
            }
            
            
            if(new_guide_name != res["guide"]["name"] || new_email != res["guide"]["email"] || new_cellular != res["guide"]["cellular"]){
                update_obj["guide"] = {}
            }
            if(new_guide_name != res["guide"]["name"]){
                update_obj["guide"]["name"] = new_guide_name
            }
            if(new_email != res["guide"]["email"]){
                update_obj["guide"]["email"] = new_email
            }
            if(new_cellular != res["guide"]["cellular"]){
                update_obj["guide"]["cellular"] = new_cellular
            }
            
            
            
            
            
            $.ajax({
                url: '/tours/' + id ,
                type: 'PUT',
                data:  JSON.stringify(update_obj),
                datatype:'json',
                contentType: 'application/json; charset=utf-8',
                success:function(result){
                    location.reload()
                },
                error:function(err){
                    console.log("err" , err);
                }
            });
            

            
        },
        error:function(err){
            console.log("err" , err);
        }
        
    });
    

}

function add_path(id){
    
    edit_path = "<form id = path_form><label for=country>Country:</label><br><input type=text id=country_"
    edit_path += id
    edit_path+=  " value=country ><br>"
    edit_path += "<label for=name>Name:</label><br><input type=text id=name value=name ><br><br>"
    edit_path += "<input type=button id ="
    edit_path += id
    edit_path += " onclick = get_det(this.id) value=Submit></input></form>"
    $("button.path_" + id).replaceWith(edit_path)
    
    
}

function get_det(id){
    path_name = $('#body').find('input[value="name"]').val();
    country_name = $('#body').find('input[value="country"]').val();

    $.ajax({
        url: 'http://localhost:3001/updatesite/' + id ,
        type: 'PUT',
        data: JSON.stringify({
            "name":path_name,
            "country":country_name

        }) ,
        datatype:'json',
        contentType: 'application/json; charset=utf-8',
        success:function(result){
            location.reload()
        },
        error:function(err){
            console.log("err" , err);
        }
    });
    

}

function button_guide(guide , tour){

    guide_btn = "<button type=button id="
    guide_btn+= tour
    guide_btn += " onclick = get_guide(this.id"
    guide_btn += ") class=btn btn-info >";
    guide_btn += guide + "</button>"
    return guide_btn
}



function get_guide(tour){
    $.ajax({
        datatype:'json',
        url:'/tours',
        success:function(res){
            guide_det["name"] = res[tour]["guide"]["name"]
            guide_det["email"] = res[tour]["guide"]["email"]
            guide_det["cellular"] = res[tour]["guide"]["cellular"]
            gui = "<h3> name: " + guide_det["name"] + "<br>email: " + guide_det["email"] + "<br>cellular: " + guide_det["cellular"]+ "</h3>"
            btn = $("#"+tour).replaceWith(gui)            
        },
        error:function(err){
            console.log("err" , err);
        }
    });
}

function create_delete_btn(tour){
    delete_btn = "<button id ="
    delete_btn += tour;
    delete_btn += " onclick = delete_tour("
    delete_btn += "this.id"
    delete_btn += ") class=btn btn-info>delete tour</button>"
    return (delete_btn)
}

function delete_tour(id){

    $.ajax({
        url: 'http://localhost:3001/tours/' + id ,
        type: 'DELETE',
        data: JSON.stringify({ field1 : id}) ,
        datatype:'json',
        contentType: 'application/json; charset=utf-8',
        success:function(result){
            location.reload()
        },
        error:function(err){
            console.log("err" , err);
        }
    });
}




