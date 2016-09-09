app.directive("dynamicTable",[function(){
  return {
    require: ['^^angularUtils.directives.dirPagination'],
    restrict: 'E',
    templateUrl: 'static/dynamicTable.html',
    scope: {
      tableData: "="
    }
  };
}])
