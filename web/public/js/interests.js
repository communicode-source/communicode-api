$(document).ready(function() {

  $('.name-input-form button').button({loadingText: '<i class="fa fa-check" aria-hidden="true"></i>'});

  $('.name-input-form a').click(function (e) {
      e.preventDefault();
      var btn = $(this);

      var url = $(this).attr("href");

      $.ajax({
			  type: "PUT",
			  url: url,
			  data: {fname: $("#fname").val(), lname: $("#lname").val()},
			  dataType: "JSON",
        done: function() {
          btn.button('finished');
        }
			});

  });

  $('.organization-input-form a').click(function (e) {

      console.log("This is right.");
      e.preventDefault();
      var btn = $(this);

      var url = $(this).attr("href");

      $.ajax({
			  type: "PUT",
			  url: url,
			  data: {organizationName: $("#organizationName").val()},
			  dataType: "JSON",
        done: function() {f
          btn.button('finished');
        }
			});

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

    var interests = [];
    $('.checked').each(function(el) {
      var id = $(this).closest('div').attr("id");
      interests.push(pictures[id]);
    });

    var url = $(this).attr('href');

    $.ajax({
      type: "PUT",
      url: url,
      data: {interests: interests},
      dataType: "JSON"
    }).done(function(jqXhr) {
      window.location.href= '/' + jqXhr.data.url;
    });

  });
});
