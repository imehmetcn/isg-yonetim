// Service Worker
self.addEventListener("install", event => {
  console.log("Service Worker installing...");
});

self.addEventListener("activate", event => {
  console.log("Service Worker activating...");
});

// Push notification handler
self.addEventListener("push", event => {
  const options = {
    body: event.data.text(),
    icon: "/icon.png",
    badge: "/badge.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: "1",
    },
    actions: [
      {
        action: "explore",
        title: "Görüntüle",
        icon: "/check.png",
      },
      {
        action: "close",
        title: "Kapat",
        icon: "/close.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("İSG Yönetim Sistemi", options));
});

// Notification click handler
self.addEventListener("notificationclick", event => {
  event.notification.close();

  if (event.action === "explore") {
    // Bildirime tıklandığında yapılacak işlemler
    event.waitUntil(clients.openWindow("/"));
  }
});
