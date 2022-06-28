const fs = require("fs");
const url = require("url");
const path = require("path");
//a dialog box module from electron
const { dialog } = require("electron").remote;
// Also note that document does not exist in a normal node environment

const DataStore = require('./datastore');

const jobsData = new DataStore({name:'JobDetails'});
const labourData = new DataStore({name:'Labour'});
const materialData = new DataStore({name:'Materials'});
const otherData = new DataStore({name:'Other'});
const rateData = new DataStore({name:'Rates'});
const machineData = new DataStore({name:'MachineDetails'});
var resultJobs;

const section_dict = {"Electrical":"E","E/GM":"E/GM","Electronic":"INTS","Vehicle":"V","V/S":"V/S","Fabric":"F","Pump":"P","Machine":"MC","Meter":"M"}

function changeSection(){
	var section =  document.getElementById("section").value;
	let job_id_type = document.getElementById("job_id_type");
	let search_job_id_type = document.getElementById("search_job_id_type");

	job_id_type.innerHTML =section_dict[section];
	search_job_id_type.innerHTML = section_dict[section] ;

}
function createBrowserWindow(jobid_) {
	const remote = require("electron").remote;
	var section =  document.getElementById("section").value;

	let partid_ = document.getElementById("part_id").value;
	console.log(partid_)

	if(partid_==""){
		partid_ = "*"
	}


    // Create the browser window.
    let win = new remote.BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            additionalArguments: [jobid_, partid_,section ]
        }
    });
    win.maximize()
    // and load the index.html of the app.,
    
    win.loadURL(url.format({
        pathname: path.join(__dirname, "material_cost.html"),
        protocol: "file:",
        slashes: true,
    }));
    //win.loadFile("material_cost.html");
}

function editJob(btn){

	const remote = require("electron").remote;
	let section =  document.getElementById("section").value;



	var rowid = btn.id.split('_')[1];
	var tbl = document.getElementById("output_table_results");
	var row = tbl.rows[parseInt(rowid)+1]
	var jobid_ = row.cells[1].textContent;
	var partid_ = row.cells[2].textContent;

	



    // Create the browser window.
    let win = new remote.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            additionalArguments: [jobid_,partid_,section]
        }

    });
    win.maximize();
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, "edit_job.html"),
        protocol: "file:",
        slashes: true,
    }));



}

function addDetails(btn){

	const remote = require("electron").remote;
	let section =  document.getElementById("section").value;



	var rowid = btn.id.split('_')[1];
	var tbl = document.getElementById("output_table_results");
	var row = tbl.rows[parseInt(rowid)+1]
	var jobid_ = row.cells[1].textContent;
	var partid_ = row.cells[2].textContent;

	



    // Create the browser window.
    let win = new remote.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            additionalArguments: [jobid_,partid_,section]
        }

    });
    win.maximize();
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, "edit_material.html"),
        protocol: "file:",
        slashes: true,
    }));



}

function deleteJob(btn){

	if (confirm("Are you sure you want to delete the Job?")) {
	  
		const remote = require("electron").remote;
		let section =  document.getElementById("section").value;


		var rowid = btn.id.split('_')[1];
		var tbl = document.getElementById("output_table_results");
		var row = tbl.rows[parseInt(rowid)+1]
		var jobid_ = row.cells[1].textContent;
		var partid_ = row.cells[2].textContent;

		jobsData.delete(jobid_,partid_)
		materialData.delete(jobid_,partid_)
		labourData.delete(jobid_,partid_)
		otherData.delete(jobid_,partid_)
		alert('Successfully Deleted the Job!')
	} 

}


function changeJobStatus(btn){
	console.log(btn)
	var rowid = btn.id.split('_')[1];
	var tbl = document.getElementById("output_table_results");
	var row = tbl.rows[parseInt(rowid)+1]
	var jobid_of_change = row.cells[1].textContent;
	var partid_of_change = row.cells[2].textContent;

	var imgsource = document.getElementById("img_"+rowid);
	var status = imgsource.getAttribute('alt');
	console.log(status)
	console.log(btn.value)

	
	if(status == 'pending'){

		if(btn.value != ""){
			//jobsData.updateJobStatus(jobid_of_change,partid_of_change,'complete')
			jobsData.update(jobid_of_change,partid_of_change,{"date_complete":btn.value,"type":"complete"})

			imgsource.setAttribute("alt", "complete");
			imgsource.setAttribute("src", path.join(__dirname, 'complete.png'));


		}

		


	}else{
		if(btn.value == ""){

			//jobsData.updateJobStatus(jobid_of_change,partid_of_change,'pending')
			jobsData.update(jobid_of_change,partid_of_change,{"date_complete":btn.value,"type":"pending"})
							
			imgsource.setAttribute("alt", "pending");
			imgsource.setAttribute("src", path.join(__dirname, 'pending.png'));

		}

	}



	
}



