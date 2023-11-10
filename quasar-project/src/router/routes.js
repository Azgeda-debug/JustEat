import MainLayout from 'layouts/MainLayout.vue'
import HomePage from 'pages/HomePage.vue'
import ErrorNotFound from 'pages/ErrorNotFound.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children:
      [
        {
          path: '',
          component: HomePage,
          name: 'HomePage',
        }
      ]
  },
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound,
    name: 'ErrorNotFound',
  }
]

export default routes
