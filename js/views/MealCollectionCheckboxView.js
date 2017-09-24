var bb = bb || {};

(function (bb) {
	'use strict';

	bb.MealCollectionCheckboxView = bb.ACollectionView.extend({
		initialize: function (options) {
			this._super.apply(this, arguments);
			
			this.companionMeals = options.companionMeals;
		},

		createView: function (model) {
			return new bb.MealCheckboxView({
				model: model,
				companionMeals: this.companionMeals,
			});
		},
	});
}(bb));