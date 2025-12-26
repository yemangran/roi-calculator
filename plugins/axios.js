export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    onRequest({ request }) {
      console.log('Making request to ' + request)
    }
  })

  return {
    provide: {
      api
    }
  }
})
