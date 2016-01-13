var StudentListView = Backbone.View.extend({

  el: '#app',

  events: {
    'submit form': 'addStudent',
    'change input[type="radio"]': 'checkStudent'
  },

  addStudent: function(event) {
    // Kill submit event
    event.preventDefault();

    var $form = $(event.currentTarget);
    var $studentName = $form.find('.student-name');
    var $studentSurname = $form.find('.student-surname');

    var newStudentModel = new StudentModel({
      name: $studentName.val(),
      surname: $studentSurname.val()
    });

    $studentName.val('');
    $studentSurname.val('');

    this.allStudentsCollection.add(newStudentModel);

    newStudentModel.save();

    this.render();
  },

  checkStudent: function(event) {
    var $input = $(event.currentTarget);
    var inputValue = $input.val();

    var studentId = $input.parents('li').attr('data-id');

    var targetModel = this.allStudentsCollection.findWhere({
      id: studentId
    });

    if(targetModel) {
      targetModel.set({
        present: inputValue === 'present'
      });
      targetModel.save();
    }

    this.render();
  },

  getTemplate: function(studentData) {
    var isPresentChecked = '';
    var isNotPresentChecked = 'checked';

    if(studentData.present) {
      isPresentChecked = 'checked';
      isNotPresentChecked =  '';
    }

    var studentTemplate = '\
      <li data-id="' + studentData.id + '">\
        <p>' + studentData.surname + ' ' + studentData.name + '</p>\
        <form>\
          <label for="present">Present</label>\
          <input ' + isPresentChecked + ' type="radio" class="student-present" name="student" value="present">\
          <label for="absent">Absent</label>\
          <input ' + isNotPresentChecked + ' type="radio" class="student-absent" name="student" value="absent">\
        </form>\
      </li>\
    ';

    return $(studentTemplate);
  },

  initialize: function() {
    this.allStudentsCollection = new StudentCollection();

    this.allStudentsCollection.fetch();

    this.render();
  },

  render: function() {
    var $renderTarget = this.$('.student-list');

    var $studentTotal = this.$('.student-total');
    var $studentPresentTotal = this.$('.student-present-total');
    var $studentAbsentTotal = this.$('.student-absent-total');

    $renderTarget.empty();

    var allStudents = this.allStudentsCollection.toJSON();

    var presentStudents = 0;

    for (var i = 0; i < allStudents.length; i++) {
      var student = allStudents[i];

      if(student.present) {
        presentStudents++;
      }

      var studentTemplate = this.getTemplate(student);

      $renderTarget.append(studentTemplate);
    }

    $studentTotal.text(allStudents.length);
    $studentPresentTotal.text(presentStudents);
    $studentAbsentTotal.text(allStudents.length - presentStudents);
  }
});
