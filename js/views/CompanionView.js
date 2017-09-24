var bb = bb || {};

(function (bb) {
	'use strict';

	bb.CompanionView = Backbone.View.extend({
		tagName: 'li',
		template: _.template('<%- name %> <em><%- meals %></em>'),

		initialize: function (options) {
			this.meals = options.meals;

			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model.get('meals'), 'add remove reset sort', this.render);
		},

		render: function () {
			var mealParticipations = this.meals.map(function (meal) {
				return {
					short: meal.get('short'),
					part: this.model.get('meals').contains(meal),
				}
			}, this);

			var meals;

			var noMeals = _.every(mealParticipations, function (mealPart) {
				return !mealPart.part;
			});

			var allMeals = _.every(mealParticipations, function (mealPart) {
				return mealPart.part;
			});

			if (allMeals) {
				meals = "";
			} else if (noMeals) {
				meals = "(keine)";
			} else {
				var start, end;
				var list = [[]];
				_.forEach(mealParticipations, function (mealPart) {
					var cur = list[list.length - 1];
					if (mealPart.part) {
						if (cur.length == 0) {
							cur[0] = mealPart.short;
						} else {
							cur[1] = mealPart.short;
						}
					} else {
						if (cur.length != 0) {
							list.push([]);
						}
					}
				});
				if (list[list.length - 1].length == 0) {
					list.pop();
				}
				meals = '(' + _.map(list, function (el) { 
					return el.join(' - ');
				}).join('; ') + ')';
			}

			var json = this.model.toJSON();
			json.meals = meals;

			this.$el.html(this.template(json));
			return this;
		},
	});
}(bb));