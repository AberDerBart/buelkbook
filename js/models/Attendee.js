var bb = bb || {};

(function (bb) {
	'use strict';

	bb.Attendee = Backbone.RelationalModel.extend({
		defaults: {
			id: null,
			name: "",
			stuff: "",
		},

		relations: [{
			type: Backbone.HasMany,
			key: 'companions',
			relatedModel: 'bb.Companion',
			collectionType: 'Backbone.Collection',
		}, {
			type: Backbone.HasOne,
			key: 'option',
			relatedModel: 'bb.Option',
			includeInJSON: Backbone.Model.prototype.idAttribute,
		}],

		urlRoot: '/api/attendee',
	});
}(bb));