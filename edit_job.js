const fs = require("fs");
const url = require("url");
const path = require("path");

//a dialog box module from electron
const electron = require('electron');

// Also note that document does not exist in a normal node environment

const DataStore = require('./datastore');

const jobsData = new DataStore({name:'JobDetails'});
const labourData = new DataStore({name:'Labour'});
const materialData = new DataStore({name:'Materials'});
const otherData = new DataStore({name:'Other'});
const rateData = new DataStore({name:'Rates'});
const machineData = new DataStore({name:'MachineDetails'});


let jobid_part_id_array=window.process.argv.slice(-3)

var jobid_ = jobid_part_id_array[0]
var partid_ = jobid_part_id_array[1]

var allJobData = jobsData.getData()["data"];
var foundJobData;


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



if(allJobData.length!=0){
	console.log(jobid_)
	foundJobData = allJobData.filter( data => (data.job_id == jobid_) && (data.part_id == partid_)  )[0];
	console.log(foundJobData)

	document.getElementById("job_no").placeholder = jobid_
	document.getElementById("sub_job_no").placeholder = partid_

	document.getElementById("date_receive").value = foundJobData["date_receive"]
	document.getElementById("date_complete").value = foundJobData["date_complete"]

	document.getElementById("division").placeholder = foundJobData["division"]
	document.getElementById("description").textContent = foundJobData["description"]

	document.getElementById("remarks").textContent = foundJobData["remarks"]

}

function destroyWindow (){
   let localWindow = electron.remote.getCurrentWindow(); 
   localWindow.destroy();
}



document.getElementById("update_job").addEventListener("click", () => {

	var jobid_new = document.getElementById("job_no").value || document.getElementById("job_no").placeholder
	var sub_jobid_new = document.getElementById("sub_job_no").value || document.getElementById("sub_job_no").placeholder



	window.process.argv.splice(-3, 1, jobid_new)

	window.process.argv.splice(-2, 1, sub_jobid_new)



	var date_receive_new = document.getElementById("date_receive").value 
	var date_complete_new = document.getElementById("date_complete").value

	var status = "pending"

	if(date_complete_new != ""){
		status = "complete"

	}

	var division_new = document.getElementById("division").value
	if(division_new == ""){
		division_new = document.getElementById("division").placeholder

	}
	var description_new = document.getElementById("description").value

	var remarks_new = document.getElementById("remarks").value
	var change_dict = {"job_id":jobid_new, "part_id":sub_jobid_new, "date_receive":date_receive_new, "date_complete":date_complete_new,"division":division_new,"description":description_new,"remarks":remarks_new,"type":status}
	console.log(change_dict)
	jobsData.update(jobid_,partid_,change_dict)

	// change old job id to new in entries at materials store
	var change_dict = {"job_id":jobid_new, "part_id":sub_jobid_new}
	materialData.update(jobid_,partid_,change_dict)

	var change_dict = {"job_id":jobid_new, "part_id":sub_jobid_new}
	labourData.update(jobid_,partid_,change_dict)

	var change_dict = {"job_id":jobid_new, "part_id":sub_jobid_new}
	otherData.update(jobid_,partid_,change_dict)

	var change_dict = {"job_id":jobid_new}
	rateData.update(jobid_, null ,change_dict)

	alert('Successfully Updated the Job!')


	destroyWindow();	

  	
   
	//LoadNewWindowInCurrent('./edit_material.html');

	

	

	 

});