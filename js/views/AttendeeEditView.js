var bb = bb || {};

(function (bb) {
	'use strict';

	bb.AttendeeEditView = Backbone.View.extend({
		tagName: 'form',
		className: 'attendee-edit',
		template: _.template($('#template-AttendeeEditView').html()),

		events: {
			'submit' : 'save',
			'click .js--attendee-edit__cancel': 'cancel',
			'keyup .js--attendee-edit__name input': 'validateName',
		},
		
		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
		},

		render: function () {
			var json = this.model.toJSON();
			json.companions = this.collectionToText(this.model.get('companions'));
			this.$el.html(this.template(json));
			return this;
		},

		save: function(e) {
			e.preventDefault();

			var valid = this.validateName();

			if (valid) {
				var companions = this.modelsFromText(this.$('.js--attendee-edit__companions textarea').val(), bb.Companion);

				this.model.get('companions').reset(companions);

				this.model.set({
					name: this.$('.js--attendee-edit__name input').val(),
					stuff: this.$('.js--attendee-edit__stuff textarea').val(),
				});

				// TODO wait indicator

				return Promise.resolve(this.model.save())
					.then(function () {
						Backbone.history.navigate('/', true);
					}.bind(this), function (error) {
						// TODO error indicator
						console.error(error);
						alert("fail");
						throw error;
					})
				;
			}
		},

		cancel: function () {
			if (this.model.isNew()) {
				this.model.destroy();
			}
			Backbone.history.navigate('/', true);
		},

		validateName: function () {
			var name = this.$('.js--attendee-edit__name input').val();
			
			if (name.length < 1) {
				this.addError(this.$('.js--attendee-edit__name'), 'Bitte Name angeben!');
				return false;
			} else {
				this.removeError(this.$('.js--attendee-edit__name'));
				return true;
			}
		},

		addError: function (element, message) {
			element
				.addClass('input-group--error')
				.find('.input-group__message')
					.text(message)
			;
		},

		removeError: function (element) {
			element
				.removeClass('input-group--error')
				.find('.input-group__message')
					.text('')
			;
		},

		collectionToText: function (collection) {
			return collection
				.map(function (model) {
					return model.get('name');
				})
				.join("\n")
			;
		},

		modelsFromText: function (text, ModelType) {
			return text
				.trim()
				.split("\n")
				.filter(function (name) {
					return !!name.length;
				})
				.map(function (name) {
					return new ModelType({name: name});
				})
			;
		},
	});
}(bb));