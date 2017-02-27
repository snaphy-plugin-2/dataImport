'use strict';

angular.module($snaphy.getModuleName())

//Controller for dataImportControl ..
.controller('dataImportControl', ['$scope', '$stateParams', 'Database',
    function($scope, $stateParams, Database) {
        //Checking if default templating feature is enabled..
        var defaultTemplate = $snaphy.loadSettings('dataImport', "defaultTemplate");
        $scope.state = $snaphy.loadSettings('dataImport', "state");
        $snaphy.setDefaultTemplate(defaultTemplate);
        //Use Database.getDb(pluginName, PluginDatabaseName) to get the Database Resource.
    }//controller function..
]);