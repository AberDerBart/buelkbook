var bb = bb || {};

(function (bb) {
	'use strict';

	bb.CompanionView = Backbone.View.extend({
		tagName: 'li',
		template: _.template('<%- name %>'),

		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
	});
}(bb));