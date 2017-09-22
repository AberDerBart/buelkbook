var bb = bb || {};

(function (bb) {
	'use strict';

	bb.MealCollection = Backbone.Collection.extend({
		model: bb.Meal,
		url: '/api/meal',
	});
}(bb));