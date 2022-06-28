
const DataStore = require('./datastore');
const electron = require('electron');
const url = require("url");
const path = require("path");


const materialData = new DataStore({name:'Materials'});


let jobid_part_id_array=window.process.argv.slice(-3)

var jobid_ = jobid_part_id_array[0]
var partid_ = jobid_part_id_array[1]



allMaterialData = materialData.getData()["data"];
var foundMaterialData =[];
if(allMaterialData.length!=0){

	foundMaterialData = allMaterialData.filter( data => (data.job_id == jobid_) && (data.part_id == partid_) );
	console.log(foundMaterialData)

}


var table = document.getElementById("tbl_material");

var idx;
if(foundMaterialData.length>0){
	for(idx=0;idx<foundMaterialData.length;idx++){

		var data = foundMaterialData[idx]
			// Create an empty <tr> element and add it to the 1st position of the table:
		var row = table.insertRow(-1);
		var curr_row = table.rows.length-1

		// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		var cell4 = row.insertCell(3);

		var t1=document.createElement("input");
		t1.style.width ="200px";
		t1.placeholder = data["MIN_No"] 
	    cell1.appendChild(t1);

		var t2=document.createElement("input");
		t2.style.width ="200px";
		t2.className="right-text";
		
		var trail = data["Cost"];
		
		if(data["Cost"].includes('.')){
			trail = '.'+data["Cost"].split('.')[1]
		}else{
			trail = ".00"
		}
		t2.placeholder = parseFloat( data["Cost"].split('.')[0] || 0).toLocaleString() +trail
		


		t2.setAttribute('id',String(curr_row)+"_1");
		t2.setAttribute('onfocusout',"styleInput(this)");
	    cell2.appendChild(t2);

	  	var t3=document.createElement("input");
	 	t3.style.width ="200px";
	 	t3.placeholder = data["Bill_No"]
	    cell3.appendChild(t3);

	    

	    var t4=document.createElement("input");
		t4.style.width ="200px";
		t4.className="right-text";
		
		
		if(data["Cash"].includes('.')){
			//1200.50
			trail = '.'+ data["Cash"].split('.')[1]
		}else{
			trail = ".00"
		}

		t4.placeholder =parseFloat(data["Cash"].split('.')[0] || 0).toLocaleString()  +trail
		

		t4.setAttribute('id',String(curr_row)+"_3");
		t4.setAttribute('onfocusout',"styleInput(this)");

	    cell4.appendChild(t4);


	}

}




//Here's the ready function for you to use
function LoadNewWindowInCurrent (PathToHtml){
   let localWindow = electron.remote.getCurrentWindow(); 
   localWindow.loadURL(url.format({
        pathname: path.join(__dirname, PathToHtml),
        protocol: "file:",
        slashes: true,
   }));
   //localWindow.loadFile(PathToHtml);
}

function styleInput(ele){
	var table = document.getElementById("tbl_material");
	if(!isNaN(parseFloat(ele.value))){

		var newval = ele.value.split('.')[0].replace(',','')
		var trail = ele.value.split('.')[1]

		if( ele.value.split('.').length ==2){
				if(trail == "00"){
					trail=".00"
				}else{
					trail = '.'+trail		
				}
		}else{
			trail= ".00"
		}



		var val= parseFloat(newval).toLocaleString() + trail
		

		var row = ele.id.split("_")[0];
		var cell = ele.id.split("_")[1];

		var myCell = table.rows.item(row).cells[cell]
		myCell.getElementsByTagName("input")[0].value = val

	}
	
}

// button click event
document.getElementById("add_material_row").addEventListener("click", () => {
	var error = document.getElementById("error");
	error.innerHTML = ""
	
  	
    var table = document.getElementById("tbl_material");

	// Create an empty <tr> element and add it to the 1st position of the table:
	var row = table.insertRow(-1);
	var curr_row = table.rows.length-1

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);

	var t1=document.createElement("input");
	t1.style.width ="200px";

    cell1.appendChild(t1);

	var t2=document.createElement("input");
	t2.style.width ="200px";
	t2.placeholder="0"
	t2.className="right-text";
	t2.setAttribute('id',String(curr_row)+"_1");
	t2.setAttribute('onfocusout',"styleInput(this)");
    cell2.appendChild(t2);

  	var t3=document.createElement("input");
 	t3.style.width ="200px";
    cell3.appendChild(t3);

    var t4=document.createElement("input");
	t4.style.width ="200px";
	t4.placeholder="0"
	t4.className="right-text";
	t4.setAttribute('id',String(curr_row)+"_3");
	t4.setAttribute('onfocusout',"styleInput(this)");

    cell4.appendChild(t4);

 

});

document.getElementById("remove_material_row").addEventListener("click", () => {
	var error = document.getElementById("error");
	error.innerHTML = ""

  	
    var table = document.getElementById("tbl_material");
    if(table.rows.length >2){
    		var row = table.deleteRow(-1);
    }
	// Create an empty <tr> element and add it to the 1st position of the table:

 

});

