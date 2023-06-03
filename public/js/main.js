function validatePassword() {
  const password = $('#password').val();
  const firstname = $('#firstname').val();
  const lastname = $('#lastname').val();
  let isValid = true;

  const tests = [
    { pass: password.length >= 8, target: '#pwdReqlen' },
    {
      pass: !password.includes(firstname) && !password.includes(lastname),
      target: '#pwdReqName',
    },
  ];

  for (const test of tests) {
    const target = $(test.target);
    if (test.pass) {
      target.removeClass('text-danger');
      target.addClass('text-success');
    } else {
      target.removeClass('text-success');
      target.addClass('text-danger');
      isValid = false;
    }
  }
  if (isValid) {
    $('#passwordRequirements').collapse('hide');
  } else {
    $('#passwordRequirements').collapse('show');
  }
  return isValid;
}

function validateConfirmPassword() {
  const password = $('#password').val();
  const confirmPassword = $('#confirmPassword').val();
  let isValid = password === confirmPassword;
  if (isValid) {
    $('#confirmPassword').removeClass('border-danger');
  } else {
    $('#confirmPassword').addClass('border-danger');
  }
  return isValid;
}

$(function () {
  $('[data-toggle="tooltip"').tooltip();

  var copyTimeout;
  $(document).on('click', '.copyToClipboard', function (event) {
    if (copyTimeout) {
      clearTimeout(copyTimeout);
    }
    var element = $(event.currentTarget);
    var text = element.data().text;

    element.tooltip('dispose');
    element.attr('title', 'copied');
    element.data('trigger', 'manual');
    navigator.clipboard.writeText(text);
    element.tooltip('show');

    copyTimeout = setTimeout(() => {
      element.tooltip('dispose');
    }, 1000);
  });

  $('#password').on('keyup', function (event) {
    validatePassword();
  });

  $('#confirmPassword').on('keyup', function (event) {
    validateConfirmPassword();
  });

  $('#signupForm').on('submit', function (event) {
    return validatePassword() && validateConfirmPassword();
  });
});
