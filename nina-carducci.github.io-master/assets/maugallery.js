(function($) {
  $.fn.mauGallery = function(options) {
    var settings = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function() {
      var $gallery = $(this);
      $.fn.mauGallery.methods.createRowWrapper($gallery);
      if (settings.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $gallery,
          settings.lightboxId,
          settings.navigation
        );
      }
      $.fn.mauGallery.listeners($gallery, settings);

      $gallery.children(".gallery-item").each(function(index) {
        $.fn.mauGallery.methods.responsiveImageItem($(this));
        $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
        $.fn.mauGallery.methods.wrapItemInColumn($(this), settings.columns);
        var theTag = $(this).data("gallery-tag");
        if (
          settings.showTags &&
          theTag !== undefined &&
          tagsCollection.indexOf(theTag) === -1
        ) {
          tagsCollection.push(theTag);
        }
      });

      if (settings.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $gallery,
          settings.tagsPosition,
          tagsCollection
        );
      }

      $gallery.fadeIn(500);
    });
  };
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };
  $.fn.mauGallery.listeners = function($gallery, settings) {
    $gallery.on("click", ".gallery-item", function() {
      if (settings.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), settings.lightboxId);
      } else {
        return;
      }
    });

    $gallery.on("click", ".nav-link", function() {
      $.fn.mauGallery.methods.filterByTag($gallery, $(this));
    });
    $gallery.on("click", ".mg-prev", function() {
      $.fn.mauGallery.methods.prevImage($gallery, settings.lightboxId);
    });
    $gallery.on("click", ".mg-next", function() {
      $.fn.mauGallery.methods.nextImage($gallery, settings.lightboxId);
    });
  };
  $.fn.mauGallery.methods = {
    createRowWrapper($element) {
      if (!$element.children().first().hasClass("row")) {
        $element.append('<div class="gallery-items-row row"></div>');
      }
    },
    wrapItemInColumn($element, columns) {
      if (columns.constructor === Number) {
        $element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        if (columns.xs) {
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
        $element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },
    moveItemInRowWrapper($element) {
      $element.appendTo(".gallery-items-row");
    },
    responsiveImageItem($element) {
      if ($element.prop("tagName") === "IMG") {
        $element.addClass("img-fluid");
      }
    },
    openLightBox($element, lightboxId) {
      $("#" + lightboxId)
        .find(".lightboxImage")
        .attr("src", $element.attr("src"));
      $("#" + lightboxId).modal("toggle");
    },
   
    createLightBox($gallery, lightboxId, navigation) {
      var lightBoxHTML = `
        <div class="modal fade" id="${lightboxId ? lightboxId : "galleryLightbox"}" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-body">
                ${navigation
                  ? '<div id="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                  : '<span style="display:none;"></span>'}
                <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clic" />
                ${navigation
                  ? '<div id="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">></div>'
                  : '<span style="display:none;"></span>'}
              </div>
            </div>
          </div>
        </div>
      `;

      $gallery.append(lightBoxHTML);
    },

    showItemTags($gallery, position, tags) {
      var tagItems =
        '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
      $.each(tags, function(index, value) {
        tagItems += `<li class="nav-item active">
          <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`;
      });
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      if (position === "bottom") {
        $gallery.append(tagsRow);
      } else if (position === "top") {
        $gallery.prepend(tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },
    filterByTag($gallery, $tagElement) {
      if ($tagElement.hasClass("active-tag")) {
        return;
      }
      $(".active-tag").removeClass("active active-tag");
      $tagElement.addClass("active-tag");

      var tag = $tagElement.data("images-toggle");

      $(".gallery-item").each(function() {
        $(this)
          .parents(".item-column")
          .hide();
        if (tag === "all") {
          $(this)
            .parents(".item-column")
            .show(300);
        } else if ($(this).data("gallery-tag") === tag) {
          $(this)
            .parents(".item-column")
            .show(300);
        }
      });
    }
  };
})(jQuery);