// button click event
document.getElementById("submit_material").addEventListener("click", () => {

  	
    var table = document.getElementById("tbl_material");
    var tbl_rows = table.rows;

    var row;
    var filled_row_count = 0;

    var min_nos = [];
	for (row = 2; row < tbl_rows.length; row++) {
		var objCells = tbl_rows.item(row).cells;
		var Min_No_ = objCells[0].getElementsByTagName("input")[0].value ;
		var Cost_ = objCells[1].getElementsByTagName("input")[0].value ;
		var Bill_No_ = objCells[2].getElementsByTagName("input")[0].value;
		var Cash_ = objCells[3].getElementsByTagName("input")[0].value ;


		if(Min_No_ == ""){
			Min_No_ = objCells[0].getElementsByTagName("input")[0].placeholder;

		}

		if(Cost_ == ""){
			Cost_ = objCells[1].getElementsByTagName("input")[0].placeholder

		}
		
		if(Cash_ == ""){
			Cash_ = objCells[3].getElementsByTagName("input")[0].placeholder

		}
		if(Bill_No_ == ""){
			Bill_No_ = objCells[2].getElementsByTagName("input")[0].placeholder

		}
		
		if(Min_No_ == "" && parseInt(Cost_) != 0 ){
			var error = document.getElementById("error");
			error.innerHTML = "Please fill a Min No. for the Cost!"
			break;
		} else if(Bill_No_ == "" && parseInt(Cash_ )!= 0 ){
			var error = document.getElementById("error");
			error.innerHTML = "Please fill a Bill No. for the Cash!"
			break;
		} else if( Bill_No_ == "" && parseInt(Cash_ ) == 0 && Min_No_ == "" && parseInt(Cost_) == 0   ){
			var error = document.getElementById("error");
			error.innerHTML = "A line has empty values for all fields. Remove it before submit!"
			break;		
		} else{
			if(!min_nos.includes(Min_No_)){
				min_nos.push(Min_No_);
				filled_row_count = filled_row_count+1;

			}else{
				var error = document.getElementById("error");
				error.innerHTML = "Min No "+ Min_No_ + " duplicated!"
				break;

			}
			
			
		}



	}
	

	if(filled_row_count == tbl_rows.length-2){
		materialData.delete(jobid_,partid_)
		var row;
		for (row = 2; row < tbl_rows.length; row++) {
			var objCells = tbl_rows.item(row).cells;
		

			var new_Min_No_ = objCells[0].getElementsByTagName("input")[0].value;

			if(new_Min_No_ == ""){
				new_Min_No_ = objCells[0].getElementsByTagName("input")[0].placeholder;

			}

			//var new_Cost_ = objCells[1].getElementsByTagName("input")[0].value.split('.')[0].replace(',','');

			var numeric = objCells[1].getElementsByTagName("input")[0].value

			if(numeric == ""){
				numeric = objCells[1].getElementsByTagName("input")[0].placeholder

			}

			console.log(new_Min_No_)



			if(numeric.split('.').length == 2){

				if(numeric.split('.')[1] != "00"){
					var new_Cost_ = numeric.split('.')[0].replace(',','') + '.' + numeric.split('.')[1];
				}else{
					var new_Cost_ = numeric.split('.')[0].replace(',','');
				}
			}else{
				var new_Cost_ = numeric.split('.')[0].replace(',','');
			}
			console.log(new_Cost_)


			var new_Bill_No_ = objCells[2].getElementsByTagName("input")[0].value;


			if(new_Bill_No_ == ""){
				new_Bill_No_ = objCells[2].getElementsByTagName("input")[0].placeholder;

			}


			console.log(new_Bill_No_)
			




			var numeric = objCells[3].getElementsByTagName("input")[0].value


			if(numeric == ""){
				numeric = objCells[3].getElementsByTagName("input")[0].placeholder

			}



			if(numeric.split('.').length == 2){

				if(numeric.split('.')[1] != "00"){
					var new_Cash_ = numeric.split('.')[0].replace(',','') + '.' + numeric.split('.')[1];
				}else{
					var new_Cash_ = numeric.split('.')[0].replace(',','');
				}
			}else{
				var new_Cash_ = numeric.split('.')[0].replace(',','');
			}

			console.log(new_Cash_)


			//var new_Cash_ = objCells[3].getElementsByTagName("input")[0].value.split('.')[0].replace(',','');

			/*

			if(new_Min_No_ == ""){
				new_Min_No_=objCells[0].getElementsByTagName("input")[0].placeholder
			}
			
			if(new_Cost_ == ""){
				new_Cost_=objCells[1].getElementsByTagName("input")[0].placeholder
			}

			if(new_Bill_No_ == ""){
				new_Bill_No_=objCells[2].getElementsByTagName("input")[0].placeholder
			}


			if(new_Cash_ == ""){
				new_Cash_=objCells[3].getElementsByTagName("input")[0].placeholder
			}	
			*/

			

			new_material_data = {"job_id":jobid_,"part_id":partid_ ,"MIN_No":new_Min_No_,"Cost":new_Cost_,"Bill_No":new_Bill_No_,"Cash":new_Cash_};

			materialData.addData(new_material_data);
		}




		LoadNewWindowInCurrent('./edit_labour.html');
	}

	//load labourwindow

	
	   
	 

});