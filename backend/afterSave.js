'use strict';
module.exports = function( server, databaseObj, helper, packageObj) {
	const Promise = require("bluebird");
	const afterSave = {
		addParentAfterSave: function (sheetRowObj, callback) {
			if(sheetRowObj.Parent.config){
				if(sheetRowObj.Parent.config.parent){
					//Get admin sheet
					var dataList = sheetRowObj.Parent.config.parent["Admin"];
					var row = dataList[0];
					if(row){
						if(row.School){
							if(row.School.results){
								let schoolId = row.School.results.id;
								if(sheetRowObj.Parent){
									if(sheetRowObj.Parent.results){
										if(!sheetRowObj.Parent.results.studentId){
											return callback(new Error("studentId could not be found for parent data"));
										}

										const Student = server.models.Student;
										Student.findOne({
											where: {
												id: sheetRowObj.Parent.results.studentId
											}
										})
											.then(function (studentInstance) {
												if(studentInstance){
													studentInstance.parentId = sheetRowObj.Parent.results.id;
													studentInstance.save(function (error, student) {
														if(error){
															callback(error);
														}else{
															callback(null);
														}
													});
												}else{
													callback(new Error("Student could not be found for parent data"));
												}
											})
											.catch(function (error) {
												callback(error);
											});

									}else{
										return callback(null);
									}
								}
							}
						}
					}
				}
			}else{
				return callback(new Error("School data not present for Parent save"));
			}
		}
	};

	return {
		afterSave: afterSave
	};
};