var csrftoken = Cookies.get('csrftoken');
Cookies.set('XSRF-TOKEN',csrftoken);
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

app = angular.module('store', ['angularUtils.directives.dirPagination','biblioteca']);

app.controller('ControladorFecha', function($scope,$http) {
     //Headers for the http so it works with Angular and Django
    $http.defaults.xsrfCookieName = 'csrftoken';
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $scope.tabla = '';
    $scope.loading = false;
    $scope.result = []
    $scope.tablas = []
    $scope.tam = $scope.result.length;
    $scope.columns = []
    $scope.selcolums = {value : []}
    $scope.propertyName = '';
    $scope.reverse = false;
    $scope.tableData = {
          headers: [],
          data: [],
          propertyName: '',
          reverse: false,
          orderBy: function(propertyName) {
               this.reverse = (this.propertyName === propertyName) ? !this.reverse : false;
               this.propertyName = propertyName;
          }
    };
    $scope.config = {
        itemsPerPage: 5,
        fillLastPage: true
    }
    //We are going to erase function search
    this.search = function() {
        $scope.loading = true;
        var dsd = $('#desde').val();
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
                    $scope.result = JSON.parse(data).sort(function(a, b) {
                        return a['producto'].localeCompare(b['producto'])
                    });
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
    this.seachA = function () {
      $scope.loading = true;
      $http({
        method: 'POST',
        url: '/searchInfo/'
      }).then(function successCallback(response) {
        $scope.result = JSON.parse(data).sort(function(a, b) {
            return a['producto'].localeCompare(b['producto'])
        });
        $scope.tam = $scope.result.length;
        $scope.loading = false;
        $("#btnText").html("Buscar");
        // this callback will be called asynchronously
        // when the response is available
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.loading = false;
        $("#btnText").html("Buscar");
      });
    };

    this.orderP = function(propertyName) {
        //Ordena las cosas por medio de alfabetico en la tabla
        //This is going to be part of the object dynTable
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
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
    this.searchTabA = function() {
        $scope.loading = true;
        $("#btnTextTbl").html('Buscando');
        //This one is not ajax in Django.
        //Use method to call the method.
        //Returned data is made to JSON alone

        $http({
               method: 'POST',
               url: '/searchTbl/'
        }).then(function successCallback(data) {
               console.log(data);
               $scope.tablas = data.data
               $("#btnTextTbl").html('Buscar');
               $scope.loading = false;
               // this callback will be called asynchronously
               // when the response is available
        }, function errorCallback(response) {
             // called asynchronously if an error occurs
             // or server returns response with an error status.
             $scope.loading = false;
             $("#btnTextTbl").html('Buscar');
             alert('Error inesperado');
        });
    };



    this.searchColumns = function(Tabla) {
        $scope.tabla = Tabla;
        alert($scope.tabla);
        $scope.selcolums.value = [];
        $scope.tableData.headers = [];
        $.ajax({
             type: "POST",
             url: "/searchColumns/",
             data: {
                 'tabla': Tabla
           },
            success: function(data) {
                $scope.$apply(function() {
                     $scope.tableData.headers = [];
                     $scope.columns = JSON.parse(data);
                });
            },
            error: function(data) {
                alert("Error inesperado");
            }
        });
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
        if((index = $.inArray(column,$scope.tableData.headers))>=0){
                 $scope.tableData.headers.splice(index,1);
        }
        else {
                $scope.tableData.headers.push(column);
            console.log("Se inserto el " + column);
        }
        console.log($scope.tableData.headers);
    };
    this.drawTable = function(tabla){
        console.log($scope.tableData.headers);
        $.ajax({
            type: "POST",
            url: "/drawColumns/",
            data: {
                'tabla': tabla,
                'columns[]': $scope.tableData.headers,
            },
            success: function(data) {
                        $scope.$apply(function(){
                          $scope.tableData.data = JSON.parse(data);
                    });
                        console.log($scope.tableData);
            },
            error: function(data) {
                alert("Error inesperado");
            }
        });
    };



});

})();
