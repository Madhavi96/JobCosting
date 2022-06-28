
const DataStore = require('./datastore');
const electron = require('electron');
const url = require("url");
const path = require("path");

console.log(window.process.argv)







const materialData = new DataStore({name:'Materials'});

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
	t2.className="right-text";
	t2.placeholder="0"
	t2.setAttribute('id',String(curr_row)+"_1");
	t2.setAttribute('onfocusout',"styleInput(this)");
    cell2.appendChild(t2);

  	var t3=document.createElement("input");
 	t3.style.width ="200px";
    cell3.appendChild(t3);

    var t4=document.createElement("input");
	t4.style.width ="200px";
	t4.className="right-text";
	t4.placeholder="0"
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
	let jobid_part_id_array=window.process.argv.slice(-3)
	console.log(window.process.argv)

  	
    var table = document.getElementById("tbl_material");
    var tbl_rows = table.rows;

    var row;
    var filled_row_count = 0;

    allMaterialData = materialData.getData()["data"];
	var foundMaterialData = [];
	var min_nos = []

	for (row = 2; row < tbl_rows.length; row++) {
		var objCells = tbl_rows.item(row).cells;
		var Min_No_ = objCells[0].getElementsByTagName("input")[0].value;
		var Cost_ = objCells[1].getElementsByTagName("input")[0].value;
		var Bill_No_ = objCells[2].getElementsByTagName("input")[0].value;
		var Cash_ = objCells[3].getElementsByTagName("input")[0].value;

		if(Cost_ == ""){
			Cost_ = objCells[1].getElementsByTagName("input")[0].placeholder

		}
		
		if(Cash_ == ""){
			Cash_ = objCells[3].getElementsByTagName("input")[0].placeholder

		}

		console.log("min "+Min_No_)
		console.log("min "+Cost_)

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
			
		}else{

			if(allMaterialData.length!=0){

				foundMaterialData = allMaterialData.filter( data => (data.job_id == jobid_part_id_array[0]) && (data.MIN_No == Min_No_) );


			}
			if(foundMaterialData.length >0){
				alert("MIN_No "+Min_No_+" already exists!")
				break

			}else{
				if(!min_nos.includes(Min_No_)){
					filled_row_count = filled_row_count+1;
					min_nos.push(Min_No_)

				}else{
					alert("MIN_No "+Min_No_+" duplicated!")
					break

				}
				

			}
					
			
		}



	}


	//alert if duplicate MIN_No


	
	if(filled_row_count == tbl_rows.length-2){
		var row;
		for (row = 2; row < tbl_rows.length; row++) {
			var objCells = tbl_rows.item(row).cells;
			var Min_No_ = objCells[0].getElementsByTagName("input")[0].value;

			var numeric = objCells[1].getElementsByTagName("input")[0].value


			if(numeric.split('.').length == 2){

				if(numeric.split('.')[1] != "00"){
					var Cost_ = numeric.split('.')[0].replace(',','') + '.' + numeric.split('.')[1];
				}else{
					var Cost_ = numeric.split('.')[0].replace(',','');
				}
			}else{
				var Cost_ = numeric.split('.')[0].replace(',','');
			}
			console.log(Cost_)




			var Bill_No_ = objCells[2].getElementsByTagName("input")[0].value;



			var numeric = objCells[3].getElementsByTagName("input")[0].value

			if(numeric.split('.').length == 2){

				if(numeric.split('.')[1] != "00"){
					var Cash_ = numeric.split('.')[0].replace(',','') + '.' + numeric.split('.')[1];
				}else{
					var Cash_ = numeric.split('.')[0].replace(',','');
				}
			}else{
				var Cash_ = numeric.split('.')[0].replace(',','');
			}



			new_material_data = {"job_id":jobid_part_id_array[0],"part_id":jobid_part_id_array[1] ,"MIN_No":Min_No_,"Cost":Cost_,"Bill_No":Bill_No_,"Cash":Cash_};
			materialData.addData(new_material_data);
			console.log(new_material_data)
		}
		LoadNewWindowInCurrent('./labour_cost.html');
	}

	





});