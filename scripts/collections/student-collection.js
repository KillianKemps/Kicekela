var StudentCollection = Backbone.Collection.extend({
  localStorage: new Backbone.LocalStorage("StudentCollection"),
  model: StudentModel
});
