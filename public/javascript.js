//contact form

function initMap(){
    var location = {lat: 49.767570, lng: -119.107670};
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: location
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

$(document).ready(function(){
    $('.submit').click(function(event){
        event.preventDefault();
        console.log('Clicked Button');

        var f_name =$('.f_name').val();
        var l_name =$('.l_name').val();
        var email =$('.email').val();
        var country =$('.country').val();
        var comments =$('.comments').val();
        var count = 0;

        if(f_name.length >= 3) {
            count += 1
        }else{
            document.getElementById("status").innerHTML = '**First name must be more than 2 characters**<br>'
        }

        if(l_name.length >= 5) {
            count += 1
        }else{
            document.getElementById("status").innerHTML = '**Last name must be more than 4 characters**<br>'
        }

        if(email.length > 5 && email.includes('@') && email.includes('.')){
            count += 1
        }else{
            document.getElementById("status").innerHTML =
                '**Email must be more than 5 characters, must include \'@\' and must include a period**<br>'
        }

        if(country == 1){
            count += 1
        }else{
            document.getElementById("status").innerHTML = '**Country must be selected**<br>'
        }

        if(comments.length > 20) {
            count += 1
        }else{
            document.getElementById("status").innerHTML = '**Comments must be more than 20 characters**<br>'
        }

        if(count == 5){
            location.href = "thankyou.html"
        }
    })
});