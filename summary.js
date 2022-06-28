const DataStore = require('./datastore');
const electron = require('electron');
const path = require('path');
const fs = require('fs');
const url = require("url");


const jobsData = new DataStore({name:'JobDetails'});
const labourData = new DataStore({name:'Labour'});
const materialData = new DataStore({name:'Materials'});
const otherData = new DataStore({name:'Other'});
const rateData = new DataStore({name:'Rates'});
const machineData = new DataStore({name:'MachineDetails'});

let jobid_part_ids_array=window.process.argv.slice(-3);
console.log(jobid_part_ids_array)

let jobid_ = jobid_part_ids_array[0];
let parts =  jobid_part_ids_array[1];
let section =  jobid_part_ids_array[2];


var section_lbl = document.getElementById("section");
if (section_lbl == "E/GM"){
	section_lbl.innerHTML = "Electrical Section"
} else if (section_lbl == "V/S"){
	section_lbl.innerHTML = "Vehicle Section"

} else{
	section_lbl.innerHTML = section + " Section"
}

let partids_ = parts.split(","); ;


const db_elements_jobs = {0:"date_receive",1:"date_complete", 2:"part_id",3:"division",4:"description",5:"remarks"};

const db_elements_material = {1:"MIN_No",2:"Cost",3:"Bill_No",4:"Cash"};
const db_elements_labour = {0:"emp_name",2:"normal_hrs",3:"ot_hrs",4:"normal_cost",5:"ot_cost"};

function destroyWindow (){
   let localWindow = electron.remote.getCurrentWindow(); 
   localWindow.destroy();
}
let add_oh_cost = false;

function add_oh(){
	
	add_oh_cost = true;
	alert("Added Overhead Cost. Click Confirm to get Total!")
}

