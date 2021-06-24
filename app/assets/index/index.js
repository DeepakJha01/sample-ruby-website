$(document).ready(function () {
  var loaderTimeout;

  var map = new L.OSM.Map("map", {
    zoomControl: false,
    layerControl: false,
    contextmenu: true,
    worldCopyJump: true
  });

  OSM.loadSidebarContent = function (path, callback) {
    var content_path = path;

    map.setSidebarOverlaid(false);

    clearTimeout(loaderTimeout);

    loaderTimeout = setTimeout(function () {
      $("#sidebar_loader").show();
    }, 200);

    // IE<10 doesn't respect Vary: X-Requested-With header, so
    // prevent caching the XHR response as a full-page URL.
    if (content_path.indexOf("?") >= 0) {
      content_path += "&xhr=1";
    } else {
      content_path += "?xhr=1";
    }

    $("#sidebar_content")
      .empty();

    $.ajax({
      url: content_path,
      dataType: "html",
      complete: function (xhr) {
        clearTimeout(loaderTimeout);
        $("#flash").empty();
        $("#sidebar_loader").hide();

        var content = $(xhr.responseText);

        if (xhr.getResponseHeader("X-Page-Title")) {
          var title = xhr.getResponseHeader("X-Page-Title");
          document.title = decodeURIComponent(title);
        }

        $("head")
          .find("link[type=\"application/atom+xml\"]")
          .remove();

        $("head")
          .append(content.filter("link[type=\"application/atom+xml\"]"));

        $("#sidebar_content").html(content.not("link[type=\"application/atom+xml\"]"));

        if (callback) {
          callback();
        }
      }
    });
  };

  var params = OSM.mapParams();

  map.attributionControl.setPrefix("");

  map.updateLayers(params.layers);

  map.on("baselayerchange", function (e) {
    if (map.getZoom() > e.layer.options.maxZoom) {
      map.setView(map.getCenter(), e.layer.options.maxZoom, { reset: true });
    }
  });


  var bannerExpiry = new Date();
  bannerExpiry.setYear(bannerExpiry.getFullYear() + 1);

  $("#banner .close-wrap").on("click", function (e) {
    var cookieId = e.target.id;
    $("#banner").hide();
    e.preventDefault();
    if (cookieId) {
      Cookies.set(cookieId, "hide", { secure: true, expires: bannerExpiry, path: "/", samesite: "lax" });
    }
  });

  if (OSM.PIWIK) {
    map.on("layeradd", function (e) {
      if (e.layer.options) {
        var goal = OSM.PIWIK.goals[e.layer.options.keyid];

        if (goal) {
          $("body").trigger("piwikgoal", goal);
        }
      }
    });
  }

  if (params.bounds) {
    map.fitBounds(params.bounds);
  } else {
    map.setView([params.lat, params.lon], params.zoom);
  }

  if (params.marker) {
    L.marker([params.mlat, params.mlon]).addTo(map);
  }

  $("#homeanchor").on("click", function (e) {
    e.preventDefault();

    var data = $(this).data(),
        center = L.latLng(data.lat, data.lon);

    map.setView(center, data.zoom);
    L.marker(center, { icon: OSM.getUserIcon() }).addTo(map);
  });

  
  });
});
