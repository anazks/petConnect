{
    "admin": {
      "settings": {
        "app-name": "Health eCommerce Admin",
        "theme": "default",
        "menu": [
          {
            "name": "E-commerce",
            "slug": "ecommerce",
            "icon": "shopping-cart",
            "links": [
              {"to": "/admin/cart-model", "text": "Carts"},
              {"to": "/admin/order-model", "text": "Orders"}
            ]
          },
          {
            "name": "Users",
            "slug": "users",
            "icon": "users",
            "links": [
              {"to": "/admin/user-model", "text": "Users"},
              {"to": "/admin/seller-model", "text": "Sellers"},
              {"to": "/admin/consultant-model", "text": "Consultants"}
            ]
          },
          {
            "name": "Content",
            "slug": "content",
            "icon": "file-text",
            "links": [
              {"to": "/admin/medicinal-blog-model", "text": "Blogs"},
              {"to": "/admin/news-model", "text": "News"}
            ]
          },
          {
            "name": "Health",
            "slug": "health",
            "icon": "activity",
            "links": [
              {"to": "/admin/health-rep", "text": "Health Reports"}
            ]
          }
        ]
      }
    }
  }