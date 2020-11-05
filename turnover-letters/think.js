
var vm = new Vue({
  el: '#app',
  data() {
    return {
      letters1: [],
      letters2: [],
      beforeRotateName: "none",
      afterRotateName: "none",
      btnText: "Just move it",
    }
  },
  mounted(){
    const letter1 = "Hello,Lst!" ,letter2 = "Hello,Bro!" ;
    letter1.split("").forEach(a=>this.letters1.push(a));
    letter2.split("").forEach(a=>this.letters2.push(a));
  },
  methods: {
    moveit() {
      if(this.btnText == "stop") {
        this.beforeRotateName = "none";
        this.afterRotateName = "none";
        this.btnText = "just move it";
      }
      else {
        this.beforeRotateName = "beforeRotate";
        this.afterRotateName = "afterRotate";
        this.btnText = "stop";
        if(this.letters1.length > this.letters2.length) {
            setTimeout(()=> {
                this.beforeRotateName = "none";
                this.afterRotateName = "none";
                this.btnText = "just move it";
            },this.letters1.length * 0.5 * 1000);
        }
        else {
          setTimeout(()=> {
              this.beforeRotateName = "none";
              this.afterRotateName = "none";
              this.btnText = "just move it";
          },this.letters2.length * 0.5 * 1000);
        }
        
      }
    }
  }
});