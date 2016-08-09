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
app = angular.module('store', ['angularUtils.directives.dirPagination']);

app.controller('ControladorFecha', function($scope) {
    $scope.loading = false;
    $scope.resulttotal = []
    $scope.result = []
    $scope.tablas = []
    $scope.tam = $scope.result.length;
    $scope.op = 1;
    $scope.columns = []
    $scope.selcolums = []
    $scope.propertyName = null;
    $scope.reverse = false;
    $scope.config = {
        itemsPerPage: 5,
        fillLastPage: true
    }

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



});


app.controller('StoreController', function() {
    this.product = gem;


    /*    this.changeTable = function(){
            var dsd = $('#desde').val();
            alert("hola");
           //event.preventDefault();
           $.ajax({
               type: "POST",
               url : "/searchInfo/",
               data : { 'desde' :dsd, 'hasta': $('#desde').val() },
               success: function(data){
                    app.result = JSON.parse(data);

                    app.lon = result.length;
               }
           });
           console.log(app.result);
       };*/
});

var gem = {
    name: 'Dodecahedron',
    price: 2.95,
    description: 'This is a precious gem to do great things.',
    canPurchase: true
}
