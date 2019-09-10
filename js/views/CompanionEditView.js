var bb = bb || {};

(function (bb) {
	'use strict';

	bb.CompanionEditView = Backbone.View.extend({
		tagName: 'div',
		className: 'companion-edit',
		template: _.template($('#template-CompanionEditView').html()),

		events: {
			'keyup .js--companion-edit__name': 'updateName',
			'focusout .js--companion-edit__name': 'deleteIfEmpty',
			'change .js--companion-edit__canceled': 'updateCanceled',
		},

		initialize: function (options) {
			this.options = options.options;
			this.meals = options.meals;
			
			this.optionCollectionView = new bb.OptionCollectionView({
				collection: this.options,
				companion: this.model,
			});
			this.mealCollectionView = new bb.MealCollectionCheckboxView({
				collection: this.meals,
				companionMeals: this.model.get('meals'),
			});

			if (this.model.get('canceled')) {
				this.$el.addClass('companion-edit--canceled');
			}
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));

			this.optionCollectionView.setElement(this.$('.js--companion-edit__option__select'));
			this.optionCollectionView.render();

			this.mealCollectionView.setElement(this.$('.js--companion-edit__meals'));
			this.mealCollectionView.render();

			return this;
		},

		updateName: function () {
			this.model.set('name', this.$('.js--companion-edit__name').val().trim());
		},

		deleteIfEmpty: function () {
			var lastInCollection = this.model.collection.indexOf(this.model) == this.model.collection.length - 1
			if (!lastInCollection && this.model.get('name') == '') {
				this.model.destroy();
			}
		},

		updateCanceled: function () {
			var canceled = this.$('.js--companion-edit__canceled').is(":checked");
			this.model.set('canceled', canceled);
			this.$el.toggleClass('companion-edit--canceled', canceled);
		},
	});
}(bb));