// Custom multifilter buttons on top of original MixItUp plugin
var mixedFilter = {

    $filters: null,
    $reset: null,
    groups: [],
    outputArray: [],
    outputString: '',
 
    init: function(){
 
        var self = this;
 
        self.$filters = $('#Filters');
        self.$container = $('#Container');
        self.$filters.find('fieldset').each(function(){
 
          var $this = $(this);
 
            self.groups.push({
 
                $inputsCheckbox : $this.find('input'),
                $inputsSelect : $this.find('select'),
                active: "[]",
               tracker: false
            });
        });
        self.bindHandlers();
    },

    // The bindHandlers method will listen for whenever a button is clicked.
    bindHandlers: function(){
 
        var self = this;
 
        // Handle input clicks
        self.$filters.on('change', function(e) {
 
            e.preventDefault();
 
            self.parseFilters();
        });
 
    },
 
 
    // The parseFilters method checks which filters are active in each group:
 
    parseFilters: function() {
 
        var self = this;
 
        for(var i = 0, group; group = self.groups[i]; i++){
          group.active = []; // reset arrays
          var activeSelect = group.$inputsSelect.length ? group.$inputsSelect.val()  || '' : '';
 group.$inputsCheckbox.each(function(){
             $(this).is(':checked') && group.active.push(this.value);
           });
             group.active.length && (group.tracker = 0);
 
          group.active = group.active+activeSelect;
 
        }
        self.concatenate();
 
    },
 
    // The "concatenate" method will crawl through each group, concatenating filters as desired:
 
    concatenate: function(){
        var self = this;
 
        self.outputString = ''; // Reset output string
 
        for(var i = 0, group; group = self.groups[i]; i++){
          self.outputString += group.active;
        }
 
        // If the output string is empty, show all rather than none:
        !self.outputString.length && (self.outputString = 'all');
 
        console.log(self.outputString);
 
        // ^ we can check the console here to take a look at the filter string that is produced
 
        // Send the output string to MixItUp via the 'filter' method:
        if(self.$container.mixItUp('isLoaded')){
            self.$container.mixItUp('filter', self.outputString);
        }
    }
    

 };
 

 // reset filters
 function uncheck(){
    var uncheck=document.getElementsByTagName('input');
    for(var i=0;i<uncheck.length;i++){
        if(uncheck[i].type=='checkbox'){
            uncheck[i].checked=false;
            $('#Container').mixItUp('filter', 'all');
        }
    }
}


//Init for pagination by using Jpages plugin
var pagination = $('.pagination');

function setPagination(){
	 pagination.jPages({
     containerID: 'Container',
     perPage: 8,
     startPage: 1,
     startRange: 1,
     midRange: 3,
     endRange: 1,
     first: false,
     last: false
   });
}

function destroyPagination() {
  pagination.jPages('destroy');
};

setPagination();

 
//Init of original MixItUp plugin
 $(function(){
  mixedFilter.init();
 
  // Init MixItUp
  $('#Container').mixItUp({
    /*animation: {
        enable: false
    },*/
    controls: {
      enable: false // we won't be needing these because they are being overuled by custom filtering buttons
    },
    //Callback necessary for loading Jpages Pagination on load
    callbacks: {
        onMixLoad: function(state,futureState ){
          console.log('mix Loaded');
          //setPagination();
        },
        onMixStart: function(state,futureState ){
          destroyPagination();
        },
            onMixEnd: function(state, futureState){
                console.log('mix End');
          setPagination();
            }
        }
  });
 
  //filter items by input searchfield
  var inputText;
  var $matching = $();
  var delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
  })();
  $("input[type='text']").keyup(function(){
      // Delay function invoked to make sure user stopped typing
      delay(function(){
        inputText = $("input[type='text']").val().toLowerCase();
        // Check to see if input field is empty
        if ((inputText.length) > 0) {
            $('.mix').each(function() {
              var $this = $(this);
              // add item to be filtered out if input text matches items inside the title
              if($(this).children('.title').text().toLowerCase().match(inputText)) {
                  $matching = $matching.add(this);
              }
              else {
                  // removes any previously matched item
                  $matching = $matching.not(this);
              }
            });
            $('#Container').mixItUp('filter', $matching);
        } else {
            // resets the filter to show all item if input is empty
            $('#Container').mixItUp('filter', 'all');
        }
      }, 200 );
  });
 });