function confirm(){
	var zero = 0;

	var summary_material_cost = document.getElementById("summary_material_cost");
	var summary_material_cost_val;

	if(summary_material_cost.innerHTML == ""){
		summary_material_cost_val = zero;
	}else{



		var numeric = summary_material_cost.innerHTML


		if(numeric.split('.')[1] != "00"){
			numeric = numeric.split('.')[0].replace(',','') + '.' + numeric.split('.')[1];
		}else{
			numeric = numeric.split('.')[0].replace(',','');
		}
	
		summary_material_cost_val = parseFloat(numeric)
	}
	console.log(summary_material_cost_val)



	var summary_labour_cost = document.getElementById("summary_labour_cost");
	var summary_labour_cost_val;
	if(summary_labour_cost.innerHTML == ""){
		summary_labour_cost_val = zero;
	}else{
		var numeric = summary_labour_cost.innerHTML


		if(numeric.split('.')[1] != "00"){
			numeric = numeric.split('.')[0].replace(',','') + '.' + numeric.split('.')[1];
		}else{
			numeric = numeric.split('.')[0].replace(',','');
		}
	
		summary_labour_cost_val = parseFloat(numeric)

	}
	console.log(summary_labour_cost_val)



	var summary_machine_cost = document.getElementById("summary_machine_cost");
	var machine_cost_td = document.getElementById("machine_cost_td");
	machine_cost_td.removeChild(summary_machine_cost)
	var lbl = document.createElement('label')

	var summary_machine_cost_val;


	if(summary_machine_cost.value == ""){
		summary_machine_cost_val = zero;
	
		lbl.innerHTML = zero.toString()+".00"
	}else{
		var numeric = summary_machine_cost.value

		if(numeric.includes('.')){
			if(numeric.split('.')[1] != "00"){
				numeric = numeric.split('.')[0].replace(',','') + '.' + numeric.split('.')[1];
			}else{
				numeric = numeric.split('.')[0].replace(',','');
			}

		}else{
			numeric = numeric.replace(',','');
		}
		
	
		summary_machine_cost_val = parseFloat(numeric)

		var data = {"job_id": jobid_,"cost":numeric}
		machineData.addData(data);


		var trail = numeric;
		if(trail.includes('.')){
			var before_decimal = trail.split('.')[0]
			trail = '.'+trail.split('.')[1]
			if (trail.length ==2){
				trail=trail + "0"

			}
		}else{
			var before_decimal = trail
			trail = ".00"
		}

		lbl.innerHTML = parseFloat(before_decimal).toLocaleString()+trail

	}
	console.log(summary_machine_cost)
	machine_cost_td.appendChild(lbl);



	var summary_other_cost = document.getElementById("summary_other_cost");
	var summary_other_cost_val;

	if(summary_other_cost.innerHTML == ""){
		summary_other_cost_val = zero.toString()+".00";
	}else{
		var numeric = summary_other_cost.innerHTML
		if(numeric.split('.')[1] != "00"){
			numeric = numeric.split('.')[0].replace(',','') + '.' + numeric.split('.')[1];
		}else{
			numeric = numeric.split('.')[0].replace(',','');
		}


		summary_other_cost_val = parseFloat(numeric)
	}


	console.log(summary_other_cost)

	var direct_cost = document.getElementById("direct_cost");
	var direct_cost_sum = summary_material_cost_val + summary_labour_cost_val+summary_machine_cost_val+summary_other_cost_val


	var trail = direct_cost_sum.toString();
	if(trail.includes('.')){
		var before_decimal = trail.split('.')[0]
		trail = '.'+trail.split('.')[1]
		if (trail.length ==2){
				trail=trail + "0"

		}
	}else{
		var before_decimal = trail
		trail = ".00"
	}

	console.log(direct_cost_sum)



	direct_cost.innerHTML = parseFloat(before_decimal).toLocaleString()+trail;




	var summary_overhead_cost = document.getElementById("summary_overhead_cost");
	if(add_oh_cost){
		var oh_cost = eval(direct_cost_sum*0.1).toFixed(2);		
	}else{
		var oh_cost = zero.toFixed(2);

	}
	
	
	var trail = oh_cost.toString();
	if(trail.includes('.')){
		var before_decimal = trail.split('.')[0]
		trail = '.'+trail.split('.')[1]
		if (trail.length ==2){
				trail=trail + "0"

		}

	}else{

		var before_decimal = trail
		trail = ".00"
	}

	summary_overhead_cost.innerHTML = parseFloat(before_decimal).toLocaleString()+trail;


	var summary_total_cost = document.getElementById("summary_total_cost");
	var tot_cost = direct_cost_sum + parseFloat(oh_cost)
	console.log(typeof tot_cost)
	console.log(typeof direct_cost_sum)

	console.log(typeof oh_cost)


	var trail = tot_cost.toString();
	if(trail.includes('.')){
		var before_decimal = trail.split('.')[0]
		trail = '.'+trail.split('.')[1]
		if (trail.length ==2){
				trail=trail + "0"

		}
	}else{
		var before_decimal = trail
		trail = ".00"
	}



	summary_total_cost.innerHTML = parseFloat(before_decimal).toLocaleString()+trail;




	

}






