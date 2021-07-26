<template>
  <div id="app">
    <div class="wrapper">
      <div>
        <h2 class="text-tertiary">
          انشاء دوري جديد
        </h2>

        <div class="form-control">
          <label for="name">اسم الدوري</label>
          <input id="name" v-model="league.name" type="text">
        </div>

        <div class="form-control">
          <label for="password">كلمة المرور</label>
          <input id="password" v-model="league.password" type="password">
        </div>

        <div>
          <nuxt-link to="/login">
            لديك دوري بالفعل؟ تسجيل دخول
          </nuxt-link>
        </div>
        <button @click="createLeague">
          إنشاء
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      league: {
        name: '',
        password: ''
      }
    }
  },
  methods: {
    createLeague () {
      this.$http.$post('/leagues/new', this.league)
        .then((res) => {
          alert('تم انشاء الدوري بنجاح! سجل دخول الان')
          this.$router.push('/login')
        })
        .catch(res => alert(res))
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
}
.form-control {
  margin-bottom: 10px
}
.form-control label {
  display: block;
  color: white
}
.form-control input {
  padding: 10px;
  border-radius: 10px;
  color: black !important
}
</style>
