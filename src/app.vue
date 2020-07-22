<template>
  <div id="app">
    <Header></Header>
    <Footer></Footer>
    <Todo></Todo>
  </div>
</template>

<script>
import Header from './todo/header.vue'
import Footer from './todo/footer.jsx'
import Todo from './todo/todo.vue'

export default {
  components: {
    Header,
    Footer,
    Todo
  },
  data() {
    return {
      
    }
  }
}
</script>

<style scoped lang="scss">
  
</style>