function createMaterialSummaryTable(foundMaterialData,foundJobData){


	var table = document.getElementById('material_cost_tbl');
	//var min_nos={}


	for (var i = 0; i < 9; i++) {
		var tr = document.createElement('TR');
		table.appendChild(tr);
		for (var j = 0; j < 10; j++) {
			var td = document.createElement('TD');
			td.style.height="22px";
			td.style.border = "1px solid black"

			tr.appendChild(td);
		}


	}



	var cost_total_skip0 =0;
	var cost_total_skip1 =0;
	var cost_total_skip2 =0;

	var cash_total_skip0 =0;
	var cash_total_skip1 =0;
	var cash_total_skip2 =0;

	for (var i = 0; i < foundMaterialData.length; i++) {
		var remainder = parseFloat(i/9);
		var skip;
		if(remainder ==0){
			skip =0;
		}else if(remainder == 1){
			skip=5;
		}

		var row=foundMaterialData[i];
		var min_no = row["MIN_No"]
		

			
			//min_nos[min_no]=[i+1,skip];
			

		var tr = table.rows.item((i%9)+1);
		

		var part = row['part_id']
		var date = ""
		//var date = foundJobData.filter(data => data.part_id==part)[0]['date_receive']


		var td =tr.cells[skip];
		td.style.textAlign = "left";

		td.appendChild(document.createTextNode(date));


		


		for (var j = 1; j < 5; j++) {
		  var td = tr.cells[j+skip];
		  if (j==1){
		  	td.style.textAlign = "left";
		  	td.appendChild(document.createTextNode( row[db_elements_material[j]]));

		  }else if(j==3){
		  	td.style.textAlign = "left";
		  	td.appendChild(document.createTextNode( row[db_elements_material[j]]));

		  }else{
		  	td.style.textAlign = "right";
		  	if(skip==0){
		  		if (j==2){
		  			cost_total_skip0 += parseFloat(row[db_elements_material[j]])
		  		}else if (j==4){
		  			cash_total_skip0 += parseFloat(row[db_elements_material[j]])
		  		}		  		

		  	}else if(skip==5){
		  		if (j==2){
		  			cost_total_skip1 += parseFloat(row[db_elements_material[j]])
		  		}else if (j==4){
		  			cash_total_skip1 += parseFloat(row[db_elements_material[j]])
		  		}		  		

		  	}

		  	var trail = row[db_elements_material[j]];

			if(trail.includes('.')){
				var before_decimal = trail.split('.')[0]

				trail = '.'+trail.split('.')[1]
				if (trail.length ==2){
					trail=trail + "0"

				}
				
			}else{
				var before_decimal = trail
				trail = ".00"
				
			}
			td.appendChild(document.createTextNode( parseFloat(before_decimal).toLocaleString()+trail));
		  	

		}



		  

		
		}
		




	}
	

	var tr = document.createElement('TR');
	table.appendChild(tr);

	var th5 = document.createElement('TH');
	th5.style.border = "1px solid black"
	th5.appendChild(document.createTextNode("Total"));
	th5.colSpan="2";
	tr.appendChild(th5);

	var th6 = document.createElement('TH');
	th6.style.border = "1px solid black"

	var trail = cost_total_skip0.toString();
	if(trail.includes('.')){
		var before_decimal = trail.split('.')[0]
		trail = '.'+trail.split('.')[1]

		if (trail.length =2){
			trail=trail + "0"

		}

	}else{
		var before_decimal = trail
		trail = ".00"
	}

	th6.appendChild(document.createTextNode( parseFloat(before_decimal).toLocaleString() + trail) );

	th6.style.textAlign = "right";
	tr.appendChild(th6);






	var th16 = document.createElement('TH');
	th16.style.border = "1px solid black"

	var trail = cash_total_skip0.toString();
	if(trail.includes('.')){
		var before_decimal = trail.split('.')[0]
		trail = '.'+trail.split('.')[1]

		if (trail.length =2){
			trail=trail + "0"

		}

	}else{
		var before_decimal = trail
		trail = ".00"
	}

	th16.appendChild(document.createTextNode( parseFloat(before_decimal).toLocaleString() + trail) );
	th16.colSpan="2";
	th16.style.textAlign = "right";
	tr.appendChild(th16);








	var th10 = document.createElement('TH');
	th10.style.border = "1px solid black"
	th10.appendChild(document.createTextNode("Total"));
	th10.colSpan="2";
	tr.appendChild(th10);


	var th8 = document.createElement('TH');
	th8.style.border = "1px solid black"

	var trail = cost_total_skip1.toString();
	if(trail.includes('.')){
		var before_decimal = trail.split('.')[0]
		trail = '.'+trail.split('.')[1]
		if (trail.length ==2){
			trail=trail + "0"

		}
	}else{
		var before_decimal = trail
		trail = ".00"
	}

	th8.appendChild(document.createTextNode( parseFloat(before_decimal).toLocaleString() + trail));
	th8.style.textAlign = "right";
	tr.appendChild(th8);


	var th26 = document.createElement('TH');
	th26.style.border = "1px solid black"

	var trail = cash_total_skip1.toString();
	if(trail.includes('.')){
		var before_decimal = trail.split('.')[0]
		trail = '.'+trail.split('.')[1]

		if (trail.length =2){
			trail=trail + "0"

		}

	}else{
		var before_decimal = trail
		trail = ".00"
	}

	th26.appendChild(document.createTextNode( parseFloat(before_decimal).toLocaleString() + trail) );
	th26.colSpan="2";
	th26.style.textAlign = "right";
	tr.appendChild(th26);


	/*

	var th11 = document.createElement('TH');
	th11.style.border = "1px solid black"
	th11.appendChild(document.createTextNode("Total"));
	th11.colSpan="2";
	tr.appendChild(th11);

	var th9 = document.createElement('TH');
	th9.style.border = "1px solid black"

	var trail = cost_total_skip2.toString();
	if(trail.includes('.')){
		var before_decimal = trail.split('.')[0]
		trail = '.'+trail.split('.')[1]
		if (trail.length ==2){
			trail=trail + "0"

		}
	}else{
		var before_decimal = trail
		trail = ".00"
	}

	th9.appendChild(document.createTextNode(before_decimal.toLocaleString() + trail));
	th9.style.textAlign = "right";
	tr.appendChild(th9);

	*/

	var summary_material_cost = document.getElementById("summary_material_cost");
	var mat_sum_cost = cost_total_skip0+cost_total_skip1+cost_total_skip2 + cash_total_skip0+cash_total_skip1+cash_total_skip2
	
		
	var trail = mat_sum_cost.toString();
	if(trail.includes('.')){
		var before_decimal = trail.split('.')[0]
		trail = '.'+trail.split('.')[1]
		if (trail.length ==2){
			trail=trail + "0"

		}
	}else{
		var before_decimal = trail
		trail = ".00"
	}

	summary_material_cost.innerHTML = parseFloat(before_decimal).toLocaleString()+trail;


	
}


