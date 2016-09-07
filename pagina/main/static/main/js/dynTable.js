var DynamicTable = function(){
    this.headers = [];
    this.data = [];
    this.reversed = False;
    this.orderProperty = '';
    this.filter = "";
    this.items = 10;
}

var tableTemplate = function(dataTable){
    return {
        template: "<div class='table-responsive'>"+
        "<table class='table'>"+
            "<tr>"+
                "<th ng-repeat='header in " + dataTable + ".headers'><a href ng-click='"+dataTable+".orderP(header)'>{{header}}<span class='glyphicon glyphicon-sort' ng-show='"+dataTable+".orderProperty === header'></span></a></th>"+
            "</tr>"+
                "<tr dir-paginate='result in "+dataTable+".data | orderBy:"+dataTable+".orderProperty:"+dataTable+".reversed | filter:"+dataTable+".filter | itemsPerPage:"+dataTable+".items'><td ng-repeat='header in "+dataTable+".headers'>{{result[header]}}</td></tr>"+
        "</table>"+
        "<dir-pagination-controls max-size='5' direction-links='true' boundary-links='true' ></dir-pagination-controls>"+
    "</div>"
    };
};

function createDirective(app,name,template,control){
    app.directive(name,template(control));
};

function createFactory(app,name,func){
    app.factory('name',func);
}

var createController = function(app) {

}

app.factory('getData',['$http','$scope',function($http,$scope){
    return function(table,headers,dataOb){
        $.ajax({
            type: "POST",
            url: "/drawColumns/",
            data: {
                'tabla': table,
                'columns[]': headers,
            },
            success: function(data) {
                        $scope.$apply(function(){
                            dataOb.tableData = JSON.parse(data);
                    });
            },
            error: function(data) {
                alert("Error inesperado");
            }
        });
    };
}]);
