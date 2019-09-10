var bb = bb || {};

(function (bb) {
	'use strict';

	bb.Attendee = Backbone.RelationalModel.extend({
		defaults: {
			id: null,
			stuff: "",
			comment: "",
		},

		relations: [{
			type: Backbone.HasMany,
			key: 'companions',
			relatedModel: 'bb.Companion',
			collectionType: 'Backbone.Collection',
		}],

		urlRoot: '/api/attendee',

		getAttendingCompanions: function() {
			return this.get('companions').filter(c => !c.get('canceled'))
		},

		getCanceledCompanions: function() {
			return this.get('companions').filter(c => c.get('canceled'))
		}
	});
}(bb));