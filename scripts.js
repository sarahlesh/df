
$(document).ready(function(){

    // query for DF to be added later
    var queryString = 'method=donate&response_format=json&v=1.0&def_preview=true&billing.address.country=Canada'


// if user has already filled in inputs, get answers from session storage, auto-fill inputs

     // var session_length = sessionStorage.length;
     // if (!(session_length === 0)) {
     //   // Restore the contents of the text field
     //    for(var i=0; i < session_length; i++) {
     //        var key = sessionStorage.key(i);
     //        var value = sessionStorage[key];
     //        $("*[data-param='"+ key +"']").attr("value", value);
     //    }
      
     // }

     // $(".personal-info input").on("change", function(){
     //  // save all input (except credit card choices) incase user comes back later
     //  // TODO: put time stamp of 15 min 
     //   var input_value = this.value
     //   var input_param =  $(this).attr("data-param");
     //   sessionStorage.setItem(input_param, input_value);

     //  });

//if all required fields are done make button blue

$('.required').on("change",function() {
    var empty_flds = 0;
    $(".required").each(function() {
        if(!$.trim($(this).val())) {
            empty_flds++;
        }    
    });

    if (empty_flds) { 
        // do nothing
    } else {
          $(".next.button").removeAttr("disabled");
         $(".next.button").addClass("active");
}
});

// stop all buttons from refreshing pag

$("button").click(function(e){
e.preventDefault();
});

// show payment option when clicking button
$(".personal-info").on("click", ".active", function(){
  $(".billing-info").removeClass("fade");
})

$(".giving-levels").on("click", "label", function(){
  var id = $(this).attr("for");
  $(".giving-desc").addClass("none");
  $("."+id).removeClass("none");
})


// init luminate extend with format and api_key
     luminateExtend.init({
         apiKey: 'ospcaapi', 
         response_format:"json",
         path: {
           nonsecure: ' http://support.ontariospca.ca/site/', 
           secure: 'https://secure3.convio.net/ospca/site/'
         }
       });

     var  form_id;

// run this function when User chooses DF type
     var getDF = function(result){
      console.log(result)
      $("footer").removeClass("none");
      var response = result.getDonationFormInfoResponse;
      var levels = response.donationLevels.donationLevel;
      var fields = response.donationFields.donationField;
      form_id = fields[0].defaultValue;
      // get the form id for the form;
      $(".form_id").attr("value", form_id);
      queryString = queryString + "&form_id=" + form_id;
      // loop trough giving levels and display (this way users can change giving levels)
      $.map(levels, function(n,i){
        var level_id = n.level_id;
        var level_name = n.name
        var radio = '<input type="radio" name="level_id" class="giving" data-param="level_id" id="'+level_id+'" value="'+ level_id + '"" data-value='+ level_id +' required=required><label for="'+ level_id +'">'+ level_name +'</label>'
        $(".giving-levels").append(radio);
        $(".giving-levels").append
        $(".additional_amount").insertAfter(".levels input:last-of-type + label")
      });
     }

  // bring in the proper form when user clicks the button

     $(".onetime").on("click", function(){
      $(".3563").removeClass("none");
      var params = 'method=getDonationFormInfo&response_format=json&form_id=3563&v=1.0&api_key=ospcaapi';

        luminateExtend.api.request({
               api: 'donation', 
               callback: {
                 success: getDF,
                 error: function(){
                  console.log("nope")
                   }
               },
               data: params
           });
     })

    $(".monthly").on("click", function(){
      var params = 'method=getDonationFormInfo&response_format=json&form_id=3560&v=1.0&api_key=ospcaapi';

        luminateExtend.api.request({
               api: 'donation', 
               callback: {
                 success: getDF,
                 error: function(){
                  console.log("nope")
                   }
               },
               data: params
           });
    });

    $(".tribute").on("click", function(){
      var params = 'method=getDonationFormInfo&response_format=json&form_id=3562&v=1.0&api_key=ospcaapi';

        luminateExtend.api.request({
               api: 'donation', 
               callback: {
                 success: getDF,
                 error: function(){
                  console.log("nope")
                   }
               },
               data: params
           });
    });



  //make query string 

var getValues = function(){
  var val = $(".value-check").length;
  for(var i=0; i < val; i++) {
          var inputWithValue = $(".value-check")[i];
          var paramName = $(inputWithValue).data("param");
          var paramValue = $(inputWithValue).val()
          if (paramValue !== "") {
            var words = "&" + paramName + "=" + paramValue;
             queryString = queryString + words
          };
      }
  var radio = $(".radio-check").length;
    for(var i=0; i < radio; i++) {
            var inputWithValue = $(".radio-check input:checked")[i];
            var paramName = $(inputWithValue).data("param");
            var paramValue = $(inputWithValue).data("value")
            var words = "&" + paramName + "=" + paramValue;
            queryString = queryString + words
        }
}

var check = $(".checkbox-check");
if($(check).checked){
    var paramName = 'donor.email_opt_in';
     var paramValue = "true";
     var words = "&" + paramName + "=" + paramValue;
     queryString = queryString + words
   }else{
    var paramName = 'donor.email_opt_in';
     var paramValue = "false";
     var words = "&" + paramName + "=" + paramValue;
     queryString = queryString + words
   }


var submitForm = function(){
luminateExtend.api.request({
           api: 'donation', 
           type : "POST",
           data: queryString,
           callback: {
             success: function(r){
                console.log(r);

             },
             error: function(){
              console.log("nope")
               }
           },
  
       });
  }


// TO DO: enter form validation before submit 
  $("form").on("submit", function(e){
    e.preventDefault();
    getValues();
    queryString = queryString.replace(/\s/g,"%20");
    console.log(queryString);
    submitForm();
    queryString = 'method=donate&response_format=json&v=1.0&def_preview=true&billing.address.country=Canada'
  });


// chat popup code

$(".chat").on("click", function(){
  $(".overlay").fadeIn("fast", function(){
    $(".overlay-content").addClass("animated zoomIn").removeClass("none");
  })
})

 $('html, .overlay .exit').click(function() {
  $(".overlay-content").removeClass("zoomIn").removeClass("animated").addClass("animated zoomOut");
  $(".overlay").fadeOut("fast", function(){
     $(".overlay-content").removeClass("animated zoomOut").addClass("none");
  })
 });

 $('.overlay-content, .chat').click(function(event){
     event.stopPropagation();
 })




     //TODO:

     // thank you page

     window.donateCallback = {
       error: function(data) {
         $('#donation-errors').remove();

         $('.donation-form').prepend('<div id="donation-errors">' + 
                                       '<div class="alert alert-danger">' + 
                                         data.errorResponse.message + 
                                       '</div>' + 
                                     '</div>');

         $('.donation-loading').remove();
         $('.donation-form').show();
       }, 
       success: function(data) {
         $('#donation-errors').remove();

         if(data.donationResponse.errors) {
           $('.donation-form').prepend('<div id="donation-errors">' + 
                                         ((data.donationResponse.errors.message) ? ('<div class="alert alert-danger">' + 
                                           data.donationResponse.errors.message + 
                                         '</div>') : '') + 
                                       '</div>');

           if(data.donationResponse.errors.fieldError) {
             var fieldErrors = luminateExtend.utils.ensureArray(data.donationResponse.errors.fieldError);
             $.each(fieldErrors, function() {
               $('#donation-errors').append('<div class="alert alert-danger">' + 
                                              this + 
                                            '</div>');
             });
           }

           $('.donation-loading').remove();
           $('.donation-form').show();
         }
         else {
           $('.donation-loading').remove();
           $('.donation-form').before('<div class="alert alert-success">' + 
                                        'Your donation has been processed!' + 
                                      '</div>' + 
                                      '<div class="well">' + 
                                        '<p>Thank you for your donation of $' + data.donationResponse.donation.amount.decimal + '.</p>' + 
                                        '<p>Your confirmation code is ' + data.donationResponse.donation.confirmation_code + '.</p>' + 
                                      '</div>');
         }
       }
     };
});