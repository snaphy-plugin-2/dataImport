'use strict';
module.exports = function( server, databaseObj, helper, packageObj) {
	const Promise = require("bluebird");
	const moment = require("moment");
    const _   =require("lodash");
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
		addCityId: function (sheetRowObj, callback) {
			const City = server.models["City"];
			const Area = server.models["Area"];
			var city;
			if(sheetRowObj.Area.data){
                sheetRowObj.Area.data.name = _.capitalize(sheetRowObj.Area.data.name);
				if(sheetRowObj.Area.data.name){
					 City.findOne({
						 where:{
							 name: "Delhi"
						 }
					 })
					 .then(function (_city) {
					     if(_city){
                             city = _city;
                             return Area.findOne({
                                 where:{
                                     name: _.capitalize(sheetRowObj.Area.data.name),
                                     cityId: _city.id
                                 }
                             });
                         }else{
					         throw new Error("City not found");
                         }
					 })
                     .then(function (area) {
                         if(!area){
                             return Area.create({
                                 name: sheetRowObj.Area.data.name,
                                 cityId: city.id
                             });
                         }else{
                             return area;
                         }

                     })
                     .then(function (area) {
                         if(area){
                             sheetRowObj.Customer.data.areaId = area.id;
                             sheetRowObj.Customer.data.cityId = city.id;
                         }
                         callback(null);
                     })
					 .catch(function (error) {
						 callback(error);
					 });
				}else{
					callback(new Error("Area not found"));
				}
			}else{
                callback(new Error("Area not found"));
			}

        },
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
		beforeCustomerSave: function(sheetRowObj, callback){
            const Customer = server.models["Customer"];
            if(sheetRowObj.Customer){
                if(sheetRowObj.Customer.data){
                    if(!sheetRowObj.Customer.data.mobileNumber){
                        if(sheetRowObj.Customer.data.accountNumber){
                            sheetRowObj.Customer.data.mobileNumber = sheetRowObj.Customer.data.accountNumber;
                        }
                    }
                }
             }

            if(sheetRowObj.Customer.data.firstName){
                sheetRowObj.Customer.data.firstName = sheetRowObj.Customer.data.firstName.replace(/\*+/,'');
            }

            if(sheetRowObj.Customer.data.lastName){
                sheetRowObj.Customer.data.lastName = sheetRowObj.Customer.data.lastName.replace(/\*+/,'');
            }

            if(sheetRowObj.Customer.data.mobileNumber){
                sheetRowObj.Customer.data.mobileNumber = sheetRowObj.Customer.data.mobileNumber.toString();
                //Sanitize mobile number..
                sheetRowObj.Customer.data.mobileNumber = sheetRowObj.Customer.data.mobileNumber.replace(/\/\d+$/,'');
            }


            sheetRowObj.Customer.where.mobileNumber = sheetRowObj.Customer.data.mobileNumber;

            if(sheetRowObj.Customer.data.subscription_time){
                sheetRowObj.Customer.data.subscription_time = sheetRowObj.Customer.data.subscription_time || "07:30";
                sheetRowObj.Customer.data.subscription_time = moment.utc(sheetRowObj.Customer.data.subscription_time, "hh:mm").toDate();

            }

            if(sheetRowObj.Customer.data.subscription_startDate){
                sheetRowObj.Customer.data.subscription_startDate = moment.utc(sheetRowObj.Customer.data.subscription_startDate, "DD/MM/YYYY").toDate();
            }


            sheetRowObj.Customer.data.type = "individual";
            sheetRowObj.Customer.data.subscriptionType = "subscription";
            sheetRowObj.Customer.data.added   = moment.utc().toDate();
            sheetRowObj.Customer.data.updated = moment.utc().toDate();



            callback(null);
		}
	};

	return{
		beforeSave: beforeSave
	};
};