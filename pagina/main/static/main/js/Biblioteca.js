(function(){
  angular.module('biblioteca',['angularUtils.directives.dirPagination'])
  .directive('dynamicTable',dynamicTableFun);

  function dynamicTableFun() {
    return {
      require: ['^^angularUtils.directives.dirPagination'],
      restrict: 'E',
      templateUrl: 'static/dynamicTable.html',
      scope: {
        tableData: "="
      }
    };
  }

})();
