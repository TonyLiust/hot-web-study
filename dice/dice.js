var vm = new Vue({
  el: '#app',
  data() {
    return {
      x: -45,
      y: 45,
      z: 0,
      mx: 0,
      my: 0,
      isPress: false,
      timer: null
    }
  },
  mounted(){
    // this.timer = window.setInterval(this.move,1/60)
    this.$refs.vertical.style.transform = `rotateX(${this.x}deg) `
    this.$refs.horizontal.style.transform = `rotateY(${this.y}deg) `
    
  },
  watch: {
    x(val) {
      this.$refs.vertical.style.transform = `rotateX(${val}deg) `
    },
    y(val) {
      this.$refs.horizontal.style.transform = `rotateY(${val}deg) `
    },
    z(val) {
      this.$refs.horizontal.style.transform = `rotateZ(${val}deg) `
    }
  },
  methods: {
    mousedown (e) {
      this.mx = e.x
      this.my = e.y
      this.isPress = true
    },
    mousemove(e) {
      if (this.isPress) {
        this.x = (this.my - e.y) * 180 /(Math.PI * 1.4 * 120)
        this.y = (e.x - this.mx ) * 180 /(Math.PI * 1.4 * 120)
      }
    },
    mouseup (e) {
      this.isPress = false
    },
    start () {
      if (this.timer) return
      let i = 0;
      this.timer = setInterval(() => {
        this.$refs.vertical.style.transform = `rotateX(90deg) rotateZ(${10*i++}deg) rotateY(-90deg) `
      }, 10)
      
    },
    stop () {
      clearInterval(this.timer)
      this.timer = null
    },
    xchange (e) {
      this.x = e.target.value;
    },
    ychange (e) {
      this.y = e.target.value;
    },
    zchange (e) {
      this.z = e.target.value;
    }
  }
})