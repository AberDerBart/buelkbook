var bb = bb || {};

(function (bb) {
	'use strict';

	bb.MealCheckboxView = Backbone.View.extend({
		tagName: 'label',
		className: 'companion-edit__input-group companion-edit__input-group--checkbox',
		template: _.template($('#template-MealCheckboxView').html()),

		events: {
			'change input': 'updateCompanionMeals',
		},

		initialize: function (options) {
			this.listenTo(this.model, 'change', this.render);
			this.companionMeals = options.companionMeals;
		},

		render: function () {
			var json = this.model.toJSON();
			json.checked = this.companionMeals.contains(this.model);
			this.$el.html(this.template(json));
			return this;
		},

		updateCompanionMeals: function () {
			if (this.$('input').prop('checked')) {
				this.companionMeals.add(this.model);
			} else {
				this.companionMeals.remove(this.model);
			}
		},
	});
}(bb));