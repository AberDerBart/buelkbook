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
		},
		
		initialize: function (options) {
			this.listenTo(this.model, 'change', this.render);

			this.companionCollectionEditView = new bb.CompanionCollectionEditView({
				collection: this.deepClone(this.model.get('companions')),
				options: options.options,
				meals: options.meals,
			});

			this.listenTo(this.companionCollectionEditView.collection, 'change add remove reset sort', this.validateCompanions);
		},

		render: function () {
			var json = this.model.toJSON();
			json.isNew = !!this.model.isNew();
			this.$el.html(this.template(json));

			this.companionCollectionEditView.setElement(this.$('.js--attendee-edit__companions__collection'));
			this.companionCollectionEditView.render();

			return this;
		},

		save: function(e) {
			e.preventDefault();

			var valid = this.validateCompanions();

			if (valid) {
				var companions = this.companionCollectionEditView.getCompanions();
				this.model.get('companions').reset(companions);

				this.model.set({
					stuff: this.$('.js--attendee-edit__stuff textarea').val(),
					comment: this.$('.js--attendee-edit__comment textarea').val()
				});

				// TODO wait indicator

				return Promise.resolve(this.model.save())
					.then(_.bind(function () {
						Backbone.history.navigate('/', true);
					}, this), function (error) {
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

		validateCompanions: function () {
			var companions = this.companionCollectionEditView.getCompanions();
			
			if (companions.length < 1) {
				this.addError(this.$('.js--attendee-edit__companions'), 'Bitte mindestens eine Person angeben!');
				return false;
			} else {
				this.removeError(this.$('.js--attendee-edit__companions'));
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
		
		deepClone: function (collection) {
			var clonedContents = collection.map(function (model) {
				return new model.constructor(model.toJSON());
			});
			return new collection.constructor(clonedContents, collection.options);
		},
	});
}(bb));