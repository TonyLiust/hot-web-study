var vm = new Vue({
  el: '#app',
  data() {
    return {
      balls: {},
      r: 100,
      vx: 1,
      vy: 1,
      btnName: '开始',
      winWidth:0,
      winHeight:0,
      color: '#ff0010',
      ballCount:0
    }
  },
  mounted(){
    // this.timer = window.setInterval(this.move,1/60)
    this.winWidth = window.innerWidth;
    this.winHeight = window.innerHeight;
    window.addEventListener('resize', this.resize)
  },
  computed: {
    maxWidth() {
      return this.winWidth - this.r;
    },
    maxHeight() {
      return this.winHeight- this.r - 200;
    }
  },
  methods: {
    resize () {
      this.winWidth = window.innerWidth;
      this.winHeight = window.innerHeight;
    },
    start () {
      const key = this.ballCount ++;
      const ball = document.createElement('div');
      const x = Math.random() * Math.random() * 200;
      const y = Math.random() * Math.random() * 200;
      ball.style = `top:${x}px;left:${y}px;background-color:${this.color};position:fixed;width:${this.r}px;height:${this.r}px;border-radius:50%`;
      ball.id="div"+key;
      this.$el.appendChild(ball);
      
      const ballPoz = {
        posX: x, 
        posY: y,
        vx: this.vx* Math.random() * 5,
        vy: this.vy* Math.random() * 5,
        life: Math.random() * 30,
        age: 0
      };
      this.balls[key] = ballPoz;
      const _this = this;
      const timer = window.setInterval(() => {
        _this.move(ball, key)
      },1/60)
      ballPoz.timer = timer;
    },
    stop () {
      for(let i = 0; i<this.ballCount; i++) {
        if(this.balls[i]) {
          window.clearInterval(this.balls[i].timer)
        }
      }
    },
    changeColor(e) {
      this.color =  e.target.value;
    },
    rchange (e) {
      this.r = e.target.value;
    },
    vxchange (e) {
      this.vx =  e.target.value;
    },
    vychange (e) {
      this.vy =  e.target.value;
    },
    move (ball, key) {
      const curPoz = this.balls[key]
      curPoz.posX += curPoz.vx;
      curPoz.posY += curPoz.vy;
      if(curPoz.posX > this.maxWidth){
        curPoz.posX = this.maxWidth;
        curPoz.vx = -curPoz.vx;
      }else if(curPoz.posX < 0 ){
        curPoz.posX = 0;
        curPoz.vx = -curPoz.vx;
      }

      if(curPoz.posY > this.maxHeight){
        curPoz.posY = this.maxHeight;
        curPoz.vy = -curPoz.vy;
      } else if(curPoz.posY <0 ){
        curPoz.posY = 0;
        curPoz.vy = -curPoz.vy;
      }
      //console.log("(x,y)="+ curPoz.posX + "," + curPoz.posY);
      ball.style.left = curPoz.posX + 'px';
      ball.style.top = curPoz.posY + 'px';
      curPoz.age += 1/60;
      console.log("(x,y)="+ curPoz.posX + "," + curPoz.posY+'age:'+curPoz.age);
      if (curPoz.age > curPoz.life ) {
        //this.$el.removeChild(ball);
        const pnode = ball.parentNode
        if(pnode) {
          pnode.removeChild(ball);
        }
        this.ballCount--;
        window.clearInterval(curPoz.timer);
      }
    }
  }
})