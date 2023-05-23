$(function () {
  $('[data-toggle="tooltip"').tooltip();

  var copyTimeout;
  $(document).on("click", ".copyToClipboard", function (event) {
    if (copyTimeout) {
      clearTimeout(copyTimeout);
    }
    var element = $(event.currentTarget);
    var text = element.data().text;

    element.tooltip("dispose");
    element.attr("title", "copied");
    element.data("trigger", "manual");
    navigator.clipboard.writeText(text);
    element.tooltip("show");

    copyTimeout = setTimeout(() => {
      element.tooltip("dispose");
    }, 1000);
  });
});
