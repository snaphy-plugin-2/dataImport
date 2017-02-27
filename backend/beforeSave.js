'use strict';
module.exports = function( server, databaseObj, helper, packageObj) {
	//Method for storing before save..methods..
	//MEthod can be added externally through plugin method attached to beforeSave.
	const beforeSave = {
		/**
		 *
		 * @param sheetRowObj
		 * {
				"MODEL NAME":{
					instance: "MODEL INSTANCE",
					where:{},
					data:{
						//Data which is going to be saved
					},
					results:{
						//server results
					},
					beforeSave:[]
				}
			}
		 @param callback {Function}
		 */
		addSchoolId: function (sheetRowObj, callback) {
			//console.log(sheetRowObj.School);
			if(sheetRowObj.School){
				//Check if data is saved already..
				if(sheetRowObj.School.results){
					let schoolId = sheetRowObj.School.results.id;
					//Now add school id to admin..data obj..
					if(sheetRowObj.Admin){
						if(sheetRowObj.Admin.data){
							sheetRowObj.Admin.data["schoolId"] = schoolId;
						}
					}
				}
			}
			callback(null);
		},
		/**
		 * Add default password to admin data...
		 * @param sheetRowObj
		 * @param callback
		 */
		addPassword: function (sheetRowObj, callback) {
			if(sheetRowObj.School){
				//Check if data is saved already..
				if(sheetRowObj.School.results){
					let schoolId = sheetRowObj.School.results.id;
					//Now add school id to admin..data obj..
					if(sheetRowObj.Admin){
						if(sheetRowObj.Admin.data){
							sheetRowObj.Admin.data.password = "12345";
						}
					}
				}
			}
			callback(null);
		},
		addTeacherBeforeSave: function (sheetRowObj, callback) {
			//Get school data from parent sheet..
			if(sheetRowObj.config){
				if(sheetRowObj.config.parent){
					var dataList = sheetRowObj.config.parent["Admin"]
					var row = dataList[0];
					//TODO: Work in progress..
				}
			}
		}
	};

	return{
		beforeSave: beforeSave
	};
};