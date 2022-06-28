
const DataStore = require('./datastore');
const electron = require('electron');


const url = require("url");
const path = require("path");
const employeeData = new DataStore({name:'employeeData'});


const labourData = new DataStore({name:'Labour'});


const rateData = new DataStore({name:'Rates'});

//const names =  ["Saman","Nimal","Kamal","Pieris","Perera","Baker","Kate","Lila","Gunasena"]
var all_args = window.process.argv.slice(-3)
var section = all_args[2]

console.log(window.process.argv.slice)

const empSectionDict = {"Electrical":"E","E/GM":"Electrical","Electronic":"INTS","Vehicle":"V","V/S":"Vehicle","Fabric":"F","Pump":"P","Machine":"MC","Meter":"M"}

allEmpData = employeeData.getData()["data"];
names = []
var empSection
if(allEmpData.length!=0){
	empSection = empSectionDict[section]


	foundEmpData = allEmpData.filter(data => data.section == empSection);
	if(foundEmpData.length!=0){
		var name_found;
		for (var i = 0; i < foundEmpData.length; i++) {
			name_found=foundEmpData[i]["name"];
			names.push(name_found)


		}
	}else{
		alert('No Employee Found in this Section! Add Employees First and Update this Job Later')
	}
	
}else{
	alert('No Employee Found! Add Employees First and Update this Job Later')
}

	
for (var name in names) {
    var table = document.getElementById("tbl_labour");

	// Create an empty <tr> element and add it to the 1st position of the table:
	var row = table.insertRow(-1);
	// 2 rows for headers
	var cur_row=table.rows.length-3;

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);

	var t1=document.createElement("label");
	t1.style.width ="200px";
	t1.className = "left_prop";
	t1.innerHTML = names[name]
    cell1.appendChild(t1);

	var t2=document.createElement("input");
	t2.style.width ="200px";
	t2.placeholder="0";
	t2.setAttribute('id',String(cur_row)+"_1");
	t2.setAttribute('onfocusout','checkKey(this)'); 	   
    t2.className="right-text";
    cell2.appendChild(t2);

  	var t3=document.createElement("label");
  	t3.setAttribute('id',String(cur_row)+"_2");
 	t3.style.width ="200px";
 	t3.className="right-text";
    cell3.appendChild(t3);

    var t4=document.createElement("input");
   	t4.setAttribute('id',String(cur_row)+"_3");
	t4.setAttribute('onfocusout','checkKey(this)');
	t4.placeholder="0";
	t4.style.width ="200px";
	t4.className="right-text";
    cell4.appendChild(t4);
    


    var t5=document.createElement("label");
	t5.setAttribute('id',String(cur_row)+"_4");
	t5.style.width ="200px";
	t5.className="right-text";
    cell5.appendChild(t5);



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
function destroyWindow (){
   let localWindow = electron.remote.getCurrentWindow(); 
   localWindow.destroy();
}



function checkKey(ele){
	var table = document.getElementById("tbl_labour");
	var row = ele.id.split("_")[0];
	var cell = ele.id.split("_")[1];
	var value_entered=parseFloat(ele.value);

	var value_entered = parseFloat(ele.value.split('.')[0].replace(',',''))



	var val;



	if(cell==1){
		var lbl = document.getElementById(row+"_2");

		var norm_rate = parseFloat(document.getElementById("normal_hourly_rate").value);
		if(isNaN(norm_rate)){
			norm_rate = parseFloat(document.getElementById("normal_hourly_rate").getAttribute("placeholder"));
		} 
		val = value_entered*norm_rate;
		console.log(val.toFixed(2))
		if(!isNaN(val)){
			lbl.innerHTML =val.toLocaleString()+".00"
		}

		
	}else if(cell==3){
		var lbl = document.getElementById(row+"_4");
		var ot_rate = parseFloat(document.getElementById("ot_hourly_rate").value);
		if(isNaN(ot_rate)){
			ot_rate = parseFloat(document.getElementById("ot_hourly_rate").getAttribute("placeholder"));
		} 
		val = value_entered*ot_rate;
		if(!isNaN(val)){
			lbl.innerHTML = val.toLocaleString()+".00"
		}

	}
}

document.getElementById("submit_labour").addEventListener("click", () => {
	
	let jobid_part_id_array=window.process.argv.slice(-3)

  	
    var table = document.getElementById("tbl_labour");
    var tbl_rows = table.rows;

  

	var row;
	var dataRowIds = []
	for (row = 2; row < tbl_rows.length; row++) {
		var objCells = tbl_rows.item(row).cells;

		var emp_name_ = names[row-2];
		var normal_hrs_ = objCells[1].getElementsByTagName("input")[0].value;
		var normal_cost_ = objCells[2].getElementsByTagName("label")[0].innerHTML;
		var ot_hrs_ = objCells[3].getElementsByTagName("input")[0].value;
		var ot_cost_ = objCells[4].getElementsByTagName("label")[0].innerHTML;
		

		if(normal_hrs_!= "" || ot_hrs_ != ""){
			console.log(ot_hrs_)
			dataRowIds.push(row)
		}


	}
	for (idx = 0; idx < dataRowIds.length; idx++) {
		var row = dataRowIds[idx];
		var objCells = tbl_rows.item(row).cells;

		var emp_name_ = names[row-2];
		var normal_hrs_ = objCells[1].getElementsByTagName("input")[0].value;
		var normal_cost_ = objCells[2].getElementsByTagName("label")[0].innerHTML.split('.')[0].replace(',','');
		var ot_hrs_ = objCells[3].getElementsByTagName("input")[0].value;
		var ot_cost_ = objCells[4].getElementsByTagName("label")[0].innerHTML.split('.')[0].replace(',','');

		if (ot_hrs_ == ""){
			ot_hrs_=0
			ot_cost_ = 0
		}
		if (normal_hrs_ == ""){
			normal_hrs_=0
			normal_cost_=0
		}

		new_labour_data = {"job_id":jobid_part_id_array[0],"part_id":jobid_part_id_array[1] ,"emp_name":emp_name_,"normal_hrs":normal_hrs_,"normal_cost":normal_cost_,"ot_hrs":ot_hrs_, "ot_cost":ot_cost_};
		
		labourData.addData(new_labour_data);

	}




	var normal;
	var ot;
	if(document.getElementById("normal_hourly_rate").value == ""){
		normal = document.getElementById("normal_hourly_rate").placeholder.split('.')[0].replace(',','');
	}

	if(document.getElementById("ot_hourly_rate").value == ""){
		ot = document.getElementById("ot_hourly_rate").placeholder.split('.')[0].replace(',','');
	}
	
	var data = {"job_id":jobid_part_id_array[0],"normal_rate":normal,"ot_rate":ot }

	rateData.addData(data);


	LoadNewWindowInCurrent('./other_cost.html');

	 

});