var Select;

module.exports = Select = {
  create: function() {
    var instance = Object.assign({}, this.prototype);

    this.init.apply(instance, arguments);

    return instance;
  },

  init: function(params) {
    this.events = $({});
    this.options = params.options || [];
    this.value = '';

    if (params.elem) {
      // select tag in DOM
      this.$select = $(params.elem);

      // read values from DOM
      this.$select.children().each(function(index, elem) {
        this.options.push({
          value: elem.value,
          label: elem.innerText
        });
      }.bind(this));
    }
    else {
      // select created programmatically
      this.$select = $('<select name="' + params.name + '"></select>');

      this.options.forEach(function(option) {
        this.$select.append('<option value="' + option.value + '">' + option.label + '</option>');
      }.bind(this));
    }

    this.$select.hide();

    this.placeholder = params.placeholder || this.options.shift().label;

    // wrapper
    this.$select.wrap('<div class="c-select"></div>');
    this.$wrapper = this.$select.closest('.c-select');

    // input
    this.$input = $('<input class="c-select__input" type="text" />');
    this.$input.attr('placeholder', this.placeholder);
    this.$wrapper.append(this.$input);

    var icon = [
      '<div class="c-select__icon">',
        '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="28" viewBox="0 0 16 28">',
          '<path d="M16 11c0 0.266-0.109 0.516-0.297 0.703l-7 7c-0.187 0.187-0.438 0.297-0.703 0.297s-0.516-0.109-0.703-0.297l-7-7c-0.187-0.187-0.297-0.438-0.297-0.703 0-0.547 0.453-1 1-1h14c0.547 0 1 0.453 1 1z"><\/path>',
        '</svg>',
      '</div>'
    ].join('\n');

    this.$wrapper.append(icon);

    this.$input.on('focus', function() {
      this.showDropdown();
    }.bind(this));
    this.$input.on('blur', function() {
      this.hideDropdown();
    }.bind(this));

    // dropdown
    this.$dropdown = $('<ul class="c-select__dropdown"></ul>');
    this.options.forEach(function(option) {
      this.$dropdown.append('<li class="c-select__dropdown__item" data-value="' + option.value + '">' + option.label + '</li>');
    }.bind(this));
    this.$wrapper.append(this.$dropdown);

    this.$dropdown.on('mousedown', function(e) {
      e.preventDefault();
    });

    this.$dropdown.on('click', 'li', function(e) {
      var value = e.currentTarget.dataset.value;
      var label = e.currentTarget.innerText;

      this.update({
        label: label,
        value: value
      });

      this.$input.trigger('blur');
    }.bind(this));
  },

  prototype: {
    appendTo: function(elem) {
      this.$wrapper.appendTo(elem);
    },

    on: function(eventName, callback) {
      this.events.on(eventName, callback);
    },

    update: function(updated) {
      this.value = updated.value;

      this.$input.val(updated.label);
      this.$select.val(this.value);

      if (this.value) {
        this.events.trigger('change', this.value);
      }
    },

    reset: function() {
      this.update({
        label: '',
        value: ''
      });

      this.events.trigger('reset');
    },

    showDropdown: function() {
      this.isOpen = true;
      this.$dropdown.addClass('is-visible');
    },

    hideDropdown: function() {
      this.isOpen = false;
      this.$dropdown.removeClass('is-visible');
    },

    destroy: function() {
      this.$wrapper.remove();
      this.$wrapper = null;
    }
  }
};
