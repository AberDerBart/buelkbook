var bb = bb || {};

(function (bb) {
	'use strict';

	bb.OptionView = Backbone.View.extend({
		tagName: 'option',
		template: _.template('<%- id %>'),

		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.attr('value', this.model.get('id'));
			return this;
		},
	});
}(bb));