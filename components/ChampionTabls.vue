<template>
  <div>
    <!-- جدول الماتش -->
    <section>
      <h2 class="text-tertiary">
        جدول الترتيب
      </h2>
      <table v-if="onLine">
        <thead>
          <tr>
            <th>الاسم</th>
            <th>المباريات</th>
            <th>ف</th>
            <th>خ</th>
            <th>ت</th>
            <th class="bold">
              النقاط
            </th>
            <th>له</th>
            <th>عليه</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(l, idx) in players" :key="l.name">
            <td>{{ idx + 1 }} - {{ l.name }}</td>
            <td>{{ l.matches }}</td>
            <td>{{ l.win }}</td>
            <td>{{ l.lose }}</td>
            <td>{{ l.draw }}</td>
            <td>{{ (l.win * 3) + l.draw }}</td>
            <td>{{ l.hisGoals }}</td>
            <td>{{ l.othersGoals }}</td>
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
