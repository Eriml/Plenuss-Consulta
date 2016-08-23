var csrftoken = Cookies.get('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});
(function(){

app = angular.module('store', ['angularUtils.directives.dirPagination']);

app.controller('ControladorFecha', function($scope,$http) {
    $scope.loading = false;
    $scope.resulttotal = []
    $scope.result = []
    $scope.tablas = []
    $scope.tam = $scope.result.length;
    $scope.op = 1;
    $scope.columns = []
    $scope.selcolums = {value : []}
    $scope.propertyName = null;
    $scope.reverse = false;
    this.searchT = '';
    $scope.tableData = {};
    $scope.config = {
        itemsPerPage: 5,
        fillLastPage: true
    }
    $('#buscarTa').html('');
    this.search = function() {
        $scope.loading = true;
        var dsd = $('#desde').val();
        $("#btnSearch").attr("disabled", '');
        $("#btnText").html("Buscando");
        //event.preventDefault();

        $.ajax({
            type: "POST",
            url: "/searchInfo/",
            data: {
                'desde': dsd,
                'hasta': $('#hasta').val()
            },
            success: function(data) {
                $scope.$apply(function() {
                    $scope.resulttotal = JSON.parse(data).sort(function(a, b) {
                        return a['producto'].localeCompare(b['producto'])
                    });
                    $scope.result = $scope.resulttotal;
                    $scope.tam = $scope.result.length;
                    $scope.loading = false;
                    $("#btnSearch").removeAttr("disabled");
                    $("#btnText").html("Buscar");
                });
            },
            error: function(data) {
                $scope.loading = false;
                $("#btnSearch").removeAttr("disabled");
                $("#btnText").html("Buscar");
            }
        });

        return false;

    };

    this.orderP = function(propertyName) {
        //Ordena las cosas por medio de alfabetico en la tabla
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
        /*    if($scope.op == 1){
                        $scope.op = 0 ;
                $scope.result = $scope.result.sort(function(a,b){return b['producto'].localeCompare(a['producto'])});
        }
        else{
                    $scope.op = 1 ;

            $scope.result = $scope.result.sort(function(a,b){return a['producto'].localeCompare(b['producto'])});
        } */
    };


    this.searchTab = function() {
        $scope.loading = true;
        $("#btnTbl").attr('disabled', '');
        $("#btnTextTbl").html('Buscando');
        $.ajax({
            type: "POST",
            url: "/searchTbl/",
            success: function(data) {
                $scope.$apply(function() {
                    $scope.tablas = JSON.parse(data);
                    $("#btnTbl").removeAttr('disabled');
                    $("#btnTextTbl").html('Buscar');
                    $scope.loading = false;
                });
            },
            error: function(data) {
                $scope.$apply(function() {
                    $scope.loading = false;
                    $("#btnTbl").removeAttr('disabled');
                    $("#btnTextTbl").html('Buscar');
                    alert('Error inesperado');

                });
            }
        });
    };

    this.searchColumns = function() {
        var tabla = $("#tablaSel").val();
         $scope.selcolums.value = []
        $.ajax({
            type: "POST",
            url: "/searchColumns/",
            data: {
                'tabla': tabla
            },
            success: function(data) {
                $scope.$apply(function() {
                    $scope.columns = JSON.parse(data);
                });
            },
            error: function(data) {
                alert("Error inesperado");
            }
        });
    };

    this.getRows = function() {

    };

    this.doGet = function() {
        alert('Hi');
        $http.get('/doGet/').then(function (result) {
            console.log(result);
        });
    };

    //Function to toggle the checkboxs to see what were the seleted columns to show.
    this.toggleColumn = function(column){
        console.log(column);
        if((index = $.inArray(column,$scope.selcolums.value))>=0){
            //$scope.$apply(function(){
                 $scope.selcolums.value.splice(index,1);
            //});
        }
        else {
            //$scope.$apply(function(){
                $scope.selcolums.value.push(column);
            //});

            console.log("Se inserto el " + column);
        }
        console.log($scope.selcolums);
    };
    this.drawTable = function(){
        //$scope.loading = true;
        console.log($scope.selcolums);
        $.ajax({
            type: "POST",
            url: "/drawColumns/",
            data: {
                'tabla': $("#tablaSel").val(),
                'columns[]': $scope.selcolums.value,
            },
            success: function(data1) {
                        console.log("queso");
                        $scope.$apply(function(){
                        $scope.tableData = JSON.parse(data1);
                    });
                        console.log($scope.tableData);
                        //$scope.tam = $scope.tableData.data;
                        $scope.loading = false;
            },
            error: function(data) {
                alert("Error inesperado");
                $scope.loading = false;
            }
        });
    };



});

app.directive('dynTable',function(){
    return {
        template: "<div class='table-responsive'>"+
        "<table class='table'>"+
            "<tr>"+
                "<th ng-repeat='header in selcolums.value'><a href ng-click='control.orderP(header)'>{{header}}<span class='glyphicon glyphicon-sort' ng-show='propertyName === header'></span></a></th>"+
            "</tr>"+
                "<tr dir-paginate='result in tableData | orderBy:propertyName:reverse | filter:searchT | itemsPerPage: 15'><td ng-repeat='header in selcolums.value'>{{result[header]}}</td></tr>"+
        "</table>"+
        "<dir-pagination-controls max-size='5' direction-links='true' boundary-links='true' ></dir-pagination-controls>"+
    "</div>"
};
});
})();
