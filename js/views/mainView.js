 /*
 * Copyright (C) 2015 Marcin Bychawski
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
window.MainView = (function() {
    return Backbone.View.extend({
        tagName    : 'div',

        initialize : function(options) {
            var self = this;
            this.render();
        },

        render : function() {
            var self = this;
            this.$el.html( templates.mainView() );
            return this;
        }
    });
})();