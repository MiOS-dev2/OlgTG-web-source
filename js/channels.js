(function () {
  window.Channels = {
    api: function () { return window.OLDTG_CONFIG.channels; },
    postsApi: function () { return window.OLDTG_CONFIG.posts; },

    get all() {
      return fetch(window.OLDTG_CONFIG.channels, { cache: 'no-store' })
        .then(function (r) { return r.json(); })
        .then(function (d) { return Array.isArray(d) ? d : []; })
        .catch(function () { return []; });
    },

    get my() {
      var api = window.OLDTG_CONFIG.channels;
      var me = window.S && window.S.me ? String(window.S.me.id) : '';
      return fetch(api, { cache: 'no-store' })
        .then(function (r) { return r.json(); })
        .then(function (arr) {
          if (!Array.isArray(arr)) return [];
          return arr.filter(function (c) { return String(c.ownerId) === me; });
        })
        .catch(function () { return []; });
    },

    create: function (ownerId, ownerLogin, ownerName, title, username, avatar) {
      var api = window.OLDTG_CONFIG.channels;
      var body = {
        ownerId: String(ownerId),
        ownerLogin: ownerLogin,
        ownerName: ownerName,
        title: title,
        username: username,
        avatar: avatar || 'img/user.png',
        createdAt: new Date().toISOString(),
        subscribers: String(ownerId),
        posts: 0
      };
      return fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then(function (r) { return r.json(); });
    },

    update: function (channelId, data) {
      var api = window.OLDTG_CONFIG.channels + '/' + channelId;
      return fetch(api, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); });
    },

    subscribe: function (channel, userId) {
      var subs = String(channel.subscribers || '');
      var list = subs.split(',').filter(function (x) { return x && x.length; });
      if (list.indexOf(String(userId)) >= 0) return Promise.resolve(channel);
      list.push(String(userId));
      return this.update(channel.id, { subscribers: list.join(',') });
    },

    unsubscribe: function (channel, userId) {
      var subs = String(channel.subscribers || '');
      var list = subs.split(',').filter(function (x) { return x && x.length && x !== String(userId); });
      return this.update(channel.id, { subscribers: list.join(',') });
    },

    isSubscribed: function (channel, userId) {
      var subs = String(channel.subscribers || '');
      var list = subs.split(',');
      return list.indexOf(String(userId)) >= 0;
    },

    posts: function (channelId) {
      var api = window.OLDTG_CONFIG.posts;
      return fetch(api, { cache: 'no-store' })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!Array.isArray(d)) return [];
          return d.filter(function (p) { return String(p.channelId) === String(channelId); });
        })
        .catch(function () { return []; });
    },

    addPost: function (channelId, body) {
      var api = window.OLDTG_CONFIG.posts;
      return fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: String(channelId),
          body: body,
          createdAt: new Date().toISOString()
        })
      }).then(function (r) { return r.json(); });
    }
  };
})();