function createLabourSummaryTable(foundLabourData,foundJobData){

	var table = document.getElementById("labour_cost_tbl");
	var emp_names={}





	var normal_hrs_total=0.0;
	var normal_cost_total= 0.0;
	var ot_hrs_total=0.0;
	var ot_cost_total= 0.0;
	// {0:"emp_name",1:"normal_hrs",2:"ot_hrs",3:"normal_cost",4:"ot_cost"};

	for (var i = 0; i < foundLabourData.length; i++) {
		var tr = document.createElement('TR');
		table.appendChild(tr);
		var row=foundLabourData[i];

		var emp_name = row["emp_name"]

		if(!Object.keys(emp_names).includes(emp_name)){

			emp_names[emp_name]=[i+1];

			var part = row['part_id']
			var date = ""
			//var date = foundJobData.filter(data => data.part_id==part)[0]['date_receive']

			for (var j = 0; j < 6; j++) {
			  var td = document.createElement('TD');
			  td.style.border = "1px solid black"
			
			  if (j==0){
			  	td.style.textAlign = "left";
			  	td.appendChild(document.createTextNode(row[db_elements_labour[j]]));
			  }else if(j==1){
			  	td.style.textAlign = "left";
				td.appendChild(document.createTextNode(date));

			  } else if (j==2){
			  	td.style.textAlign = "center";
			  	var val = row[db_elements_labour[j]]
			  	
			  	if( !isNaN(parseFloat(val))){
			  		normal_hrs_total+= parseFloat(val)
			  	}
			  	td.appendChild(document.createTextNode(val));

			  }else if(j==3){
			  	td.style.textAlign = "center";
			  	var val = row[db_elements_labour[j]]
			  	
			  	if( !isNaN(parseFloat(val))){
			  		ot_hrs_total+= parseFloat(val)
			  	}
			  	td.appendChild(document.createTextNode(val));

			  }else if(j==4){
			  	td.style.textAlign = "right";
			  	var val = row[db_elements_labour[j]]
			  	
			  	if( !isNaN(parseFloat(val))){
			  		normal_cost_total+= parseFloat(val)
			  	}

			  	var trail = val
				if(trail.includes('.')){
					var before_decimal = trail.split('.')[0]
					trail = '.'+trail.split('.')[1]
					if (trail.length ==2){
						trail=trail + "0"

					}
				}else{
					var before_decimal = trail
					trail = ".00"
				}
			  	td.appendChild(document.createTextNode(parseFloat(before_decimal).toLocaleString() + trail));

			  }else if(j==5){
			  	td.style.textAlign = "right";
			  	var val = row[db_elements_labour[j]]
			  	
			  	if( !isNaN(parseFloat(val))){
			  		ot_cost_total+= parseFloat(val)
			  	}

			  	var trail = val
				if(trail.includes('.')){
					var before_decimal = trail.split('.')[0]
					trail = '.'+trail.split('.')[1]
					if (trail.length ==2){
						trail=trail + "0"

					}
				}else{
					var before_decimal = trail
					trail = ".00"
				}

			  	td.appendChild(document.createTextNode(parseFloat(before_decimal).toLocaleString()+trail));

			  }
			  
			  tr.appendChild(td);
			}
		}else{
			//const db_elements_labour = {0:"emp_name",2:"normal_hrs",3:"ot_hrs",4:"normal_cost",5:"ot_cost"};

			var rowToUpdate = emp_names[emp_name];

			var updateCellnormalhrs=table.rows.item(rowToUpdate).cells[2];
			var updateCellothrs=table.rows.item(rowToUpdate).cells[3];
			var updateCellnormalcost=table.rows.item(rowToUpdate).cells[4];
			var updateCellotcost = table.rows.item(rowToUpdate).cells[5];

			normal_hrs_total += parseFloat(row["normal_hrs"])
			ot_hrs_total += parseFloat(row["ot_hrs"])
			normal_cost_total +=  parseFloat(row["normal_cost"])
			ot_cost_total += parseFloat(row["ot_cost"])




			var update = parseFloat(updateCellnormalhrs.innerHTML)+parseFloat(row["normal_hrs"])
			updateCellnormalhrs.innerHTML = update

			var update = parseFloat(updateCellothrs.innerHTML)+parseFloat(row["ot_hrs"])
			updateCellothrs.innerHTML = update

			var update = parseFloat(updateCellnormalcost.innerHTML)+parseFloat(row["normal_cost"])

			var trail = update.toString()
			if(trail.includes('.')){
				var before_decimal = trail.split('.')[0]
				trail = '.'+trail.split('.')[1]
				if (trail.length ==2){
					trail=trail + "0"

				}

			}else{
				var before_decimal = trail
				trail = ".00"
			}

			updateCellnormalcost.innerHTML = parseFloat(before_decimal).toLocaleString()+trail

			var update = parseFloat(updateCellotcost.innerHTML)+parseFloat(row["ot_cost"])
			var trail = update.toString()
			if(trail.includes('.')){
				var before_decimal = trail.split('.')[0]		

				trail = '.'+trail.split('.')[1]
				if (trail.length ==2){
					trail=trail + "0"

				}

			}else{
				var before_decimal = trail
				trail = ".00"
			}

			updateCellotcost.innerHTML = parseFloat(before_decimal).toLocaleString()+trail

		
		}
	}



	
	var tr_last = document.createElement('TR');
	table.appendChild(tr_last);

	var th7 = document.createElement('TH');
	th7.style.border = "1px solid black"
	th7.appendChild(document.createTextNode("Total"));
	th7.colSpan="2";
	tr_last.appendChild(th7);

	var th8 = document.createElement('TH');
	th8.style.border = "1px solid black"
	th8.style.textAlign = "center";
	th8.appendChild(document.createTextNode(String(normal_hrs_total)));
	tr_last.appendChild(th8);

	var th9 = document.createElement('TH');
	th9.style.border = "1px solid black"
	th9.style.textAlign = "center";
	th9.appendChild(document.createTextNode(ot_hrs_total));
	tr_last.appendChild(th9);

	var th10 = document.createElement('TH');
	th10.style.border = "1px solid black"

	var trail = normal_cost_total.toString()
	if(trail.includes('.')){
		var before_decimal = trail.split('.')[0]
		trail = '.'+trail.split('.')[1]
		if (trail.length ==2){
			trail=trail + "0"

		}

	}else{
		var before_decimal = trail
		trail = ".00"
	}


	th10.appendChild(document.createTextNode( parseFloat(before_decimal).toLocaleString()+trail ));
	th10.style.textAlign = "right";
	tr_last.appendChild(th10);

	var th11 = document.createElement('TH');
	th11.style.border = "1px solid black"

	var trail = ot_cost_total.toString()
	if(trail.includes('.')){
		var before_decimal = trail.split('.')[0]
		trail = '.'+trail.split('.')[1]
		if (trail.length ==2){
			trail=trail + "0"

		}
	}else{
		var before_decimal = trail
		trail = ".00"
	}

	th11.appendChild(document.createTextNode( parseFloat(before_decimal).toLocaleString() +trail));
	th11.style.textAlign = "right";
	tr_last.appendChild(th11);

	
	

	summary_labour_cost = document.getElementById("summary_labour_cost");
	var labour_cost_sum = normal_cost_total+ot_cost_total

	var trail = labour_cost_sum.toString();
	if(trail.includes('.')){
		var before_decimal = trail.split('.')[0]
		trail = '.'+trail.split('.')[1]
		if (trail.length ==2){
			trail=trail + "0"

		}
	}else{
		var before_decimal = trail
		trail = ".00"
	}


	summary_labour_cost.innerHTML = parseFloat(before_decimal).toLocaleString()+trail;

	/*

	var total_cost = normal_cost_total+ot_cost_total+parseFloat(summary_material_cost);
	var overhead = total_cost*0.1;

	summary_overhead_cost = document.getElementById("summary_overhead_cost");
	summary_overhead_cost.innerHTML = overhead;
	//summary_material_cost.setAttribute("value",cost_total);
	*/
	
}



