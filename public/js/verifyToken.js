$(function () {
  $(document).on('keyup', '.otpCode', function (event) {
    const element = $(event.currentTarget);
    if (event.which >= 48 && event.which <= 57) element.next().focus();

    if (event.which === 8) {
      element.prev().focus();
    }
  });

  $(document).on('paste', '.otpCode', function (event) {
    event.preventDefault();
    navigator.clipboard.readText().then((text) => {
      $('.otpCode').each(function (i, element) {
        if (i < text.length) {
          $(element).val(text[i]);
        }
      });
    });
  });
});
