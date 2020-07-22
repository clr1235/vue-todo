<template>
  <div>
    <input type="checkbox" 
    class="toggle"
    v-model="todo.completed"
    >
    <label for="">{{todo.content}}</label>
  </div>
</template>

<script>
export default {
  props: {
    todo: {
      type: Object,
      required: true
    }
  }
}
</script>