function fillTopData(job){
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	today = yyyy + '/' + mm + '/' + dd;
	
	document.getElementById('today_date').placeholder = today;
	job_num_lbl = document.getElementById('job_no');
	job_num_lbl.innerHTML = jobid_;

	sub_job_num_lbl = document.getElementById('sub_job_no');

	sub_job_num_lbl.innerHTML = parts;

	var division = document.getElementById('division');
	division.innerHTML = job["division"]



}
function fillDescriptionTable(foundJobData){
	var tbl = document.getElementById('tbl_jobs');

	for (var i = 0; i < foundJobData.length; i++) {
		var tr = document.createElement('TR');
		tbl.appendChild(tr);
		row=foundJobData[i];

		for (var j = 0; j < 6; j++) {
		  var td = document.createElement('TD');
		  if (j==2 ){
		  	td.style.textAlign = "right";


		  }else{
		  	td.style.textAlign = "left";

		  }
		  td.appendChild(document.createTextNode(row[db_elements_jobs[j]]));
		  tr.appendChild(td);
		}
	}
}

var allJobData = jobsData.getData()["data"];
var foundJobData;

if(allJobData.length!=0){
	console.log(jobid_)
	foundJobData = allJobData.filter( data => (data.job_id == jobid_) && ( partids_.includes(data.part_id)) );
	

	fillTopData(foundJobData[0]);
	fillDescriptionTable(foundJobData)

}



