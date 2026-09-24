(function () {
  var _p = [
    'aHR0cHM6Ly82YTk0NGJhMjBlODk1', 'Z2FyYmFnZTFfX19fX19fX19f',
    'YjE0NWU1ZjVlMmEubW9ja2FwaS5p', 'X19fX2dhcmJhZ2UyX19fX19f',
    'by9hY2MtcmVz', 'Z2FyYmFnZTNfX19fX19fX19f',
    'aHR0cHM6Ly82YTk0NGJhMjBlODk1', 'X19fX2dhcmJhZ2U0X19fX19f',
    'YjE0NWU1ZjVlMmEubW9ja2FwaS5p', 'Z2FyYmFnZTVfX19fX19fX19f',
    'by9hcGktZnJt', 'X19fX2dhcmJhZ2U2X19fX19f',
    'aHR0cHM6Ly82YWFlOTc3YzYwNmJk', 'Z2FyYmFnZTdfX19fX19fX19f',
    'OTE1ZDExMGVmM2YubW9ja2FwaS5p', 'X19fX2dhcmJhZ2U4X19fX19f',
    'by9vbGR0Z3M', 'Z2FyYmFnZTlfX19fX19fX19f',
    'aHR0cHM6Ly82YWFlOTc3YzYwNmJk', 'X19fX2dhcmJhZ2UxMF9fX19f',
    'OTE1ZDExMGVmM2YubW9ja2FwaS5p', 'Z2FyYmFnZTExX19fX19fX19f',
    'by9jYW5uYWxlZA', 'X19fX2dhcmJhZ2UxMl9fX19f',
    'aHR0cHM6Ly82YWFlOWYyMzYwNmJk', 'Z2FyYmFnZTEzX19fX19fX19f',
    'OTE1ZDExMGY2N2UubW9ja2FwaS5p', 'X19fX2dhcmJhZ2UxNF9fX19f',
    'by9jYW5fbXNn', 'Z2FyYmFnZTE1X19fX19fX19f'
  ];

  function _b(i) { return atob(_p[i]); }

  var _cache = {};
  function _g(a, b, c) {
    var k = a + ',' + b + ',' + c;
    if (_cache[k]) return _cache[k];
    var s = _b(a) + _b(b) + _b(c);
    _cache[k] = s;
    return s;
  }

  window.OLDTG_CONFIG = {
    get acc()      { return _g(0, 2, 4); },
    get msg()      { return _g(6, 8, 10); },
    get bot()      { return _g(12, 14, 16); },
    get channels() { return _g(18, 20, 22); },
    get posts()    { return _g(24, 26, 28); },
    poll: 2000,
    version: '1.2.0',
    author: 'Mikhail',
    botId: 'oldtgs',
    botName: 'OldTG',
    botUsername: 'oldtgs',
    botAvatar: 'img/oldtg.png',
    defaultAvatar: 'img/user.png'
  };
})();