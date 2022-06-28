const fs = require("fs");
const url = require("url");
const path = require("path");

//a dialog box module from electron
const electron = require('electron');

// Also note that document does not exist in a normal node environment
const emp_section_dict = {"Electrical":"E","E/GM":"Electrical","Electronic":"INTS","Vehicle":"V","V/S":"Vehicle","Fabric":"F","Pump":"P","Machine":"MC","Meter":"M"}

const DataStore = require('./datastore');
const employeeData = new DataStore({name:'employeeData'});


let section=emp_section_dict[window.process.argv.slice(-1)]

console.log(section)

// button click event
document.getElementById("add_employee_name").addEventListener("click", () => {
	var name = document.getElementById("emp_name").value;
	var err =document.getElementById("error_name"); 
	err.innerHTML = ""


	if(name == ""){

		err.innerHTML = "Please enter a valid Name!"


	}else{
		employeeData.addData({"section": section, "name":name})
		alert('Sucessfully Added '+name+'!')
		document.getElementById("emp_name").value = ""

	}
	 


});

 
  

function removeEmployee(ele){

	var table = document.getElementById("emp_name_table");
	var row_id = parseInt(ele.id.split('_')[1])
	console.log(table.rows.item(row_id).cells[0].getElementsByTagName("label")[0].innerHTML)

	var name_to_delete = table.rows.item(row_id).cells[0].getElementsByTagName("label")[0].innerHTML
	//del
	employeeData.deleteEmployee(section,name_to_delete)
	view_employee()



}


function view_employee(){
	var err =document.getElementById("error_name"); 
	//var ul = document.getElementById("emp_list");

	/*
	
	while (ul.hasChildNodes()) {  
	  ul.removeChild(ul.firstChild);

	}
	err.innerHTML ="";
	*/



	allEmpData = employeeData.getData()["data"];

	if(allEmpData.length!=0){
		foundEmpData = allEmpData.filter(data => data.section == section);
		console.log(foundEmpData)
		if(foundEmpData.length!=0){

			var tbl = document.getElementById("emp_name_table")

			tbl.innerHTML = "";

			


			//tbl.parentNode.removeChild(tbl);

			

			//var tbl=document.createElement("TABLE");
			//tbl.setAttribute("id","emp_name_table")








			var name_found;
			for (var i = 0; i < foundEmpData.length; i++) {
				name_found=foundEmpData[i]["name"];


				var row = tbl.insertRow(-1);

				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);

				cell1.setAttribute("max-width","10px")

				var img = document.createElement('img');
				img.src = 'emp.png';
				cell1.appendChild(img);

				var t1=document.createElement("label");
				t1.innerHTML = name_found
				t1.className="left-text";

			    cell2.appendChild(t1);

				var t2=document.createElement("button");

				t2.innerHTML = "REMOVE EMPLOYEE"
				t2.setAttribute('id', "row_"+ String(i));
				t2.setAttribute('color', "#FFF");
				t2.setAttribute('onclick',"removeEmployee(this)");

			    cell3.appendChild(t2);
			    console.log(row)




				//var li = document.createElement("li");

	 			//li.appendChild(document.createTextNode(name_found));
	 			//ul.appendChild(li);		


			}
		}else{
			err.innerHTML = "No Employee found in "+section+" Section!"

		}
		
	}else{

		err.innerHTML = "No Employee Found!"

	}




}




