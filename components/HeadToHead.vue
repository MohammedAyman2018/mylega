<template>
  <div>
    <!-- مين لاعب مين قد ايه -->
    <section>
      <h2 class="text-tertiary">
        المواجهات المباشرة
      </h2>

      <table v-if="onLine">
        <tbody>
          <tr v-for="player in players" :key="player.name">
            <td>{{ player.name }}</td>
            <td v-for="(value, name) in player.vs" :key="value + name + Math.random()">
              {{ name }} : {{ value }}
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else>
        لا يوجد اتصال بالانترنت
      </p>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    players: {
      type: Array,
      default: () => []
    },
    onLine: {
      type: Boolean,
      default: () => true
    }
  }
}
</script>

<style>

</style>
