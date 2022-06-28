// home/.config/cost/Jobs.json
const Store = require("electron-store");


class DataStore extends Store{
	constructor(settings){
		super(settings)
		this.data = this.get('data')||[]
	}
	saveData(){
		this.set('data',this.data)

		return this
	}
	getData(){
		this.data = this.get('data') || []
		return this
	}
	addData(data){
		this.data = [...this.data,data]
		return this.saveData()
	}

	update(jobid,partid,change_dict){
		var all = this.data;
		if(partid != null){
			var found = all.filter(data => (data.job_id == jobid) && (data.part_id == partid))[0];
		}else{
			var found = all.filter(data => (data.job_id == jobid) )[0];
		}
		
		var idx = all.indexOf(found)

		var attributes = Object.keys(change_dict);
		var attribute_idx;
		var attribute;

		for (attribute_idx=0; attribute_idx<attributes.length; attribute_idx++){

			attribute = attributes[attribute_idx]
			all[idx][attribute] = change_dict[attribute]

		}

		this.set('data',all)

		return this

	}

	delete(jobid,partid){
		var all = this.data;
		var found = all.filter(data => (data.job_id == jobid) && (data.part_id == partid))

		var attribute_idx;

		for (attribute_idx=0; attribute_idx<found.length; attribute_idx++){
			var idx  = all.indexOf(found[attribute_idx])

			all.splice(idx,1)


		}
		this.set('data',all)


	}

	deleteEmployee(section,name){
		var all = this.data;
		console.log(all)
		console.log(name)
		var found = all.filter(data => (data.section == section) && (data.name == name))

		var attribute_idx;

		for (attribute_idx=0; attribute_idx<found.length; attribute_idx++){
			var idx  = all.indexOf(found[attribute_idx])

			all.splice(idx,1)


		}
		this.set('data',all)


	}


}


module.exports = DataStore