function createPrintWindow(selected_jobid,checked_parts) {
	const remote = require("electron").remote;
	let section =  document.getElementById("section").value;
    let checked = checked_parts.join(",");

    // Create the browser window.
    let win = new remote.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            additionalArguments: [selected_jobid,checked,section]
        }

    });
    win.maximize();
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, "summary.html"),
        protocol: "file:",
        slashes: true,
    }));
   // win.loadFile("summary.html");
}



function createSearchResultsTable(foundJobs) {
	resultJobs = foundJobs;
	var myTableDiv = document.getElementById("myDynamicTable");

	try {
		childNode = document.getElementById("output_table_results");
		myTableDiv.removeChild(childNode);
	}
	catch(err) {
		
	}

	
	var elements = {0:"",1:"part_id",2:"date_receive",3:"description",4:"date_complete",5:"division",6:"type",7:"",8:"job_id"};
	var widths = {0:"1%",1:"2%",2:"15%",3:"52%",4:"10%",5:"7%",6:"6%",7:"2%",8:"5%"};

	var table = document.createElement('TABLE');
	table.id="output_table_results";
	table.style.backgroundColor = "gray";
	table.style.color = "white"

	var tableBody = document.createElement('TBODY');
	table.appendChild(tableBody);

	var tr = document.createElement('TR');
	tableBody.appendChild(tr);
	/*

	var th1 = document.createElement('TH');
	th1.style.width = widths[0
	th1.appendChild(document.createTextNode(""));

	tr.appendChild(th1);
	*/

	var th2 = document.createElement('TH');
	th2.style.width = widths[1]+widths[8];;
	th2.colSpan = "2";
	th2.appendChild(document.createTextNode("Job No"));
	tr.appendChild(th2);

	var th8 = document.createElement('TH');
	th8.style.width = widths[1];
	th8.appendChild(document.createTextNode("Sub Job"));
	tr.appendChild(th8);



	var th3 = document.createElement('TH');
	th3.style.width = widths[2];
	th3.appendChild(document.createTextNode("Receive Date"));
	tr.appendChild(th3);

	var th4 = document.createElement('TH');
	th4.style.width = widths[3];
	th4.appendChild(document.createTextNode("Description"));

	tr.appendChild(th4);


	var th5 = document.createElement('TH');
	th5.style.width = widths[4];
	th5.appendChild(document.createTextNode("Complete Date"));
	tr.appendChild(th5);

	var th6 = document.createElement('TH');
	th6.style.width = widths[5];
	th6.appendChild(document.createTextNode("Division"));

	tr.appendChild(th6);


	var th7 = document.createElement('TH');
	th7.style.width = widths[6];
	th7.appendChild(document.createTextNode("Status"));
	tr.appendChild(th7);
	/*

	var th8 = document.createElement('TH');
	th8.style.width = "3%";
	th8.appendChild(document.createTextNode(""));
	tr.appendChild(th8);
	*/

	for (var i = 0; i < foundJobs.length; i++) {
		var tr = document.createElement('TR');
		tableBody.appendChild(tr);
		row=foundJobs[i];

		var td = document.createElement('TD');
		td.style.width = widths[0];
		// creating checkbox element 
		var checkbox = document.createElement('input'); 
		  
		// Assigning the attributes to created checkbox 
		checkbox.type = "checkbox"; 
		//partid
		checkbox.id = "check_"+String(row[elements[1]]); 

		td.appendChild(checkbox);
		tr.appendChild(td);


		var td = document.createElement('TD');
		td.style.width = widths[8];
		td.appendChild(document.createTextNode(row[elements[8]]));
		tr.appendChild(td);
		var child;


		for (var j = 1; j < 6; j++) {
		  var td = document.createElement('TD');
		  td.style.width = widths[j];
		  if(j==3 ){
		  	td.style.textAlign = "left";
		  	child = document.createTextNode(row[elements[j]])
		  } else if(j==4 ){
		  	//completed data
		  	if(row[elements[j]] == ""){
		  		child = document.createElement('input')
		  		child.type='date';
		  		child.id = "btn_"+i;
		  		child.setAttribute('onfocusout','changeJobStatus(this)')
		  		child.style.width= "90%"
		  	}else{
		  		child = document.createTextNode(row[elements[j]])
		  	}
		  	
		  } else{
		  	child = document.createTextNode(row[elements[j]])
		  }
		  td.appendChild(child);
		  tr.appendChild(td);
		}

		var td = document.createElement('TD');
		td.style.width = widths[6];
		// creating checkbox element 
		var img = document.createElement('img'); 
		img.id = "img_"+i; 
		var status = row[elements[6]]


		if(status == "pending"){
			img.src = path.join(__dirname, 'pending.png')
			img.setAttribute("alt", "pending");
		}else {
			img.src = path.join(__dirname, 'complete.png')
			img.setAttribute("alt", "complete");
		}

		td.appendChild(img);
		tr.appendChild(td);



		var td = document.createElement('TD');
		td.style.width = "1%";
		// creating checkbox element 
		var btn = document.createElement('button'); 
		btn.id = "btn_"+i; 
		btn.style.background = "url('edit.png')"
		btn.className = "button-small";
		
		btn.setAttribute('onclick','editJob(this)')	
		btn.setAttribute('title','Edit Job Details')

		//btn.setAttribute('onclick','changeJobStatus(this)')	
		//////////////////////////////////////////////////////////	

		td.appendChild(btn);
		tr.appendChild(td);

		var td = document.createElement('TD');
		td.style.width = "1%";
		// creating checkbox element 
		var btn = document.createElement('button'); 
		btn.id = "btn_"+i; 
		btn.className = "button-small";
		btn.style.background = "url('add-details.png')"
		
		btn.setAttribute('onclick','addDetails(this)')	
		btn.setAttribute('title','Edit Job Costs')


		//btn.setAttribute('onclick','changeJobStatus(this)')		

		td.appendChild(btn);
		tr.appendChild(td);
		///////////////////////////////////////////////////////

		td.appendChild(btn);
		tr.appendChild(td);

		var td = document.createElement('TD');
		td.style.width = "1%";
		// creating checkbox element 
		var btn = document.createElement('button'); 
		btn.id = "btn_"+i; 

		btn.className = "button-small";
		
		btn.setAttribute('onclick','deleteJob(this)')	
		btn.style.background = "url('delete.png')"
		btn.setAttribute('title','Delete Job')
		//btn.setAttribute('onclick','changeJobStatus(this)')		

		td.appendChild(btn);
		tr.appendChild(td);


	}
	

	myTableDiv.appendChild(table);



	
}




