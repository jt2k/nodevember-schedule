// Sort schedule into time slots
_.each(schedule, function(day) {
  var timeSlots = new Backbone.Collection();
  _.each(day.slots, function(slot) {
    var timeString = slot.time;
    // Normalize times - one was missing a space in between time and am/pm
    if (matches = timeString.match(/(\d+:\d+)(am|pm)/i)) {
      timeString = matches[1] + ' ' + matches[2];
    }
    var timeSlot = timeSlots.get(timeString);
    if (!timeSlot) {
      timeSlot = timeSlots.add({ 'id': timeString, 'time': timeString });
    }
    if (!timeSlot.items) {
      timeSlot.items = [slot];
    } else {
      timeSlot.items.push(slot);
    }
  });
  day.groupedSlots = timeSlots;
});

// Remove Friday
schedule = _.rest(schedule);

// Retrieve saved schedule
var mine = JSON.parse(localStorage.getItem('myNodevemberSchedule')) || {};
if (!mine.Saturday) {
  mine.Saturday = {};
}
if (!mine.Sunday) {
  mine.Sunday = {};
}

// Define view
var ScheduleView = Backbone.View.extend({
  el: $('#schedule'),
  events: {
    'click a.show-details': 'showDetails',
    'click a.select-item': 'selectItem'
  },
  initialize: function() {
    this.render();
  },
  render: function() {
    var self = this;
    var dayTemplate = _.template($('#day-template').html());
    this.$el.empty();
    this.collection.each(function(day) {
      self.$el.append(dayTemplate({ day: day, mine: mine }));
    });
  },
  showDetails: function(e) {
    e.preventDefault();
    var content = $(e.currentTarget).closest('td').find('.summary').html();
    if (!content.trim()) {
      content = '<em>No summary available</em>';
    }
    $('#summary-modal .modal-title').text($(e.currentTarget).text());
    $('#summary-modal .modal-body').html(content);
    $('#summary-modal').modal();
  },
  selectItem: function(e) {
    e.preventDefault();
    var $a = $(e.currentTarget);
    var cell = $a.data();
    var selected = $a.find('span.glyphicon').is('.glyphicon-check');
    $a.closest('tr').find('td').removeClass('info');
    $a.find('span.glyphicon').toggleClass('glyphicon-check').toggleClass('glyphicon-unchecked');
    if (selected) {
      mine[cell.day][cell.time] = null;
    } else {
      $a.closest('td').addClass('info');
      mine[cell.day][cell.time] = cell.room;
    }
    localStorage.setItem('myNodevemberSchedule', JSON.stringify(mine));
  }
});

// Create view
var scheduleView = new ScheduleView({
  collection: new Backbone.Collection(schedule)
});
