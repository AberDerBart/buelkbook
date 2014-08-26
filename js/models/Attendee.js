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
		}],

		urlRoot: '/api/attendee',
	});
}(bb));