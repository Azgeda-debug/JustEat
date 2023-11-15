import MainLayout from 'layouts/MainLayout.vue'
import HomePage from 'pages/HomePage.vue'
import AuthPage from 'pages/AuthPage.vue'
import ErrorNotFound from 'pages/ErrorNotFound.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children:
      [
        {
          path: ':userId',
          component: HomePage,
          name: 'HomePage',
        },
        {
          path: '/auth',
          component: AuthPage,
          name: 'AuthPage',
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
