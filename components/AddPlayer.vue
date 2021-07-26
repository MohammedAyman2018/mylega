<template>
  <div>
    <!-- أضف لاعب -->
    <section class="add-player">
      <h2 class="text-tertiary">
        أضف لاعب
      </h2>
      <div>
        <input v-model="newPlayerName" type="text" placeholder="الاسم">
        <button :disabled="newPlayerName === ''" @click="addPlayer">
          أضف
        </button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      newPlayerName: '' // For new Player
    }
  },
  methods: {
    async addPlayer () {
      await this.$http.$post('/players', { name: this.newPlayerName })
        .then((res) => {
          this.$emit('playerAdded')
          this.newPlayerName = ''
        })
        .catch(res => alert(res))
    }
  }
}
</script>

<style>

</style>