allMaterialData = materialData.getData()["data"];
if(allMaterialData.length!=0){

	foundMaterialData = allMaterialData.filter( data => (data.job_id == jobid_) && (partids_.includes(data.part_id)));
	console.log(foundMaterialData)
	createMaterialSummaryTable(foundMaterialData,foundJobData);


}


allLabourData = labourData.getData()["data"];
if(allLabourData.length!=0){
	foundLabourData = allLabourData.filter(data => (data.job_id == jobid_) && (partids_.includes(data.part_id)));
	createLabourSummaryTable(foundLabourData,foundJobData);


}


rates = rateData.getData()["data"];
if(rates.length!=0){
	console.log(rates)
	foundRate = rates.filter((data => data.job_id == jobid_));
	var tbl = document.getElementById('labour_rate_tbl');

	var tr = tbl.rows.item(1)

	row=foundRate[0];

	
	var td =  tr.cells[0];;
	td.style.textAlign = "right";

	var trail = row["normal_rate"];
	if(trail.includes('.')){
		var before_decimal = trail.split('.')[0]
		trail = '.'+trail.split('.')[1]
		if (trail.length ==2){
			trail=trail + "0"

		}

	}else{
		var before_decimal = trail
		trail = ".00"
	}

	td.appendChild(document.createTextNode( parseFloat(before_decimal).toLocaleString()+trail ));

	var td =  tr.cells[1];;
	td.style.textAlign = "right";

	var trail = row["ot_rate"];
	if(trail.includes('.')){
		var before_decimal = trail.split('.')[0]
		trail = '.'+trail.split('.')[1]
		if (trail.length ==2){
			trail=trail + "0"

		}

	}else{
		var before_decimal = trail
		trail = ".00"
	}
	td.appendChild(document.createTextNode(parseFloat(before_decimal).toLocaleString() +trail));




}

