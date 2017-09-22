var bb = bb || {};

(function (bb) {
	'use strict';

	bb.Meal = Backbone.RelationalModel.extend({
		defaults: {
			id: '',
		},
	});
}(bb));