// button click event
document.getElementById("add_employee").addEventListener("click", () => {
	const remote = require("electron").remote;

	let section =  document.getElementById("section").value;

    // Create the browser window.
    let win = new remote.BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            additionalArguments: [section]
        }
    });
    win.maximize()
    //win.maximize();
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, "add_employee.html"),
        protocol: "file:",
        slashes: true,
    }));

});





// button click event
document.getElementById("create_job").addEventListener("click", () => {
	let section =  document.getElementById("section").value;
	let section_ = section_dict[section]



	let error_jobid = document.getElementById("error_jobid");  	
	let error_partid = document.getElementById("error_partid");  	

	let job_id_year = document.getElementById("job_id_year").value;
	let job_id_type = document.getElementById("job_id_type").innerHTML;
	let job_id_num = document.getElementById("job_id_num").value;

	let partid_ = document.getElementById("part_id").value;

	if(job_id_year == "" && job_id_num == ""){
    	error_jobid.innerHTML = "<span style='color: red; padding-left:5px;'>"+ "Please enter a valid Job ID</span>" 
    } else{
    	if(job_id_year == ""){
	    	error_jobid.innerHTML = "<span style='color: red; padding-left:5px;'>"+ "Please enter a valid Year for ID</span>" 
	    } else if (job_id_num == ""){
	    	error_jobid.innerHTML = "<span style='color: red; padding-left:5px;'>"+ "Please enter a valid number for ID</span>" 

	    }else{
	    	error_jobid.innerHTML = "" 
	    } 
    }

   

 

    if(job_id_year != "" && job_id_num != "" ){

    	let jobid_= job_id_year + '/'+ job_id_type + '/' + job_id_num;


	    let date_ = document.getElementById("date_receive").value;
	    let description_ = document.getElementById("description").value;
	    let remarks_ = document.getElementById("remarks").value;
	    let division_ = document.getElementById("division").value;

	    if(partid_==""){
	    	partid_="*"
	    }


	    var allJobData = jobsData.getData()["data"];
		var foundJobData=[];

		if(allJobData.length!=0){
			foundJobData = allJobData.filter( data => (data.job_id == jobid_) && (data.part_id == partid_)  );
	
		}
		if(foundJobData.length >0){
			alert("Part No "+partid_+" already exists for the Job No!")

		}else{
			let type_ = 'pending';

		    let new_job_data ={"section":section_,"job_id":jobid_,"part_id":partid_,"date_receive":date_,"description":description_,"remarks":remarks_,"division":division_,"type":type_,"date_complete":""};

		    jobsData.addData(new_job_data);


		    createBrowserWindow(jobid_);

		}




	}

});


