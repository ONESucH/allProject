/* Отправляем данные по нужному url из формы */
$('#cards').on('submit', function (event) {

    event.preventDefault(); // собираем данные

    var dataUser = $(this).serialize();
    console.log(data);

   /*

   $.ajax({
      url: 'url',
      method: 'POST',
      data: dataUser,
      done: function () {
          console.log('Отправили');
      },
      error: function () {
          console.log('нет данных');
      }
   })

   */

});