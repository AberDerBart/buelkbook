var bb = bb || {};

(function (bb) {
	'use strict';

	bb.Companion = Backbone.RelationalModel.extend({
		defaults: {
			name: "",
			canceled: false,
		},

		relations: [{
			type: Backbone.HasOne,
			key: 'option',
			relatedModel: 'bb.Option',
			includeInJSON: Backbone.Model.prototype.idAttribute,
		}, {
			type: Backbone.HasMany,
			key: 'meals',
			relatedModel: 'bb.Meal',
			includeInJSON: Backbone.Model.prototype.idAttribute,
		}],
	});
}(bb));