allOtherData = otherData.getData()["data"];
var summary_other_cost = document.getElementById("summary_other_cost");

if(allOtherData.length!=0){
	foundOtherData = allOtherData.filter(data =>( data.job_id == jobid_) && (partids_.includes(data.part_id)));
	
	var other_total=0.0;

	for (var i = 0; i < foundOtherData.length; i++) {
		row=foundOtherData[i];
		other_total+=parseFloat(row["cost"]);
	}

	
	var trail = other_total.toString();
	if(trail.includes('.')){
		var before_decimal = trail.split('.')[0]
		trail = '.'+trail.split('.')[1]
		if (trail.length ==2){
			trail=trail + "0"

		}

	}else{
		var before_decimal = trail
		trail = ".00"
	}

	summary_other_cost.innerHTML = parseFloat(before_decimal).toLocaleString()+trail;

}else{
	summary_other_cost.innerHTML = "0.00";

}




function removeEle(){
	if(!fs.existsSync(path.join(__dirname,'..','..','pdf'))){
		fs.mkdirSync(path.join(__dirname,'..','..','pdf'))
	}
	summaryele = document.getElementById("all_summary")
	confirmele = document.getElementById("btn_confirm")
	summaryele.removeChild(confirmele)

	ohele = document.getElementById("btn_oh_confirm")
	summaryele.removeChild(ohele)


	print_container=document.getElementById("print_container")
	console.log(print_container)
	printele = document.getElementById("print")
	console.log(printele)
	print_container.removeChild(printele)



	const BrowserWindow = electron.remote.BrowserWindow;
	var job_parts_array=jobid_.split("/")
	var fname = "job_"+ job_parts_array[0]+ "_"+  job_parts_array[1]+ "_"+ job_parts_array[2]+".pdf";
	var filepath1 = path.join(__dirname,'..','..','pdf',fname);  	
	console.log(filepath1);
	var options = {
		marginsType:0,
		pageSize:'A4',
		printBackground:true,
		printSelectionOnly:false,
		landscape:false
	}

	let win = BrowserWindow.getFocusedWindow();
	

	win.webContents.printToPDF(options,(error,data) => {

		if (error) throw error

		fs.writeFile(filepath1,data,(error) => {
			if (error){
				console.log(error);

			}else{
				alert('Successfully generated pdf!')
			}

		});

	
	});
	//win.webContents.destroy()
	

}


document.getElementById("print").addEventListener("click", () => {
	removeEle()
 
});