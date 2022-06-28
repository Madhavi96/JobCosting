
const DataStore = require('./datastore');
const electron = require('electron');

const otherData = new DataStore({name:'Other'});

//Here's the ready function for you to use



let jobid_part_id_array=window.process.argv.slice(-3)

var jobid_ = jobid_part_id_array[0]
var partid_ = jobid_part_id_array[1]


allOtherData = otherData.getData()["data"];
console.log(allOtherData)

var foundOtherData = []
if(allOtherData.length!=0){
	foundOtherData = allOtherData.filter(data =>( data.job_id == jobid_) && (data.part_id == partid_) );
	console.log(foundOtherData)
	


}

var table = document.getElementById("tbl_other");

var idx;

for(idx=0;idx<foundOtherData.length;idx++){
	var data = foundOtherData[idx]


    var table = document.getElementById("tbl_other");
  	
	// Create an empty <tr> element and add it to the 1st position of the table:
	var row = table.insertRow(-1);
	var curr_row = table.rows.length-1




	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);


	var t1=document.createElement("textarea");

	t1.style.width ="500px";
	t1.style.height ="20px";
	t1.innerHTML = data["description"]


    cell1.appendChild(t1);

	var t2=document.createElement("input");
	t2.style.width ="200px";
	t2.className="right-text";
	t2.placeholder = data["cost"]
	t2.setAttribute('id',String(curr_row)+"_1");
	t2.setAttribute('onfocusout',"styleInput(this)");
    cell2.appendChild(t2);
   

}
function destroyWindow (){
   let localWindow = electron.remote.getCurrentWindow(); 
   localWindow.destroy();
}


function styleInput(ele){
	var table = document.getElementById("tbl_other");
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
document.getElementById("add_other_row").addEventListener("click", () => {
	
  	
    var table = document.getElementById("tbl_other");
  	
	// Create an empty <tr> element and add it to the 1st position of the table:
	var row = table.insertRow(-1);
	var curr_row = table.rows.length-1




	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);


	var t1=document.createElement("textarea");

	t1.style.width ="500px";
	t1.style.height ="20px";


    cell1.appendChild(t1);

	var t2=document.createElement("input");
	t2.style.width ="200px";
	t2.className="right-text";
	t2.setAttribute('id',String(curr_row)+"_1");
	t2.setAttribute('onfocusout',"styleInput(this)");
    cell2.appendChild(t2);
   

 

});

document.getElementById("remove_other_row").addEventListener("click", () => {
	
  	
    var table = document.getElementById("tbl_other");

	if(table.rows.length >1){
    		var row = table.deleteRow(-1);
    }
 

});

// button click event
document.getElementById("submit_other").addEventListener("click", () => {
	let error = document.getElementById("error");  	
	

	let jobid_part_id_array=window.process.argv.slice(-3)

  	
    var table = document.getElementById("tbl_other");
    var tbl_rows = table.rows;

    var row;
    var filled_row_count = 0;
	for (row = 1; row < tbl_rows.length; row++) {
		var objCells = tbl_rows.item(row).cells;

		var description_ = objCells[0].getElementsByTagName("textarea")[0].value;
		var cost_= objCells[1].getElementsByTagName("input")[0].value;

		if(cost_== "0"){
				error.innerHTML = "<span style='color: red; padding-left:5px;'>"+ "Please enter Cost</span>" ;
				break;

		}else{
			filled_row_count = filled_row_count+1;
		}

	}
	otherData.delete(jobid_,partid_)

	if(filled_row_count == tbl_rows.length-1){
		var row;
		for (row = 1; row < tbl_rows.length; row++) {
			var objCells = tbl_rows.item(row).cells;

			var description_ = objCells[0].getElementsByTagName("textarea")[0].value;
			//var cost_= objCells[1].getElementsByTagName("input")[0].value.split('.')[0].replace(',','');



			var numeric = objCells[1].getElementsByTagName("input")[0].value
			var cost_;

			if(numeric.split('.').length == 2){

				if(numeric.split('.')[1] != "00"){
					cost_ = numeric.split('.')[0].replace(',','') + '.' + numeric.split('.')[1];
				}else{
					 cost_ = numeric.split('.')[0].replace(',','');
				}
			}else{
				cost_ = numeric.split('.')[0].replace(',','');
			}




			if(cost_== ""){
				cost_ = objCells[1].getElementsByTagName("input")[0].placeholder.split('.')[0].replace(',','');
			}
		
			new_other_data = {"job_id":jobid_part_id_array[0],"part_id":jobid_part_id_array[1] ,"description":description_,"cost":cost_};
			otherData.addData(new_other_data);
		}
	}

	//load labourwindow

	destroyWindow();	   
	 

});