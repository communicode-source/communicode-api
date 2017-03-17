$(document).ready(function() {

  $('.name-input-form button').button({loadingText: '<i class="fa fa-check" aria-hidden="true"></i>'});

  $('.name-input-form button').click(function (e) {
      e.preventDefault();
      var btn = $(this);

      $.ajax({
			  type: "POST",
			  url: "http://localhost:3000/user/update/" + id + "/name",
			  data: JSON.stringify({fname: $("#fname").val(), lname: $("#lname").val()}),
			  dataType: "JSON",
        success: function() {
          
        }
			});

      btn.button('loading');
      setTimeout(function () {
          btn.button('finished');
      }, 500);
  });

  var pictures = {
    "environment"   : "Environment",
    "science"       : "Science and Technology",
    "wildlife"      : "Wildlife",
    "preservation"  : "Preservation",
    "artsandculture": "Arts and Culture",
    "education"     : "Education",
    "humanservices" : "Human Services",
    "civilrights"   : "Civil Rights"
  }

  $('.interest-picture').on('click', function(e) {
    var pic = $(this);
    var h3 = $(this).find("h3");

    if(!$(this).hasClass("chosen")) {
      h3.html("<i class='fa fa-check' aria-hidden='true'></i>").addClass("checked");
      pic.addClass("chosen");
      if($(".chosen").length+1 == 1)
        $('.submit-interests').animate({'right': '2.5em'}, 500);
      else
        $('.submit-interests').animate({'right': '.2em'}, 500);
    } else {
      h3.text(
        pictures[$(this).attr("id")]
      ).removeClass("checked");

      pic.removeClass("chosen");
    }
  });


  // Animate the scroll to top
  $('.submit-interests').click(function(event) {
    event.preventDefault();

    $('html, body').animate({scrollTop: 0}, 300);
  });
});
