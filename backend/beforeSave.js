'use strict';
module.exports = function( server, databaseObj, helper, packageObj) {
	const Promise = require("bluebird");
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
			if(sheetRowObj.Teacher.config){
				if(sheetRowObj.Teacher.config.parent){
					//Get admin sheet
					var dataList = sheetRowObj.Teacher.config.parent["Admin"];
					var row = dataList[0];
					if(row){
						if(row.School){
							if(row.School.results){
								let schoolId = row.School.results.id;
								if(sheetRowObj.Teacher){
									if(sheetRowObj.Teacher.data){
										sheetRowObj.Teacher.data.password = 12345;
										sheetRowObj.Teacher.data.schoolId = schoolId;
									}
								}
								return callback(null);
							}
						}
					}
				}
			}
			return callback(new Error("School data not present for teacher save"));
		},
		addStudentBeforeSave: function (sheetRowObj, callback) {
			//Get school data from parent sheet..
			if(sheetRowObj.Student.config){
				if(sheetRowObj.Student.config.parent){
					//Get admin sheet
					var dataList = sheetRowObj.Student.config.parent["Admin"];
					var row = dataList[0];
					if(row){
						if(row.School){
							if(row.School.results){
								let schoolId = row.School.results.id;
								if(sheetRowObj.Student){
									if(sheetRowObj.Student.data){
										sheetRowObj.Student.data.password = 12345;
										sheetRowObj.Student.data.schoolId = schoolId;
										if(sheetRowObj.Student.data.email){
											sheetRowObj.Student.where.schoolId = schoolId;
											sheetRowObj.Student.where.email = sheetRowObj.Student.data.email;
										}

										if(sheetRowObj.Student.data.class !== undefined && sheetRowObj.Student.data.section !== undefined){
											//Now set student class and section..
											var AinakClassAndSection = server.models.AinakClassAndSection;
											AinakClassAndSection.findOne({
												where:{
													name: sheetRowObj.Student.data.class,
													section: sheetRowObj.Student.data.section
												}
											})
												.then(function (classInstance) {
													if(!classInstance){
														return AinakClassAndSection.create({
															name: sheetRowObj.Student.data.class,
															section: sheetRowObj.Student.data.section,
															schoolId: schoolId
														});
													}else{
														return classInstance;
													}
												})
												.then(function (classInstance) {
													if(classInstance){
														//Now get the class id..
														sheetRowObj.Student.data.ainakClassAndSectionId = classInstance.id;
														if(sheetRowObj.Student.data.email){
															sheetRowObj.Student.where.ainakClassAndSectionId = classInstance.id;
														}

														//Now delete unwanted data..
														delete sheetRowObj.Student.data.class;
														delete sheetRowObj.Student.data.section;
														callback(null);

													}else{
														callback(new Error("Class could not be created"));
													}
												})
												.catch(function (error) {
													callback(error);
												});
										}
									}
								}
							}
						}
					}
				}
			}else{
				return callback(new Error("School data not present for Student save"));
			}

		}

	};

	return{
		beforeSave: beforeSave
	};
};