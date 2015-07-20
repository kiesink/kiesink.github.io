avalon.ready(function() {
  var data = {
  };

  var vmMyOrder = avalon.define({
    $id: 'MyOrderCtrl',
    vmid: '7.1',
    title: '我的订单',
    data: data,
    sign: {

    }
  });
  var vmViewOrder = avalon.define({
    $id: 'ViewOrderCtrl',
    vmid: '7.1.1',
    title: '订单详情',
    data: data,
    sign: {

    }
  });
  var vmBookTicket = avalon.define({
    $id: 'BookTicketCtrl',
    vmid: '7.1.1.1',
    title: '订单详情',
    data: data,
    sign: {
        tel: true
    }
  });
  var vmBookRoom = avalon.define({
    $id: 'BookRoomCtrl',
    vmid: '7.1.1.2',
    title: '订单详情',
    data: data,
    sign: {

    }
  });

  avalon.scan();

});