// button click event
document.getElementById("search_job").addEventListener("click", () => {
	let section =  section_dict[document.getElementById("section").value];

  	let search_job_id_year = document.getElementById("search_job_id_year").value;
	let search_job_id_type = document.getElementById("search_job_id_type").innerHTML;
	let search_job_id_num = document.getElementById("search_job_id_num").value;


    let search_job_id= search_job_id_year + '/'+ search_job_id_type + '/' + search_job_id_num;

    let error_search_id= document.getElementById("error_search_id");
    if(search_job_id_year == "" && search_job_id_num == ""){
    	error_search_id.innerHTML = "<span style='color: red; padding-left:5px;'>"+ "Please enter a valid Job ID</span>" 
    } else{
    	if(search_job_id_year == ""){
	    	error_search_id.innerHTML = "<span style='color: red; padding-left:5px;'>"+ "Please enter a valid Year for ID</span>" 
	    } else if (search_job_id_num == ""){
	    	error_search_id.innerHTML = "<span style='color: red; padding-left:5px;'>"+ "Please enter a valid number for ID</span>" 

	    }else{
	    	error_search_id.innerHTML = "" 
	    } 
    }




    if(search_job_id_year != "" && search_job_id_num != ""){
    	
    	allJobs = jobsData.getData()["data"];
	    if(allJobs!=[]){
	    	foundJobs = allJobs.filter(job => job.job_id == search_job_id && job.section == section);
	    	createSearchResultsTable(foundJobs);
	    }

	    let print= document.getElementById("preview_area");
		try {
			childNode = document.getElementById("print_job");
			print.removeChild(childNode);
		}
		catch(err) {
			
		}

	    var btn = document.createElement('button');
	    btn.setAttribute("id","print_job");

	    btn.innerHTML="Print Preview";


	    print.appendChild(btn);

		// button click event
		document.getElementById("print_job").addEventListener("click", () => {

			let search_job_id_year = document.getElementById("search_job_id_year").value;
			let search_job_id_type = document.getElementById("search_job_id_type").innerHTML;
			let search_job_id_num = document.getElementById("search_job_id_num").value;


		    let search_job_id= search_job_id_year + '/'+ search_job_id_type + '/' + search_job_id_num;
		    let selected_jobid = [search_job_id]
				  	
		    allJobs = jobsData.getData()["data"];
		    var table = document.getElementById("output_table_results");
		    var tbl_rows = table.rows;

		    var row;
		    var checked_parts = [];
			for (row = 1; row < tbl_rows.length; row++) {
				var objCells = tbl_rows.item(row).cells;	


				var checkbox = objCells[0].getElementsByTagName("input")[0];
				if (checkbox.checked==true){
					checked_parts.push(checkbox.id.split("_")[1]);
				}	
			}

			if (checked_parts.length !=0){
				createPrintWindow(selected_jobid,checked_parts);
			} else{
				alert("Please Select a Check-Box before print!")

			}

		});

    }





});




// button click event
document.getElementById("search_job_type").addEventListener("click", () => {

	let section =  section_dict[document.getElementById("section").value];

	let job_type = document.getElementById("view_type_options").value;  




	let error_search_id= document.getElementById("error_search_id");
	error_search_id.innerHTML="";


	allJobs = jobsData.getData()["data"];

    if(allJobs!=[]){

    	if (job_type == 'All'){
    		foundJobs = allJobs.filter(job => job.section == section);

    	} else if(job_type == 'Completed'){
    		foundJobs = allJobs.filter(job => (job.type == 'complete') && ( job.section == section));

    	}else{
    		foundJobs = allJobs.filter(job => (job.type == 'pending') && ( job.section == section));
    	}
    	
    	createSearchResultsTable(foundJobs);
    }

    let print= document.getElementById("preview_area");
	try {
		childNode = document.getElementById("print_job");
		print.removeChild(childNode);
	}
	catch(err) {
		
	}

    var btn = document.createElement('button');
    btn.setAttribute("id","print_job");
    btn.innerHTML="Print Preview";

    print.appendChild(btn);

	// button click event
	document.getElementById("print_job").addEventListener("click", () => {

		
	  	
	    allJobs = jobsData.getData()["data"];
	    var table = document.getElementById("output_table_results");
	    var tbl_rows = table.rows;

	    var row;
	    var checked_parts = [];
	    var selected_jobid;
		for (row = 1; row < tbl_rows.length; row++) {
			var objCells = tbl_rows.item(row).cells;	
			


			var checkbox = objCells[0].getElementsByTagName("input")[0];
			if (checkbox.checked==true){
				selected_jobid = objCells[1].innerText;
				checked_parts.push(checkbox.id.split("_")[1]);
			}	
		}

		if (checked_parts.length != 0){
			
			createPrintWindow(selected_jobid,checked_parts);
		} else{
			alert("Please Select a Check-Box before print!")
		}	



	});

    

});
