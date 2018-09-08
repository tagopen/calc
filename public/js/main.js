'use strict';

(function($, sr) {
  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function debounce(func, threshold, execAsap) {
    var timeout = void 0;

    return function debounced() {
      var obj = this;
      var args = arguments;
      function delayed() {
        if (!execAsap) {
          func.apply(obj, args);
        }

        timeout = null;
      }

      if (timeout) {
        clearTimeout(timeout);
      } else if (execAsap) {
        func.apply(obj, args);
      }

      timeout = setTimeout(delayed, threshold || 100);
    };
  };
  // smartresize
  jQuery.fn[sr] = function(fn) {
    return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
  };
})(jQuery, 'smartresize');

// ================================================================================== //

// # Document on Ready
// # Document on Resize
// # Document on Scroll
// # Document on Load

// # Old browser notification
// # Anchor scroll
// # Phone masked input
// # Ajax form send
// # Basic Elements

// ================================================================================== //

var GRVE = GRVE || {};

(function($) {
  // # Document on Ready
  // ============================================================================= //
  GRVE.documentReady = {
    init: function init() {
      GRVE.outlineJS.init();
      GRVE.anchorScroll.init('a[data-scroll][href*="#"]:not([href="#"])');
      GRVE.pageSettings.init();
      GRVE.basicElements.init();
      GRVE.phoneMask.init();
      GRVE.ajax.init();
    }
  };

  // # Document on Resize
  // ============================================================================= //
  GRVE.documentResize = {
    init: function init() {}
  };

  // # Document on Scroll
  // ============================================================================= //
  GRVE.documentScroll = {
    init: function init() {}
  };

  // # Document on Load
  // ============================================================================= //
  GRVE.documentLoad = {
    init: function init() {}
  };

  // # Remove outline on focus
  // ============================================================================= //
  GRVE.outlineJS = {
    init: function init() {
      var self = this;

      (this.styleElement = document.createElement('STYLE')),
        (this.domEvents = 'addEventListener' in document);

      document.getElementsByTagName('HEAD')[0].appendChild(this.styleElement);

      // Using mousedown instead of mouseover, so that previously focused elements don't lose focus ring on mouse move
      this.eventListner('mousedown', function() {
        self.setCss(':focus{outline:0 !important}');
      });

      this.eventListner('keydown', function() {
        self.setCss('');
      });
    },
    setCss: function setCss(css_text) {
      // Handle setting of <style> element contents in IE8
      !!this.styleElement.styleSheet
        ? (this.styleElement.styleSheet.cssText = css_text)
        : (this.styleElement.innerHTML = css_text);
    },
    eventListner: function eventListner(type, callback) {
      // Basic cross-browser event handling
      if (this.domEvents) {
        document.addEventListener(type, callback);
      } else {
        document.attachEvent('on' + type, callback);
      }
    }
  };

  // # Check window size in range
  // ============================================================================= //
  GRVE.isWindowSize = {
    init: function init() {
      var min =
        arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : undefined;
      var max =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : undefined;

      var media = void 0;

      if (min !== undefined && max !== undefined) {
        media = matchMedia(
          'only screen and (min-width: ' +
            min +
            'px) and (max-width: ' +
            max +
            'px)'
        );
      } else if (min !== undefined && max === undefined) {
        media = matchMedia('only screen and (min-width: ' + min + 'px)');
      } else if (min === undefined && max !== undefined) {
        media = matchMedia('only screen and (max-width: ' + max + 'px)');
      } else {
        return true;
      }

      return media.matches;
    }
  };

  // # Anchor scrolling effect
  // ============================================================================= //
  GRVE.anchorScroll = {
    init: function init(selector) {
      var _this = this;

      var $selector = $(selector);

      if (!$selector.length) return;

      $selector.on('click', function() {
        if (
          location.pathname.replace(/^\//, '') ==
            _this.pathname.replace(/^\//, '') &&
          location.hostname == _this.hostname
        ) {
          var target = $(_this.hash);
          target = target.length
            ? target
            : $('[name=' + _this.hash.slice(1) + ']');

          if (target.length) {
            $('html, body').animate(
              {
                scrollTop: target.offset().top + 3
              },
              1000
            );
            return false;
          }
        }
      });
    }
  };

  // # Phone masked input
  // ============================================================================= //
  GRVE.phoneMask = {
    init: function init() {
      $('[type="tel"]').mask('+38 (099) 999 99 99');
    }
  };

  // # Phone masked input
  // ============================================================================= //
  GRVE.ionRange = {
    init: function init() {
      $('#c-info__range').ionRangeSlider({
        type: 'single',
        grid: true,
        values: [250, 350, 450],
        hide_min_max: true
      });
    }
  };

  // # Ajax send Form
  // ============================================================================= //
  GRVE.ajax = {
    init: function init() {
      var self = this;
      var parsleyOptions = {
        excluded:
          'input[type=button], input[type=submit], input[type=reset], [disabled]',
        successClass: 'form-group--success',
        errorClass: 'form-group--error',
        errorsMessagesDisabled: true,
        minlength: 2,
        classHandler: function classHandler(el) {
          return el.$element.closest('.form-group');
        }
      };
      this.customValidation();
      var $forms = $('.js-form');

      if (!$forms.length) return false;
      $forms.parsley(parsleyOptions);
      $forms.on('submit', function(e) {
        var $form = $(this);
        $form.parsley().validate();

        if ($form.parsley().isValid()) {
          self.send($(this));
        }

        e.preventDefault();
      });
    },
    send: function send($form) {
      var self = this;

      var isWP = $form.is('[data-form-ajax="wp"]');
      var $submit = $form.find('[type=submit]');
      var url = isWP ? '/wp-admin/admin-ajax.php' : $form.attr('action');
      var type = $form.attr('method') ? $form.attr('method') : 'post';
      var data = new FormData($form[0]);
      var formName = $submit.val();
      var redirect = $form.data('redirect');

      this.$result = $form.find('.result');
      this.$submit = $submit;

      isWP && data.append('action', 'site_form');
      data.append('form', formName);

      $.ajax({
        url: url,
        type: type,
        data: data,
        dataType: 'json',
        processData: false,
        contentType: false,
        cache: false,
        beforeSend: function beforeSend() {
          self.progress('hide');
        },
        complete: function complete() {
          self.progress('show');
        },
        success: function success(data) {
          if (!data.success) {
            var error =
              'Возникли проблемы с сервером. Сообщите нам о ошибке, мы постараемся устранить её в ближайшее время.';
            console.log(error);
            self.submitFail(error);
          } else if (data.success) {
            $('.modal').modal('hide');
            $('#success').modal('show');
            if (redirect || data.redirect) {
              document.location.href = redirect;
            }
            $form.trigger('reset');
          }
        },
        error: function error(XMLHttpRequest, textStatus, errorThrown) {
          self.submitFail(textStatus || errorThrown);
        }
      });
    },
    submitFail: function submitFail(msg) {
      this.alert(msg, 'danger');
      return false;
    },
    submitDone: function submitDone(msg) {
      this.alert(msg, 'success');
      return true;
    },
    alert: function alert(msg, status) {
      var self = this;
      var $alert =
        '<div class="alert alert-' +
        status +
        ' alert-dismissable fade show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times</span></button>' +
        msg +
        '</div>';

      this.$result.html($alert);
      if (status === 'success') {
        setTimeout(function() {
          self.$result.slideUp(function() {
            self.$result.html('');
          });
        }, 3000);
      }
    },
    progress: function progress(status) {
      if (status === 'hide') {
        this.$submit.prop('disabled', true);
      } else if (status === 'show') {
        this.$submit.prop('disabled', false);
      }
    },
    customValidation: function customValidation() {
      window.Parsley.addValidator('robots', {
        validateString: function validateString(value) {
          return value === '' ? true : false;
        }
      });
    }
  };

  // # Page Settings
  // ============================================================================= //
  GRVE.pageSettings = {
    init: function init() {
      this.svgPolifill();
      //this.rangeSlider("[data-range-slider]")
    },
    svgPolifill: function svgPolifill() {
      svg4everybody();
    },
    rangeSlider: function rangeSlider(target) {
      var $rangeSlider = $(target);

      var min = parseInt($rangeSlider.attr('min'))
        ? parseInt($rangeSlider.attr('min'))
        : 0;
      var max = parseInt($rangeSlider.attr('max'))
        ? parseInt($rangeSlider.attr('max'))
        : 1;
      var step = parseInt($rangeSlider.attr('step'))
        ? parseInt($rangeSlider.attr('step'))
        : 1;
      var from = parseInt($rangeSlider.attr('value'))
        ? parseInt($rangeSlider.attr('value'))
        : 0;

      $rangeSlider.ionRangeSlider({
        type: 'single',
        grid: false,
        step: step,
        min: min,
        max: max,
        from: from,
        hide_min_max: true
      });
    }
  };

  // # Basic Elements
  // ============================================================================= //
  GRVE.basicElements = {
    init: function init() {},
    carousel: function carousel() {
      var $element = $('.js-carousel');

      $element.each(function() {
        var $carousel = $(this);
        var $nextNav = $carousel.find('.js-carousel-next');
        var $prevNav = $carousel.find('.js-carousel-prev');
        var sliderSpeed = parseInt($carousel.attr('data-slider-speed'))
          ? parseInt($carousel.attr('data-slider-speed'))
          : 3000;
        var pagination =
          $carousel.attr('data-pagination') != 'no' ? true : false;
        var paginationSpeed = parseInt($carousel.attr('data-pagination-speed'))
          ? parseInt($carousel.attr('data-pagination-speed'))
          : 400;
        var autoHeight =
          $carousel.attr('data-slider-autoheight') == 'yes' ? true : false;
        var autoPlay =
          $carousel.attr('data-slider-autoplay') != 'no' ? true : false;
        var sliderPause =
          $carousel.attr('data-slider-pause') == 'yes' ? true : false;
        var loop = $carousel.attr('data-slider-loop') != 'no' ? true : false;
        var itemNum = parseInt($carousel.attr('data-items'));
        var tabletLandscapeNum = $carousel.attr('data-items-tablet-landscape')
          ? parseInt($carousel.attr('data-items-tablet-landscape'))
          : 3;
        var tabletPortraitNum = $carousel.attr('data-items-tablet-portrait')
          ? parseInt($carousel.attr('data-items-tablet-portrait'))
          : 3;
        var mobileNum = $carousel.attr('data-items-mobile')
          ? parseInt($carousel.attr('data-items-mobile'))
          : 1;
        var gap =
          $carousel.hasClass('js-with-gap') &&
          !isNaN($carousel.data('gutter-size'))
            ? Math.abs($carousel.data('gutter-size'))
            : 0;

        // Carousel Init
        $carousel.owlCarousel({
          loop: loop,
          autoplay: autoPlay,
          autoplayTimeout: sliderSpeed,
          autoplayHoverPause: sliderPause,
          smartSpeed: 500,
          dots: pagination,
          responsive: {
            0: {
              items: mobileNum
            },
            768: {
              items: tabletPortraitNum
            },
            1024: {
              items: tabletLandscapeNum
            },
            1200: {
              items: itemNum
            }
          },
          margin: gap
        });

        $carousel.css('visibility', 'visible');

        // Go to the next item
        $nextNav.click(function() {
          $carousel.trigger('next.owl.carousel');
        });
        // Go to the previous item
        $prevNav.click(function() {
          $carousel.trigger('prev.owl.carousel');
        });
      });
    },
    wowjs: function wowjs() {
      var wow = new WOW({
        boxClass: 'js-wow', // animated element css class (default is wow)
        animateClass: 'animated', // animation css class (default is animated)
        offset: 0, // distance to the element when triggering the animation (default is 0)
        mobile: false // trigger animations on mobile devices (true is default)
      });
      wow.init();
    },
    countdown: function countdown() {
      $('[data-countdown]').each(function() {
        var $this = $(this);
        var finalDate = $this.data('countdown');
        var delimeter =
          !!$this.data('countdown-delimeter') == true ? ':' : null;
        var hoursCount = $this.data('countdown-hours');
        var countdownFormat = $this.data('countdown-format').split('|');
        var countdownItems = '';
        var text = '';

        $.each(countdownFormat, function(index, value) {
          switch (value) {
            case 'w':
              text = 'Недель';
              break;
            case 'D':
            case 'd':
            case 'n':
              text = 'Дней';
              break;
            case 'H':
              text = 'Часов';
              break;
            case 'M':
              text = 'Минут';
              break;
            case 'S':
              text = 'Секунд';
              break;
            default:
              text = '';
          }

          countdownItems += '<div class="timer__item">';
          countdownItems += '<div class="timer__time">%' + value + '</div>';
          countdownItems += '<div class="timer__text">' + text + '</div>';
          countdownItems += '</div>';

          if (index === countdownFormat.length - 1) {
            return;
          }

          if (delimeter) {
            countdownItems += '<div class="timer__item">';
            countdownItems +=
              '<div class="timer__time">' + delimeter + '</div>';
            countdownItems += '</div>';
          }
        });

        $this.countdown(finalDate, function(event) {
          if (hoursCount) {
            var hours = event.offset.totalDays * 24 + event.offset.hours;
            countdownItems = countdownItems.replace('%H', hours);
          }

          $(this).html(event.strftime(countdownItems));
        });
      });
    }
  };

  $(document).ready(function() {
    GRVE.documentReady.init();
  });
  $(window).smartresize(function() {
    GRVE.documentResize.init();
  });
  $(window).on('load', function() {
    GRVE.documentLoad.init();
  });
  $(window).on('scroll', function() {
    GRVE.documentScroll.init();
  });
})(jQuery);
