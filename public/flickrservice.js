var app = app || {};
app.flickrService = {};

app.flickrService.get = function (query) {
    var def = $.Deferred();
    $.ajax({
        dataType: "json",
        url: "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
        data: { tags: query, format: "json" }
    }).then(function (data) {
        console.log("Successfully retreived data from flickr");
        def.resolve(data.items);
    }).fail(function (err) {
        console.error("Error while fetching from flickr", err);
        def.reject(err);
    });

    return def.promise();
}
