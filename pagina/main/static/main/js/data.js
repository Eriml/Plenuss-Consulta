
/*var csrftoken = Cookies.get('csrftoken');

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
$(document).ready(function(){
    $("#search").submit(function(event){
         var dsd = $('#desde').val();
        //event.preventDefault();
        $.ajax({
            type: "POST",
            url : "/searchInfo/",
            data : { 'desde' :dsd, 'hasta': $('#desde').val() },
            success: function(data){
                 app.resultado = JSON.parse(data);
                 app.lon = app.resultado.length;
                 angular.element(document.getElementById('store')).scope().$apply();
            }
        });
        return false;
    });
});
*/
